import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { MessageSquare, Send, Copy, Eye, EyeOff, Bookmark, Check, Zap, Clock, Calendar, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { useApp } from '@/context/AppContext';

const CHANNEL_LIMITS = { Email: 500, LinkedIn: 300, Video: 200 };

function ScoreGauge({ score, label }) {
    const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span className="text-xs font-bold" style={{ color }}>{score}/100</span>
            </div>
            <div className="score-bar"><div className="score-bar-fill" style={{ width: `${score}%`, background: `linear-gradient(90deg,${color}88,${color})` }} /></div>
        </div>
    );
}

export default function OutreachCreator() {
    const router = useRouter();
    const { isAuthenticated, recruiters, messageTemplates, sendMessage } = useApp();
    const [tab, setTab] = useState('compose');
    const [selectedRecruiter, setSelectedRecruiter] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [body, setBody] = useState('');
    const [subject, setSubject] = useState('');
    const [preview, setPreview] = useState(false);
    const [copied, setCopied] = useState(false);
    const [sent, setSent] = useState(false);
    const [aiImproving, setAiImproving] = useState(false);
    const [sequenceMode, setSequenceMode] = useState(false);
    const [savedTemplates, setSavedTemplates] = useState([]);
    const { user } = useApp();

    useEffect(() => { if (!isAuthenticated) router.replace('/'); }, [isAuthenticated, router]);

    const fillTemplate = (template, recruiter) => {
        if (!template || !recruiter) return { body: template?.body || '', subject: template?.subject || '' };
        const vars = {
            recruiterName: recruiter.name.split(' ')[0],
            company: recruiter.company,
            jobTitle: 'Frontend Developer',
            experience: '4+ years',
            skills: user.skills || 'React, TypeScript',
            myName: user.name,
        };
        const fill = (s) => s ? Object.entries(vars).reduce((t, [k, v]) => t.replaceAll(`{${k}}`, v), s) : '';
        return { body: fill(template.body), subject: fill(template.subject || '') };
    };

    useEffect(() => {
        if (selectedTemplate && selectedRecruiter) {
            const { body: b, subject: s } = fillTemplate(selectedTemplate, selectedRecruiter);
            setBody(b); setSubject(s);
        }
    }, [selectedTemplate, selectedRecruiter]);

    const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
    const charCount = body.length;
    const limit = selectedTemplate ? CHANNEL_LIMITS[selectedTemplate.channel] : 500;
    const overLimit = wordCount > limit;

    const messageScore = {
        tone: body.length > 50 ? 82 : 40,
        personalization: selectedRecruiter ? 88 : 30,
        length: wordCount >= 50 && wordCount <= 120 ? 90 : wordCount < 50 ? 55 : 70,
    };

    const handleAiImprove = async () => {
        setAiImproving(true);
        await new Promise(r => setTimeout(r, 1500));
        setBody(b => b + '\n\nP.S. I noticed your recent work at ' + (selectedRecruiter?.company || 'your company') + ' — truly impressive. I\'d love to bring similar energy to the team.');
        setAiImproving(false);
    };

    const handleSend = () => {
        if (!selectedRecruiter || !body) return;
        sendMessage({ recruiterId: selectedRecruiter.id, recruiterName: selectedRecruiter.name, company: selectedRecruiter.company, channel: selectedTemplate?.channel || 'Email', template: selectedTemplate?.name || 'Custom', subject, content: body, matchScore: 85 });
        setSent(true);
        setTimeout(() => setSent(false), 2000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(body);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveTemplate = () => {
        if (!body) return;
        setSavedTemplates(prev => [...prev, { id: Date.now(), name: `Custom ${prev.length + 1}`, body, subject, channel: selectedTemplate?.channel || 'Email', createdAt: 'Just now' }]);
    };

    if (!isAuthenticated) return null;

    return (
        <Layout>
            <Head><title>Outreach Creator — JobFlow</title></Head>
            <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Outreach Creator</h1>
                        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Craft personalized messages with AI assistance</p>
                    </div>
                    <div className="pill-toggle">
                        <button className={tab === 'compose' ? 'active' : ''} onClick={() => setTab('compose')}>Compose</button>
                        <button className={tab === 'templates' ? 'active' : ''} onClick={() => setTab('templates')}>Templates</button>
                    </div>
                </div>

                {tab === 'compose' && (
                    <div className="grid lg:grid-cols-3 gap-4">
                        {/* Left: Recruiter + Template selection */}
                        <div className="space-y-4">
                            {/* Recruiter */}
                            <div className="card-dark p-4">
                                <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Select Recruiter</h3>
                                {recruiters.length === 0 ? (
                                    <button onClick={() => router.push('/recruiter-enrichment')} className="btn-ghost w-full text-sm justify-center">Get Recruiters First</button>
                                ) : (
                                    <div className="space-y-2">
                                        {recruiters.slice(0, 6).map(r => (
                                            <div key={r.id} onClick={() => setSelectedRecruiter(r)} className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all" style={{ background: selectedRecruiter?.id === r.id ? 'rgba(59,130,246,0.12)' : 'var(--glass)', border: selectedRecruiter?.id === r.id ? '1px solid rgba(59,130,246,0.35)' : '1px solid var(--border)' }}>
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#a855f7)' }}>{r.avatar}</div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                                                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{r.company}</p>
                                                </div>
                                                {selectedRecruiter?.id === r.id && <Check size={13} style={{ color: '#60a5fa', shrink: 0 }} />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Template */}
                            <div className="card-dark p-4">
                                <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Choose Template</h3>
                                <div className="space-y-2">
                                    {messageTemplates.map(t => (
                                        <div key={t.id} onClick={() => setSelectedTemplate(t)} className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all" style={{ background: selectedTemplate?.id === t.id ? 'rgba(59,130,246,0.12)' : 'var(--glass)', border: selectedTemplate?.id === t.id ? '1px solid rgba(59,130,246,0.35)' : '1px solid var(--border)' }}>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                                                    <span className="badge badge-gray" style={{ fontSize: '10px', padding: '2px 6px' }}>{t.channel}</span>
                                                </div>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <div className="score-bar w-12"><div className="score-bar-fill" style={{ width: `${t.score}%`, background: 'linear-gradient(90deg,#3b82f6,#00e5ff)' }} /></div>
                                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.score}/100</span>
                                                </div>
                                            </div>
                                            {selectedTemplate?.id === t.id && <Check size={13} style={{ color: '#60a5fa' }} />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Center: Composer */}
                        <div className="lg:col-span-2 space-y-3">
                            <div className="card-dark p-5">
                                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                    <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Message</h3>
                                    <div className="flex gap-2 flex-wrap">
                                        <button onClick={handleAiImprove} disabled={aiImproving || !body} className="btn-ghost text-xs py-1.5 px-3">
                                            {aiImproving ? (<><div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />Improving…</>) : (<><Zap size={12} />AI Improve</>)}
                                        </button>
                                        <button onClick={() => setPreview(!preview)} className="btn-ghost text-xs py-1.5 px-3">
                                            {preview ? <><EyeOff size={12} />Edit</> : <><Eye size={12} />Preview</>}
                                        </button>
                                    </div>
                                </div>

                                {selectedTemplate?.subject && (
                                    <input className="input-dark mb-3 text-sm" placeholder="Subject line" value={subject} onChange={e => setSubject(e.target.value)} readOnly={preview} />
                                )}

                                {preview ? (
                                    <div className="p-4 rounded-xl min-h-48 text-sm leading-relaxed whitespace-pre-wrap" style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{body || <span style={{ color: 'var(--text-muted)' }}>Select a recruiter and template to preview…</span>}</div>
                                ) : (
                                    <textarea className="input-dark text-sm leading-relaxed resize-none" style={{ minHeight: '220px' }} placeholder="Select a recruiter and template, or write your own message…" value={body} onChange={e => setBody(e.target.value)} />
                                )}

                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs font-mono" style={{ color: overLimit ? '#f87171' : 'var(--text-muted)' }}>{wordCount} words · {charCount} chars {selectedTemplate && `· limit ~${limit} words`}</span>
                                </div>

                                {/* Sequence mode */}
                                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                                            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Follow-up Sequence</span>
                                        </div>
                                        <button onClick={() => setSequenceMode(!sequenceMode)} className="badge cursor-pointer" style={{ background: sequenceMode ? 'rgba(59,130,246,0.15)' : 'var(--glass)', border: sequenceMode ? '1px solid rgba(59,130,246,0.3)' : '1px solid var(--border)', color: sequenceMode ? '#60a5fa' : 'var(--text-muted)' }}>{sequenceMode ? 'Enabled' : 'Enable'}</button>
                                    </div>
                                    {sequenceMode && (
                                        <div className="flex gap-2 flex-wrap">
                                            {['Day 1 (Now)', 'Day 4 (Follow-up)', 'Day 7 (Final)'].map((d, i) => (
                                                <div key={d} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs" style={{ background: i === 0 ? 'rgba(59,130,246,0.12)' : 'var(--glass)', border: `1px solid ${i === 0 ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`, color: i === 0 ? '#60a5fa' : 'var(--text-muted)' }}>
                                                    <Clock size={10} />{d}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-4 flex-wrap">
                                    <button onClick={handleSend} disabled={!selectedRecruiter || !body || sent} className="btn-primary flex-1 min-w-0">
                                        {sent ? <><Check size={14} />Sent!</> : <><Send size={14} />Send</>}
                                    </button>
                                    <button onClick={handleCopy} disabled={!body} className="btn-ghost"><Copy size={14} />{copied ? 'Copied!' : 'Copy'}</button>
                                    <button onClick={handleSaveTemplate} disabled={!body} className="btn-ghost"><Bookmark size={14} />Save</button>
                                </div>
                            </div>

                            {/* Message score */}
                            {body.length > 20 && (
                                <div className="card-dark p-4 space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Message Quality</p>
                                    <ScoreGauge score={messageScore.tone} label="Tone & Clarity" />
                                    <ScoreGauge score={messageScore.personalization} label="Personalization" />
                                    <ScoreGauge score={messageScore.length} label="Optimal Length" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {tab === 'templates' && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...messageTemplates, ...savedTemplates].map(t => (
                            <div key={t.id} className="card-dark p-5 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                                        <span className="badge badge-gray mt-1" style={{ fontSize: '10px' }}>{t.channel}</span>
                                    </div>
                                    {t.score && <div className="text-center"><div className="text-lg font-black" style={{ color: '#60a5fa' }}>{t.score}</div><div className="text-xs" style={{ color: 'var(--text-muted)' }}>score</div></div>}
                                </div>
                                <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>{t.body.slice(0, 120)}…</p>
                                <button onClick={() => { setSelectedTemplate(t); setTab('compose'); }} className="btn-ghost w-full text-xs justify-center">Use Template <ChevronRight size={12} /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
