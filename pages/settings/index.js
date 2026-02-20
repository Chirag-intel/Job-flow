import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { User, Shield, Link2, FileText, Bell, Database, Check, Moon, Sun, Key, Trash2, Download, Upload } from 'lucide-react';
import Layout from '@/components/Layout';
import { useApp } from '@/context/AppContext';

const TABS = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'account', icon: Shield, label: 'Account' },
    { id: 'integrations', icon: Link2, label: 'Integrations' },
    { id: 'resume', icon: FileText, label: 'Resume' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'data', icon: Database, label: 'Data' },
];

const INTEGRATIONS = [
    { key: 'linkedin', label: 'LinkedIn', desc: 'Search jobs & send InMails automatically', color: '#0077b5', icon: 'in' },
    { key: 'gmail', label: 'Gmail', desc: 'Send emails directly from JobFlow', color: '#ea4335', icon: 'G' },
    { key: 'outlook', label: 'Outlook', desc: 'Microsoft email integration', color: '#0078d4', icon: 'O' },
    { key: 'instahyre', label: 'Instahyre', desc: 'Search Indian tech job market', color: '#ff6b35', icon: 'IH' },
];

function Toggle({ on, onToggle }) {
    return (
        <button onClick={onToggle} className="w-11 h-6 rounded-full relative transition-colors" style={{ background: on ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}>
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm" style={{ left: on ? '22px' : '2px' }} />
        </button>
    );
}

export default function Settings() {
    const router = useRouter();
    const { isAuthenticated, user, updateUser, toggleIntegration, darkMode, setDarkMode } = useApp();
    const [tab, setTab] = useState('profile');
    const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', headline: '', skills: '' });
    const [saved, setSaved] = useState(false);
    const [notifs, setNotifs] = useState({ replies: true, newJobs: true, followUps: true, weekly: false });
    const [resumeFile, setResumeFile] = useState(null);
    const [apiKey, setApiKey] = useState('sk-••••••••••••••••••••••••••••••••');

    useEffect(() => { if (!isAuthenticated) router.replace('/'); }, [isAuthenticated, router]);
    useEffect(() => { if (user) setForm({ name: user.name, email: user.email || '', phone: user.phone || '', location: user.location || '', headline: user.headline || '', skills: user.skills || '' }); }, [user]);

    const handleSave = () => {
        updateUser(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (!isAuthenticated) return null;

    return (
        <Layout>
            <Head><title>Settings — JobFlow</title></Head>
            <div className="space-y-5 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Settings</h1>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Manage your profile, account, and preferences</p>
                </div>

                <div className="grid lg:grid-cols-4 gap-4">
                    {/* Sidebar tabs */}
                    <div className="lg:col-span-1 card-dark p-3 h-fit">
                        <nav className="space-y-0.5">
                            {TABS.map(({ id, icon: Icon, label }) => (
                                <button key={id} onClick={() => setTab(id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all"
                                    style={{ background: tab === id ? 'var(--primary-dim)' : 'transparent', color: tab === id ? '#60a5fa' : 'var(--text-muted)', border: tab === id ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent' }}>
                                    <Icon size={15} />{label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 card-dark p-6">
                        {/* Profile */}
                        {tab === 'profile' && (
                            <div className="space-y-5">
                                <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--glass)', border: '1px solid var(--border)' }}>
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white" style={{ background: 'linear-gradient(135deg,#3b82f6,#a855f7)' }}>{user.avatar}</div>
                                    <div>
                                        <p className="font-black" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user.headline}</p>
                                        <span className="badge badge-blue mt-1" style={{ fontSize: '10px' }}>{user.plan} Plan</span>
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[{ label: 'Full Name', key: 'name' }, { label: 'Email Address', key: 'email' }, { label: 'Phone Number', key: 'phone' }, { label: 'Location', key: 'location' }].map(({ label, key }) => (
                                        <div key={key}>
                                            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                                            <input className="input-dark" value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={label} />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Professional Headline</label>
                                    <input className="input-dark" value={form.headline} onChange={e => setForm(p => ({ ...p, headline: e.target.value }))} placeholder="e.g. Senior Frontend Developer" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Skills (comma-separated)</label>
                                    <textarea className="input-dark resize-none" rows={3} value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} placeholder="React, TypeScript, Node.js…" />
                                </div>
                                <button onClick={handleSave} className="btn-primary">{saved ? <><Check size={14} />Saved!</> : <>Save Changes</>}</button>
                            </div>
                        )}

                        {/* Account */}
                        {tab === 'account' && (
                            <div className="space-y-5">
                                <div className="p-4 rounded-xl" style={{ background: 'var(--glass)', border: '1px solid var(--border)' }}>
                                    <div className="flex items-center justify-between">
                                        <div><p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Current Plan</p><p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>You are on the {user.plan} plan</p></div>
                                        <span className="badge badge-blue">{user.plan}</span>
                                    </div>
                                    <button className="btn-primary mt-3 text-sm">Upgrade Plan</button>
                                </div>
                                <div>
                                    <p className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Appearance</p>
                                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--glass)', border: '1px solid var(--border)' }}>
                                        <div className="flex items-center gap-2"><Moon size={15} style={{ color: '#60a5fa' }} /><span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Dark Mode</span></div>
                                        <Toggle on={darkMode} onToggle={() => setDarkMode(!darkMode)} />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Change Password</p>
                                    <div className="space-y-3">
                                        <input type="password" className="input-dark" placeholder="Current password" />
                                        <input type="password" className="input-dark" placeholder="New password" />
                                        <input type="password" className="input-dark" placeholder="Confirm new password" />
                                        <button className="btn-primary text-sm">Update Password</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Integrations */}
                        {tab === 'integrations' && (
                            <div className="space-y-3">
                                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Connect your accounts to enable automated outreach and job fetching.</p>
                                {INTEGRATIONS.map(({ key, label, desc, color, icon }) => (
                                    <div key={key} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--glass)', border: '1px solid var(--border)' }}>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0" style={{ background: color }}>{icon}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
                                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            {user.integrations[key] && <span className="badge badge-green" style={{ fontSize: '10px' }}>Connected</span>}
                                            <Toggle on={user.integrations[key]} onToggle={() => toggleIntegration(key)} />
                                        </div>
                                    </div>
                                ))}
                                <div className="p-4 rounded-xl" style={{ background: 'var(--glass)', border: '1px solid var(--border)' }}>
                                    <div className="flex items-center gap-2 mb-3"><Key size={14} style={{ color: '#f59e0b' }} /><p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>OpenAI API Key</p></div>
                                    <div className="flex gap-2">
                                        <input className="input-dark flex-1 font-mono text-xs" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-…" />
                                        <button className="btn-primary text-sm px-4">Save</button>
                                    </div>
                                    <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Used for AI message improvement and job scoring</p>
                                </div>
                            </div>
                        )}

                        {/* Resume */}
                        {tab === 'resume' && (
                            <div className="space-y-5">
                                <div
                                    className="rounded-xl p-8 text-center cursor-pointer transition-all"
                                    style={{ border: '2px dashed rgba(59,130,246,0.25)', background: 'rgba(59,130,246,0.04)' }}
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={e => { e.preventDefault(); setResumeFile(e.dataTransfer.files[0]); }}
                                    onClick={() => document.getElementById('resume-input').click()}
                                >
                                    <Upload size={28} className="mx-auto mb-3" style={{ color: 'var(--primary)' }} />
                                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{resumeFile ? resumeFile.name : 'Drop your resume here'}</p>
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>PDF, DOC, DOCX — max 5 MB</p>
                                    <input id="resume-input" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setResumeFile(e.target.files[0])} />
                                </div>
                                {resumeFile && (
                                    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                                        <Check size={16} style={{ color: '#34d399' }} />
                                        <p className="text-sm font-medium" style={{ color: '#34d399' }}>{resumeFile.name} ready to upload</p>
                                        <button className="btn-primary ml-auto text-sm">Upload</button>
                                    </div>
                                )}
                                <div className="p-4 rounded-xl" style={{ background: 'var(--glass)', border: '1px solid var(--border)' }}>
                                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>AI Resume Score</p>
                                    <div className="score-bar mb-1.5"><div className="score-bar-fill" style={{ width: '78%', background: 'linear-gradient(90deg,#3b82f6,#00e5ff)' }} /></div>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>78/100 — Add 2 more measurable achievements to reach 90+</p>
                                </div>
                            </div>
                        )}

                        {/* Notifications */}
                        {tab === 'notifications' && (
                            <div className="space-y-3">
                                {[
                                    { key: 'replies', label: 'Recruiter Replies', desc: 'Get notified when a recruiter replies to your message' },
                                    { key: 'newJobs', label: 'New Job Matches', desc: 'Daily digest of new jobs matching your profile' },
                                    { key: 'followUps', label: 'Follow-up Reminders', desc: 'Alerts for scheduled follow-up messages' },
                                    { key: 'weekly', label: 'Weekly Summary', desc: 'Weekly report of your application stats' },
                                ].map(({ key, label, desc }) => (
                                    <div key={key} className="flex items-center justify-between gap-4 p-4 rounded-xl" style={{ background: 'var(--glass)', border: '1px solid var(--border)' }}>
                                        <div>
                                            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
                                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                                        </div>
                                        <Toggle on={notifs[key]} onToggle={() => setNotifs(p => ({ ...p, [key]: !p[key] }))} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Data */}
                        {tab === 'data' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl" style={{ background: 'var(--glass)', border: '1px solid var(--border)' }}>
                                    <p className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Export Your Data</p>
                                    <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Download all your jobs, recruiters, messages, and analytics as a ZIP file.</p>
                                    <button className="btn-ghost text-sm"><Download size={14} />Export All Data</button>
                                </div>
                                <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                    <div className="flex items-center gap-2 mb-1"><Trash2 size={14} style={{ color: '#f87171' }} /><p className="font-bold text-sm" style={{ color: '#f87171' }}>Danger Zone</p></div>
                                    <p className="text-xs mb-3" style={{ color: 'rgba(248,113,113,0.7)' }}>This will permanently delete your account and all associated data. This cannot be undone.</p>
                                    <button className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>Delete Account</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
