import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Briefcase, Users, MessageSquare, TrendingUp, ArrowRight, Bookmark, Clock, Target, Zap, Activity, Bell } from 'lucide-react';
import Layout from '@/components/Layout';
import { useApp } from '@/context/AppContext';

function AnimCounter({ end, duration = 1400, prefix = '', suffix = '' }) {
    const [val, setVal] = useState(0);
    const mounted = useRef(false);
    useEffect(() => {
        if (mounted.current) return;
        mounted.current = true;
        let s = 0;
        const step = end / (duration / 16);
        const t = setInterval(() => {
            s = Math.min(s + step, end);
            setVal(Math.floor(s));
            if (s >= end) clearInterval(t);
        }, 16);
    }, [end, duration]);
    return <span>{prefix}{val.toLocaleString()}{suffix}</span>;
}

function ProgressRing({ pct, size = 80, stroke = 7, color = '#3b82f6' }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const [offset, setOffset] = useState(circ);
    useEffect(() => {
        const timer = setTimeout(() => setOffset(circ * (1 - pct / 100)), 200);
        return () => clearTimeout(timer);
    }, [pct, circ]);
    return (
        <svg width={size} height={size} className="rotate-[-90deg]">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
        </svg>
    );
}

const activities = [
    { icon: '💬', text: 'Sarah Johnson replied to your message!', time: '2h ago', color: '#3b82f6' },
    { icon: '🔍', text: '12 new Frontend jobs matched your profile', time: '4h ago', color: '#a855f7' },
    { icon: '⏰', text: 'Follow-up due: Mike Chen @ StartupXYZ', time: '6h ago', color: '#f59e0b' },
    { icon: '✅', text: 'Recruiter info extracted for 3 new jobs', time: '1d ago', color: '#10b981' },
    { icon: '📊', text: 'Your reply rate improved to 38%', time: '2d ago', color: '#00e5ff' },
];

