import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Users, Mail, Linkedin, Phone, Download, RefreshCw, CheckCircle2, Send, Filter, ShieldCheck, Loader2, Lock, Unlock, Search, Zap } from 'lucide-react';
import Layout from '@/components/Layout';
import { useApp } from '@/context/AppContext';

const STATUS_COLORS = {
    'Not Contacted': { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', color: '#94a3b8' },
    'Contacted': { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
    'Replied': { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', color: '#34d399' },
    'Opened': { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', color: '#fbbf24' },
};

function ConfidenceMeter({ score }) {
    const color = score >= 85 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';
    return (
        <div className="flex items-center gap-2">
            <div className="score-bar w-16"><div className="score-bar-fill" style={{ width: `${score}%`, background: `linear-gradient(90deg,${color}88,${color})` }} /></div>
            <span className="text-xs font-bold font-mono" style={{ color }}>{score}%</span>
        </div>
    );
}

export default function RecruiterEnrichment() {
    const router = useRouter();
    const { isAuthenticated, savedJobs, recruiters, addRecruiter, updateRecruiterStatus } = useApp();
    const [selectedJobs, setSelectedJobs] = useState([]);

    // Simulation State
    const [extracting, setExtracting] = useState(false);
    const [extractLog, setExtractLog] = useState('');
    const [extractedCount, setExtractedCount] = useState(0);

    const [verifying, setVerifying] = useState(null); // ID of recruiter being verified
    const [unlocked, setUnlocked] = useState([]); // IDs of unlocked recruiters
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => { if (!isAuthenticated) router.replace('/'); }, [isAuthenticated, router]);

    const toggleJob = (id) => setSelectedJobs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleExtract = async () => {
        setExtracting(true);
        setExtractedCount(0);

        const logs = [
            "Scanning company directories...",
            "Identifying hiring managers...",
            "Cross-referencing LinkedIn profiles...",
            "Verifying email patterns...",
            "Validating phone numbers...",
        ];

        for (const log of logs) {
            setExtractLog(log);
            await new Promise(r => setTimeout(r, 600));
        }

        // Simulate finding realistic recruiters based on selected jobs
        // ideally we'd fetch from a mock pool, but here we'll just re-add existing ones or create new mock ones
        // For the demo, we'll just pretend to find the ones already in the list + maybe duplicates if we had a large pool
        // But since `recruiters` in context is small, we'll just simulate the action.

        const newRecs = selectedJobs.map(jobId => {
            const job = savedJobs.find(j => j.id === jobId);
            const comp = job?.company || 'Company';
            const safeCompStr = comp.toLowerCase().replace(/[^a-z0-9]/g, '');
            return {
                id: Date.now() + Math.random(),
                name: 'Anjali Gupta', // Generic for demo
                title: 'Talent Acquisition',
                company: comp,
                email: `anjali@${safeCompStr}.com`,
                linkedin: `linkedin.com/in/anjali-${safeCompStr}`,
                phone: '+91-98765-XXXXX',
                avatar: 'AG',
                status: 'Not Contacted',
                confidence: Math.floor(Math.random() * (98 - 75) + 75),
                jobId: jobId
            };
        });

        newRecs.forEach(r => addRecruiter(r));
        setExtractedCount(newRecs.length);
        setExtractLog('Enrichment complete.');
        setExtracting(false);
    };

    const handleVerify = async (id) => {
        setVerifying(id);
        await new Promise(r => setTimeout(r, 1500));
        setUnlocked(prev => [...prev, id]);
        setVerifying(null);
    };

    const exportCSV = () => {
        const data = recruiters;
        const csv = ['Name,Title,Company,Email,LinkedIn,Phone,Status,Confidence',
            ...data.map(r => `"${r.name}","${r.title}","${r.company}","${r.email}","${r.linkedin}","${r.phone}","${r.status}",${r.confidence}`)
        ].join('\n');
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv])); a.download = 'recruiters.csv'; a.click();
    };

    const filteredRecruiters = statusFilter === 'All' ? recruiters : recruiters.filter(r => r.status === statusFilter);
    const statuses = ['All', 'Not Contacted', 'Contacted', 'Opened', 'Replied'];

    if (!isAuthenticated) return null;

    return (
        <Layout>
            <Head><title>Recruiter Enrichment — JobFlow</title></Head>

            {/* Floating Decorative Brain Image */}
            <div className="absolute top-[10%] left-[-5%] w-[350px] xl:w-[450px] opacity-[0.06] xl:opacity-[0.1] mix-blend-screen animate-float pointer-events-none z-0" style={{ animationDuration: '16s' }}>
                <img src="/brain.png" alt="AI Enrichment Core" className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(59,130,246,0.4)]" />
            </div>

            <div className="space-y-6 animate-fade-in relative z-10 max-w-7xl mx-auto">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Recruiter Enrichment</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>AI-powered contact discovery and verification</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Stats */}
                    {[
                        { label: 'Total Recruiters', val: recruiters.length, color: '#3b82f6', icon: Users },
                        { label: 'Verified Contacts', val: unlocked.length + 5, color: '#10b981', icon: ShieldCheck }, // +5 for Mock data
                        { label: 'Avg Confidence', val: recruiters.length ? Math.round(recruiters.reduce((s, r) => s + r.confidence, 0) / recruiters.length) : 0, suffix: '%', color: '#f59e0b', icon: Zap },
                    ].map(({ label, val, suffix = '', color, icon: Icon }) => (
                        <div key={label} className="card-dark p-5 flex items-center gap-4 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Icon size={64} color={color} /></div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20`, color }}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-black" style={{ color }}>{val}{suffix}</div>
                                <p className="text-xs font-bold uppercase tracking-wider opacity-60" style={{ color: 'var(--text-primary)' }}>{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Job Selection - Left Col */}
                    <div className="lg:col-span-4 card-dark p-0 overflow-hidden flex flex-col h-[600px]">
                        <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                            <h2 className="font-bold text-sm flex items-center justify-between" style={{ color: 'var(--text-primary)' }}>
                                Source Jobs <span className="badge badge-gray">{savedJobs.length}</span>
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {savedJobs.length === 0 ? (
                                <div className="text-center py-10 px-4">
                                    <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Save jobs to find their recruiters</p>
                                    <button onClick={() => router.push('/job-scraper')} className="btn-primary w-full text-sm">Find Jobs</button>
                                </div>
                            ) : (
                                savedJobs.map(j => (
                                    <div key={j.id} onClick={() => toggleJob(j.id)} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-[var(--glass)]"
                                        style={{
                                            background: selectedJobs.includes(j.id) ? 'rgba(59,130,246,0.1)' : 'transparent',
                                            border: selectedJobs.includes(j.id) ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent'
                                        }}>
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedJobs.includes(j.id) ? 'bg-blue-500 border-blue-500' : 'border-[var(--text-muted)]'}`}>
                                            {selectedJobs.includes(j.id) && <CheckCircle2 size={14} className="text-white" />}
                                        </div>
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg,#1e3a8a,#3b82f6)' }}>{j.logo}</div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{j.title}</p>
                                            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{j.company}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-5 border-t border-[var(--border)] bg-[var(--bg-elevated)] space-y-3">
                            <button onClick={handleExtract} disabled={extracting || selectedJobs.length === 0} className="btn-primary w-full h-12 text-sm font-bold shadow-lg shadow-blue-600/20">
                                {extracting ? (
                                    <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> {extractLog}</span>
                                ) : (
                                    <span className="flex items-center gap-2"><Search size={16} /> Find Recruiters ({selectedJobs.length})</span>
                                )}
                            </button>
                            {extractedCount > 0 && !extracting && (
                                <div className="text-xs text-center text-green-400 font-medium bg-green-500/10 py-2 rounded-lg border border-green-500/20">
                                    Successfully enriched {extractedCount} profiles
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recruiter List - Right Col */}
                    <div className="lg:col-span-8 card-dark p-0 overflow-hidden flex flex-col h-[600px]">
                        <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-between flex-wrap gap-3">
                            <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Enriched Profiles <span className="badge badge-gray ml-2">{filteredRecruiters.length}</span></h2>
                            <div className="flex gap-2">
                                {statuses.map(s => (
                                    <button key={s} onClick={() => setStatusFilter(s)} className="text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg transition-all"
                                        style={{
                                            background: statusFilter === s ? 'var(--primary)' : 'var(--glass)',
                                            color: statusFilter === s ? 'white' : 'var(--text-muted)'
                                        }}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {filteredRecruiters.length === 0 ? (
                                <div className="text-center py-20 flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-[var(--glass)] flex items-center justify-center mb-4"><Users size={24} className="text-[var(--text-muted)]" /></div>
                                    <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>No recruiters found</p>
                                    <p className="text-sm mt-1 max-w-xs" style={{ color: 'var(--text-muted)' }}>Select jobs from the left panel and click 'Find Recruiters' to start enrichment.</p>
                                </div>
                            ) : (
                                filteredRecruiters.map(r => {
                                    const isUnlocked = unlocked.includes(r.id) || r.id <= 5; // First 5 are mock unlocked
                                    const isVerifying = verifying === r.id;

                                    return (
                                        <div key={r.id} className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--glass)] hover:border-blue-500/30 transition-all group">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-black text-white shrink-0 shadow-md ring-2 ring-[var(--bg-base)]" style={{ background: 'linear-gradient(135deg,#3b82f6,#a855f7)' }}>{r.avatar}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{r.name}</h3>
                                                            {isUnlocked && <ShieldCheck size={14} className="text-green-500" />}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <ConfidenceMeter score={r.confidence} />
                                                            <span className="badge text-[10px] px-2 py-0.5" style={{ ...STATUS_COLORS[r.status] }}>{r.status}</span>
                                                        </div>
                                                    </div>

                                                    <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{r.title} at <span className="text-[var(--text-primary)] font-medium">{r.company}</span></p>

                                                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                                                        <div className={`flex items-center gap-2 text-xs p-2 rounded-lg ${isUnlocked ? 'bg-blue-500/10 text-blue-400' : 'bg-[var(--bg-base)] text-[var(--text-muted)]'}`}>
                                                            <Mail size={12} />
                                                            {isUnlocked ? r.email : '••••••••••••@company.com'}
                                                        </div>
                                                        <div className={`flex items-center gap-2 text-xs p-2 rounded-lg ${isUnlocked ? 'bg-blue-500/10 text-blue-400' : 'bg-[var(--bg-base)] text-[var(--text-muted)]'}`}>
                                                            <Phone size={12} />
                                                            {isUnlocked ? r.phone : '+91 ••••• •••••'}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                                                        <a href={`https://${r.linkedin}`} target="_blank" className="flex items-center gap-1.5 text-xs font-semibold hover:underline" style={{ color: '#0077b5' }}>
                                                            <Linkedin size={12} /> View Profile
                                                        </a>

                                                        <div className="flex gap-2">
                                                            {!isUnlocked ? (
                                                                <button onClick={() => handleVerify(r.id)} disabled={isVerifying} className="btn-primary text-xs py-1.5 px-3 h-8">
                                                                    {isVerifying ? <Loader2 size={12} className="animate-spin" /> : <><Unlock size={12} /> Unlock Contact</>}
                                                                </button>
                                                            ) : (
                                                                <button onClick={() => router.push('/outreach-creator')} className="btn-ghost border border-[var(--border)] text-xs h-8 hover:bg-[var(--glass)]">
                                                                    <Send size={12} /> Compose Message
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
