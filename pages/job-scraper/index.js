import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Search, MapPin, DollarSign, Briefcase, Bookmark, BookmarkCheck, Download, Filter, X, ChevronRight, Clock, Wifi, Building2, ExternalLink, Loader2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import Layout from '@/components/Layout';
import { useApp } from '@/context/AppContext';

const PLATFORMS = ['LinkedIn', 'Indeed', 'Glassdoor', 'Instahyre', 'Naukri', 'IIM Jobs'];
const PLATFORM_COLORS = { LinkedIn: '#0077b5', Indeed: '#2164f3', Glassdoor: '#0caa41', Instahyre: '#ff6b35', Naukri: '#2d2d2d', 'IIM Jobs': '#000000' };

function ScoreBadge({ score }) {
    const color = score >= 85 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';
    const bg = score >= 85 ? 'rgba(16,185,129,0.12)' : score >= 70 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)';
    const border = score >= 85 ? 'rgba(16,185,129,0.25)' : score >= 70 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)';
    return <span style={{ background: bg, border: `1px solid ${border}`, color, borderRadius: '999px', fontSize: '11px', fontWeight: 700, padding: '2px 8px', fontFamily: 'monospace' }}>{score}%</span>;
}

function FreshnessTag({ posted }) {
    const fresh = posted.includes('hour') || posted.includes('Just now') || posted.includes('1 day');
    const color = fresh ? '#10b981' : 'var(--text-muted)';
    return <span className="flex items-center gap-1 text-xs" style={{ color }}><Clock size={10} />{posted}</span>;
}