export default function Dashboard() {
    const router = useRouter();
    const { isAuthenticated, stats, savedJobs, followUps } = useApp();

    useEffect(() => {
        if (!isAuthenticated) router.replace('/');
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const { funnel, weeklyProgress, weeklyGoal = 10, aiScore, responseRate } = stats;
    const funnelSteps = [
        { label: 'Jobs Found', val: funnel.jobSearch, color: '#3b82f6' },
        { label: 'Enriched', val: funnel.enrichment, color: '#a855f7' },
        { label: 'Messaged', val: funnel.outreach, color: '#10b981' },
        { label: 'Replies', val: funnel.responses, color: '#f59e0b' },
    ];

    return (
        <Layout>
            <Head><title>Dashboard — JobFlow</title></Head>

            {/* Floating Decorative Brain Image */}
            <div className="absolute top-[-5%] right-[-5%] w-[400px] xl:w-[600px] opacity-10 xl:opacity-15 mix-blend-screen animate-float pointer-events-none z-0" style={{ animationDuration: '12s' }}>
                <img src="/brain.png" alt="AI Brain Decor" className="w-full h-full object-contain filter drop-shadow-[0_0_60px_rgba(59,130,246,0.5)]" />
            </div>

            <div className="space-y-6 animate-fade-in relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
                        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Your job search command center</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => router.push('/job-scraper')} className="btn-primary text-sm">
                            <Zap size={14} /> Search Jobs
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
                    {[
                        { icon: Briefcase, label: 'Saved Jobs', val: stats.savedJobs, suf: '', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', href: '/job-scraper' },
                        { icon: Users, label: 'Recruiters', val: stats.recruiters, suf: '', color: '#a855f7', bg: 'rgba(168,85,247,0.1)', href: '/recruiter-enrichment' },
                        { icon: MessageSquare, label: 'Messages Sent', val: stats.messagesSent, suf: '', color: '#10b981', bg: 'rgba(16,185,129,0.1)', href: '/outreach-creator' },
                        { icon: TrendingUp, label: 'Reply Rate', val: responseRate, suf: '%', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', href: '/tracking' },
                    ].map(({ icon: Icon, label, val, suf, color, bg, href }, i) => (
                        <div key={label} className="card-dark p-5 cursor-pointer animate-slide-up" style={{ animationDelay: `${i * 80}ms` }} onClick={() => router.push(href)}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}><Icon size={18} style={{ color }} /></div>
                                <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                            </div>
                            <div className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}><AnimCounter end={val} suffix={suf} /></div>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                        </div>
                    ))}
                </div>

                {/* Middle row: AI Score + Goal + Follow-ups */}
                <div className="grid lg:grid-cols-3 gap-4">
                    {/* AI Score */}
                    <div className="card-dark p-6 flex flex-col items-center text-center">
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>AI Job Readiness</p>
                        <div className="relative">
                            <ProgressRing pct={aiScore} size={100} stroke={8} color="#3b82f6" />
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{aiScore}</span>
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ 100</span>
                            </div>
                        </div>
                        <p className="text-sm font-semibold mt-3" style={{ color: '#60a5fa' }}>Good Profile</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Add resume to boost score</p>
                    </div>

                    {/* Weekly Goal */}
                    <div className="card-dark p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Target size={16} style={{ color: '#f59e0b' }} />
                            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Weekly Goal</span>
                            <span className="badge badge-orange ml-auto">{weeklyProgress}/{weeklyGoal} apps</span>
                        </div>
                        <div className="score-bar mb-2">
                            <div className="score-bar-fill" style={{ width: `${(weeklyProgress / weeklyGoal) * 100}%`, background: 'linear-gradient(90deg,#f59e0b,#f97316)' }} />
                        </div>
                        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{weeklyGoal - weeklyProgress} more to hit your weekly target</p>
                        <div className="space-y-2">
                            {funnelSteps.map(({ label, val, color }) => (
                                <div key={label} className="flex items-center justify-between">
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 score-bar">
                                            <div className="score-bar-fill" style={{ width: `${Math.min((val / (funnel.jobSearch || 1)) * 100, 100)}%`, background: color }} />
                                        </div>
                                        <span className="text-xs font-bold w-6 text-right" style={{ color }}>{val}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Follow-up reminders */}
                    <div className="card-dark p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Bell size={15} style={{ color: '#ef4444' }} />
                            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Follow-ups Due</span>
                            {followUps.length > 0 && <span className="badge badge-red ml-auto">{followUps.length}</span>}
                        </div>
                        <div className="space-y-2">
                            {followUps.length === 0 ? (
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>All caught up! 🎉</p>
                            ) : followUps.slice(0, 3).map(f => (
                                <div key={f.id} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: f.priority === 'high' ? 'rgba(239,68,68,0.07)' : 'rgba(245,158,11,0.07)', border: `1px solid ${f.priority === 'high' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}` }}>
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#a855f7)' }}>{f.recruiterName.split(' ').map(n => n[0]).join('')}</div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{f.recruiterName}</p>
                                        <p className="text-xs" style={{ color: f.priority === 'high' ? '#f87171' : '#fbbf24' }}>{f.dueDate}</p>
                                    </div>
                                    <button onClick={() => router.push('/outreach-creator')} className="btn-primary text-xs py-1 px-2 shrink-0" style={{ fontSize: '11px' }}>Send</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom row: Activity + Saved Jobs */}
                <div className="grid lg:grid-cols-2 gap-4">
                    {/* Activity Feed */}
                    <div className="card-dark p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity size={15} style={{ color: 'var(--primary)' }} />
                            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Recent Activity</span>
                        </div>
                        <div className="space-y-3">
                            {activities.map((a, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <span className="text-base shrink-0 mt-0.5">{a.icon}</span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{a.text}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{a.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Saved Jobs */}
                    <div className="card-dark p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Bookmark size={15} style={{ color: '#f59e0b' }} />
                                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Saved Jobs</span>
                            </div>
                            <button onClick={() => router.push('/job-scraper')} className="btn-ghost text-xs py-1.5 px-3">View All</button>
                        </div>
                        <div className="space-y-2">
                            {savedJobs.slice(0, 4).map(j => (
                                <div key={j.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--glass)', border: '1px solid var(--border)' }}>
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>{j.logo}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{j.title}</p>
                                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{j.company} · {j.location}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <span className="badge badge-green" style={{ fontSize: '10px', padding: '2px 8px' }}>{j.matchScore}%</span>
                                        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{j.platform}</span>
                                    </div>
                                </div>
                            ))}
                            {savedJobs.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No saved jobs yet</p>
                                    <button onClick={() => router.push('/job-scraper')} className="btn-primary mt-3 text-sm">Search Jobs</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