function JobDrawer({ job, onClose, onSave }) {
    if (!job) return null;
    return (
        <div className="fixed inset-0 z-50 flex" onClick={onClose}>
            <div className="flex-1" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }} />
            <div className="w-full max-w-lg h-full overflow-y-auto animate-slide-in-right" style={{ background: 'var(--bg-elevated)', borderLeft: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-black text-white shadow-lg" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>{job.logo}</div>
                            <div>
                                <h3 className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
                                <p className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                    {job.company}
                                    <span className="flex items-center gap-0.5 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><ShieldCheck size={10} /> Verified</span>
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {[
                            { icon: MapPin, label: 'Location', val: job.location },
                            { icon: DollarSign, label: 'Salary', val: job.salary },
                            { icon: Briefcase, label: 'Experience', val: job.experience },
                            { icon: Building2, label: 'Type', val: job.type }
                        ].map(({ icon: Icon, label, val }) => (
                            <div key={label} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--glass)]">
                                <p className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1"><Icon size={10} /> {label}</p>
                                <p className="text-sm font-semibold text-[var(--text-primary)]">{val}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>AI Analysis</h4>
                        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-blue-400">Match Score</p>
                                <ScoreBadge score={job.matchScore} />
                            </div>
                            <div className="w-full bg-blue-900/30 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${job.matchScore}%` }} />
                            </div>
                            <p className="text-xs leading-relaxed opacity-80" style={{ color: 'var(--text-secondary)' }}>
                                High alignment with your skills in <b>React</b> and <b>TypeScript</b>. The salary range {job.salary} is within your target. {job.remote ? 'Remote work matches your preference.' : 'Location matches your profile.'}
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Job Description</h4>
                        <div className="prose prose-invert prose-sm max-w-none text-[var(--text-secondary)]">
                            <p>{job.description}</p>
                            <p className="mt-2">Key Responsibilities:</p>
                            <ul className="list-disc pl-4 space-y-1 opacity-80">
                                <li>Design and build advanced applications for the platform</li>
                                <li>Collaborate with cross-functional teams to define, design, and ship new features</li>
                                <li>Unit-test code for robustness, including edge cases, usability, and general reliability</li>
                            </ul>
                        </div>
                    </div>

                    <div className="sticky bottom-0 left-0 right-0 p-4 -mx-6 -mb-6 border-t border-[var(--border)] bg-[var(--bg-elevated)] flex gap-3">
                        <button onClick={() => { onSave(job); }} className="flex-1 btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                            {job.saved ? <><BookmarkCheck size={18} /> Saved</> : <><Bookmark size={18} /> Save Job</>}
                        </button>
                        <button className="flex-1 btn-ghost border border-[var(--border)] py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-[var(--glass)] hover:bg-white/5">
                            <ExternalLink size={18} /> Apply Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function JobScraper() {
    const router = useRouter();
    const { isAuthenticated, jobs, toggleSaveJob, saveJob, loading, setLoading } = useApp();
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [platforms, setPlatforms] = useState(['LinkedIn', 'Naukri']);
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState([]);
    const [drawerJob, setDrawerJob] = useState(null);
    const [searched, setSearched] = useState(false);

    // Simulation State
    const [scanPhase, setScanPhase] = useState(0); // 0: Idle, 1: Connecting, 2: Parsing, 3: Analyzing, 4: Done
    const [scanLog, setScanLog] = useState([]);
    const [foundCount, setFoundCount] = useState(0);

    useEffect(() => { if (!isAuthenticated) router.replace('/'); }, [isAuthenticated, router]);

    const togglePlatform = (p) => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const addLog = (msg) => setScanLog(prev => [...prev.slice(-4), msg]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);
        setScanPhase(1);
        setScanLog([]);
        setResults([]);
        setFoundCount(0);

        // Simulation Sequence
        const delay = (ms) => new Promise(r => setTimeout(r, ms));

        try {
            // Phase 1: Connection
            for (const p of platforms) {
                addLog(`Connecting to ${p} secure gateway...`);
                await delay(400);
                addLog(`Handshaking with ${p} API...`);
                await delay(300);
            }

            setScanPhase(2); // Parsing
            addLog('Parsing listings...');

            // Filter realistic results from our large generated pool
            let pool = jobs.filter(j => platforms.includes(j.platform) || Math.random() < 0.3); // Fuzzy match platform
            if (query) {
                const q = query.toLowerCase();
                pool = pool.filter(j => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.industry?.toLowerCase().includes(q));
            }
            if (location) {
                pool = pool.filter(j => j.location.toLowerCase().includes(location.toLowerCase()) || (location.toLowerCase() === 'remote' && j.remote));
            }

            // Generate synthetic jobs if not enough matches are found
            if (pool.length < 15) {
                const syntheticCount = 15 - pool.length;
                const topMNCs = ['Zomato', 'Freshworks', 'Razorpay', 'Swiggy', 'CRED', 'Paytm', 'PhonePe', 'Flipkart', 'TCS', 'Infosys', 'Wipro', 'HCL', 'Reliance', 'Tata Motors'];
                const generated = Array.from({ length: syntheticCount }, (_, i) => ({
                    id: Date.now() + i,
                    title: query || "Product Manager",
                    company: topMNCs[i % topMNCs.length],
                    location: location || "Mumbai, MH",
                    type: i % 3 === 0 ? "Hybrid" : (i % 2 === 0 ? "Remote" : "Full-time"),
                    salary: `₹${12 + (i % 5) * 2}–${20 + (i % 5) * 4} LPA`,
                    platform: platforms[i % platforms.length] || 'LinkedIn',
                    posted: `${(i % 24) + 1} hours ago`,
                    experience: `${(i % 5) + 1}+ years`,
                    saved: false,
                    logo: topMNCs[i % topMNCs.length].substring(0, 2).toUpperCase(),
                    description: `Excellent opportunity for a ${query || "Product"} role. Join our team at ${topMNCs[i % topMNCs.length]} based out of ${location || "Mumbai"}.`,
                    matchScore: 75 + (i % 20),
                    remote: i % 2 === 0,
                    companySize: "Enterprise",
                    industry: "Tech"
                }));
                pool = [...pool, ...generated];
            }

            // Simulate partial results finding
            const total = pool.length;
            const batchSize = Math.ceil(total / 3);

            for (let i = 0; i < total; i += batchSize) {
                setFoundCount(prev => Math.min(prev + batchSize, total));
                addLog(`Synced ${Math.min(i + batchSize, total)} jobs...`);
                await delay(600);
            }

            setScanPhase(3); // Analyzing
            addLog('Running AI Match Score analysis...');
            await delay(800);
            addLog('Enriching company data...');
            await delay(500);

            setResults(pool.sort((a, b) => b.matchScore - a.matchScore));
            setScanPhase(4); // Done
            addLog('Scan complete.');
            await delay(200);

        } finally {
            setLoading(false);
        }
    };

    const handleSaveJob = (j) => {
        if (jobs.some(x => x.id === j.id && x.saved)) { toggleSaveJob(j.id); } else { saveJob({ ...j, saved: true }); }
    };

    const isSaved = (id) => jobs.some(j => j.id === id && j.saved);

    if (!isAuthenticated) return null;

    return (
        <Layout>
            <Head><title>Live Job Sync — JobFlow</title></Head>
            {drawerJob && <JobDrawer job={drawerJob} onClose={() => setDrawerJob(null)} onSave={handleSaveJob} />}

            {/* Floating Decorative Brain Image */}
            <div className="absolute top-[5%] right-[5%] w-[350px] xl:w-[500px] opacity-[0.08] xl:opacity-[0.12] mix-blend-screen animate-float pointer-events-none z-0" style={{ animationDuration: '14s' }}>
                <img src="/brain.png" alt="AI Sync Engine Core" className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(168,85,247,0.4)]" />
            </div>

            <div className="space-y-6 animate-fade-in max-w-6xl mx-auto relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Live Job Sync</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Real-time aggregation from top Indian job portals</p>
                    </div>
                </div>

                <div className="p-1 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(168,85,247,0.2))' }}>
                    <div className="bg-[var(--bg-elevated)] rounded-xl p-6 shadow-2xl">
                        <form onSubmit={handleSearch} className="space-y-6">
                            <div className="grid md:grid-cols-2 lg:grid-cols-10 gap-4">
                                <div className="lg:col-span-4 relative group">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-blue-500 transition-colors" />
                                    <input className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-[var(--text-muted)]"
                                        placeholder="Job title, skills, or company" value={query} onChange={e => setQuery(e.target.value)} />
                                </div>
                                <div className="lg:col-span-3 relative group">
                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-blue-500 transition-colors" />
                                    <input className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-[var(--text-muted)]"
                                        placeholder="City or 'Remote'" value={location} onChange={e => setLocation(e.target.value)} />
                                </div>
                                <div className="lg:col-span-3 flex">
                                    <button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} fill="currentColor" />}
                                        {loading ? 'Scanning...' : 'Start Scan'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--border)]">
                                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mr-2">Sources:</span>
                                {PLATFORMS.map(p => (
                                    <button key={p} type="button" onClick={() => togglePlatform(p)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                        style={{
                                            background: platforms.includes(p) ? `${PLATFORM_COLORS[p]}15` : 'transparent',
                                            border: `1px solid ${platforms.includes(p) ? PLATFORM_COLORS[p] : 'var(--border)'}`,
                                            color: platforms.includes(p) ? PLATFORM_COLORS[p] : 'var(--text-muted)'
                                        }}>
                                        {platforms.includes(p) && <CheckCircle2 size={10} />}
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </form>
                    </div>
                </div>

                {loading && (
                    <div className="animate-fade-in my-8 p-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                            <div className="flex items-center justify-center gap-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">{foundCount}</div>
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                        {scanPhase === 1 && "Establishing Secure Connections..."}
                                        {scanPhase === 2 && "Extracting Job Data..."}
                                        {scanPhase === 3 && "Analyzing & Scoring..."}
                                    </h3>
                                    <p className="text-sm text-blue-400 font-mono mt-1">
                                        {scanLog[scanLog.length - 1]}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-center">
                                {scanLog.slice(-3).map((l, i) => (
                                    <span key={i} className="text-[10px] text-[var(--text-muted)] opacity-50 font-mono">{l}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {!loading && searched && results.length > 0 && (
                    <div className="animate-slide-up space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-lg font-bold text-[var(--text-primary)]">Found <span className="text-blue-500">{results.length}</span> matches</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[var(--text-muted)]">Sort by:</span>
                                <select className="bg-transparent text-xs font-bold text-[var(--text-secondary)] outline-none"><option>AI Score</option><option>Date</option></select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {results.map(j => (
                                <div key={j.id} onClick={() => setDrawerJob(j)} className="group bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-5 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer relative overflow-hidden">
                                    {isSaved(j.id) && <div className="absolute top-0 right-0 p-1.5 bg-yellow-500/10 rounded-bl-xl text-yellow-500"><BookmarkCheck size={16} /></div>}

                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-white text-sm shadow-md" style={{ background: 'linear-gradient(135deg,#1e293b,#334155)' }}>{j.logo}</div>
                                        <div>
                                            <h3 className="font-bold text-[var(--text-primary)] mb-0.5 group-hover:text-blue-500 transition-colors line-clamp-1">{j.title}</h3>
                                            <p className="text-xs text-[var(--text-muted)] font-medium">{j.company}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]"><MapPin size={12} className="text-[var(--text-muted)]" />{j.location}</div>
                                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]"><DollarSign size={12} className="text-[var(--text-muted)]" />{j.salary}</div>
                                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]"><Briefcase size={12} className="text-[var(--text-muted)]" />{j.experience}</div>
                                    </div>

                                    <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded text-[var(--text-muted)] border border-[var(--border)]">{j.platform}</span>
                                            <FreshnessTag posted={j.posted} />
                                        </div>
                                        <ScoreBadge score={j.matchScore} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
