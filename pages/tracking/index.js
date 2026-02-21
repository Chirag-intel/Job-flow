import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { BarChart2, MessageSquare, Clock, CheckCircle, Mail, Linkedin, Send, Bell, XCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '@/components/Layout';
import { useApp } from '@/context/AppContext';

const STATUS_STYLES = {
    Sent: { bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.2)', color: '#94a3b8' },
    Opened: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.2)', color: '#fbbf24' },
    Replied: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)', color: '#34d399' },
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="p-3 rounded-xl text-xs" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <p className="font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{label}</p>
            {payload.map(p => (<div key={p.name} className="flex items-center gap-2" style={{ color: p.color }}><div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} /><span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span><span className="font-bold">{p.value}</span></div>))}
        </div>
    );
};

export default function Tracking() {
    const router = useRouter();
    const { isAuthenticated, messages, analyticsData, followUps, dismissFollowUp, stats } = useApp();
    const [tab, setTab] = useState('messages');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => { if (!isAuthenticated) router.replace('/'); }, [isAuthenticated, router]);

    const filteredMessages = statusFilter === 'All' ? messages : messages.filter(m => m.status === statusFilter);
    const replied = messages.filter(m => m.status === 'Replied').length;
    const opened = messages.filter(m => m.status === 'Opened').length;
    const replyRate = messages.length ? Math.round((replied / messages.length) * 100) : 0;
    const openRate = messages.length ? Math.round((opened / messages.length) * 100) : 0;

    if (!isAuthenticated) return null;

    return (
        <Layout>
            <Head><title>Tracking & Analytics — JobFlow</title></Head>

            {/* Floating Decorative Brain Image */}
            <div className="absolute top-[10%] right-[0%] w-[350px] xl:w-[500px] opacity-[0.06] xl:opacity-[0.1] mix-blend-screen animate-float pointer-events-none z-0" style={{ animationDuration: '15s' }}>
                <img src="/brain.png" alt="AI Analytics Core" className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(16,185,129,0.4)]" />
            </div>

            <div className="space-y-5 animate-fade-in relative z-10">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Tracking & Analytics</h1>
                        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Monitor your outreach performance</p>
                    </div>
                    <div className="pill-toggle">
                        <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>Messages</button>
                        <button className={tab === 'analytics' ? 'active' : ''} onClick={() => setTab('analytics')}>Analytics</button>
                        <button className={tab === 'pipeline' ? 'active' : ''} onClick={() => setTab('pipeline')}>Pipeline</button>
                    </div>
                </div>

                {/* Follow-up banner if overdue */}
                {followUps.some(f => f.daysOverdue > 0) && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <Bell size={15} style={{ color: '#f87171' }} />
                        <p className="text-sm flex-1" style={{ color: '#f87171' }}>{followUps.filter(f => f.daysOverdue > 0).length} follow-up(s) overdue — act now to maintain momentum!</p>
                        <button onClick={() => router.push('/outreach-creator')} className="btn-primary text-xs py-1.5">Send Follow-up</button>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger">
                    {[
                        { label: 'Total Sent', val: messages.length, icon: Send, color: '#3b82f6' },
                        { label: 'Opened', val: opened, sub: `${openRate}% open rate`, icon: Mail, color: '#f59e0b' },
                        { label: 'Replied', val: replied, sub: `${replyRate}% reply rate`, icon: CheckCircle, color: '#10b981' },
                        { label: 'Follow-ups Due', val: followUps.length, icon: Clock, color: '#ef4444' },
                    ].map(({ label, val, sub, icon: Icon, color }, i) => (
                        <div key={label} className="card-dark p-4 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                            <div className="flex items-center gap-2 mb-2"><Icon size={14} style={{ color }} /><span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span></div>
                            <div className="text-2xl font-black" style={{ color }}>{val}</div>
                            {sub && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
                        </div>
                    ))}
                </div>

                {tab === 'messages' && (
                    <div className="card-dark p-5">
                        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Message History</h3>
                            <div className="flex gap-1 flex-wrap">
                                {['All', 'Sent', 'Opened', 'Replied'].map(s => (
                                    <button key={s} onClick={() => setStatusFilter(s)} className="badge cursor-pointer transition-all" style={{ background: statusFilter === s ? 'rgba(59,130,246,0.15)' : 'var(--glass)', border: statusFilter === s ? '1px solid rgba(59,130,246,0.3)' : '1px solid var(--border)', color: statusFilter === s ? '#60a5fa' : 'var(--text-muted)' }}>{s}</button>
                                ))}
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        {['Recruiter', 'Company', 'Channel', 'Subject', 'Status', 'Date', 'Response'].map(h => (
                                            <th key={h} className="pb-3 text-left text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMessages.map(m => {
                                        const sc = STATUS_STYLES[m.status];
                                        return (
                                            <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                <td className="py-3 pr-4"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#3b82f6,#a855f7)', flexShrink: 0 }}>{m.recruiterName.split(' ').map(n => n[0]).join('')}</div><span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{m.recruiterName}</span></div></td>
                                                <td className="py-3 pr-4"><span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{m.company}</span></td>
                                                <td className="py-3 pr-4"><div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>{m.channel === 'Email' ? <Mail size={11} /> : <Linkedin size={11} />}{m.channel}</div></td>
                                                <td className="py-3 pr-4 max-w-32"><p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{m.template}</p></td>
                                                <td className="py-3 pr-4"><span className="badge" style={{ ...sc, fontSize: '10px', padding: '2px 8px' }}>{m.status}</span></td>
                                                <td className="py-3 pr-4"><span className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.sentDate}</span></td>
                                                <td className="py-3"><span className="text-xs font-mono" style={{ color: m.responseTime === '—' ? 'var(--text-muted)' : '#34d399' }}>{m.responseTime}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {filteredMessages.length === 0 && (
                                <div className="text-center py-12"><p className="text-sm" style={{ color: 'var(--text-muted)' }}>No messages found</p></div>
                            )}
                        </div>
                    </div>
                )}

                {tab === 'analytics' && (
                    <div className="space-y-4">
                        <div className="grid lg:grid-cols-2 gap-4">
                            <div className="card-dark p-5">
                                <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Weekly Outreach</h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={analyticsData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="week" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
                                        <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ fontSize: 11, color: '#475569' }} />
                                        <Bar dataKey="sent" name="Sent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="opened" name="Opened" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="replied" name="Replied" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="card-dark p-5">
                                <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Reply Rate Trend</h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={analyticsData.map(d => ({ ...d, rate: d.sent > 0 ? Math.round((d.replied / d.sent) * 100) : 0 }))} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="week" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
                                        <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="rate" name="Reply Rate %" stroke="#00e5ff" strokeWidth={2.5} dot={{ fill: '#00e5ff', r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        {/* Best time heatmap (visual) */}
                        <div className="card-dark p-5">
                            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Best Time to Send</h3>
                            <div className="grid grid-cols-7 gap-1.5">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, di) => (
                                    <div key={day}>
                                        <p className="text-xs text-center mb-1.5" style={{ color: 'var(--text-muted)' }}>{day}</p>
                                        {['9am', '11am', '1pm', '3pm', '5pm'].map((h, hi) => {
                                            const heat = [[3, 7, 5, 2, 1], [8, 9, 6, 3, 1], [6, 8, 9, 7, 2], [5, 7, 8, 9, 3], [4, 6, 5, 4, 2], [2, 2, 1, 1, 1], [1, 1, 1, 1, 1]];
                                            const v = heat[di][hi];
                                            const op = v / 10;
                                            return <div key={h} className="rounded" style={{ height: 28, background: `rgba(59,130,246,${op})`, marginBottom: 3, cursor: 'default' }} title={`${day} ${h}: ${['Low', '', 'Medium', '', 'High'][v - 1] || ''} activity`} />;
                                        })}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="w-20 h-2 rounded" style={{ background: 'linear-gradient(90deg,rgba(59,130,246,0.1),rgba(59,130,246,0.9))' }} />
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Low → High response rate</span>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'pipeline' && (
                    <div>
                        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Visual pipeline of your outreach journey</p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { label: 'Applied', color: '#3b82f6', items: messages },
                                { label: 'Opened', color: '#f59e0b', items: messages.filter(m => m.status !== 'Sent') },
                                { label: 'Replied', color: '#10b981', items: messages.filter(m => m.status === 'Replied') },
                                { label: 'Interview', color: '#a855f7', items: messages.filter(m => m.responseTime !== '—').slice(0, 2) },
                            ].map(({ label, color, items }) => (
                                <div key={label} className="kanban-col">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs font-bold" style={{ color }}>{label}</p>
                                        <span className="badge" style={{ background: `${color}15`, border: `1px solid ${color}25`, color, fontSize: '10px', padding: '1px 6px' }}>{items.length}</span>
                                    </div>
                                    {items.slice(0, 4).map(m => (
                                        <div key={m.id} className="kanban-card">
                                            <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{m.recruiterName}</p>
                                            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{m.company}</p>
                                            <p className="text-xs mt-1.5 font-mono" style={{ color }}>{m.channel}</p>
                                        </div>
                                    ))}
                                    {items.length === 0 && <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>Empty</p>}
                                </div>
                            ))}
                        </div>
                        {/* Follow-ups */}
                        {followUps.length > 0 && (
                            <div className="mt-4 card-dark p-5">
                                <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Follow-up Queue</h3>
                                <div className="space-y-2">
                                    {followUps.map(f => (
                                        <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: f.daysOverdue > 0 ? 'rgba(239,68,68,0.07)' : 'rgba(245,158,11,0.07)', border: `1px solid ${f.daysOverdue > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}` }}>
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#3b82f6,#a855f7)' }}>{f.recruiterName.split(' ').map(n => n[0]).join('')}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{f.recruiterName} · {f.company}</p>
                                                <p className="text-xs" style={{ color: f.daysOverdue > 0 ? '#f87171' : '#fbbf24' }}>{f.dueDate} · {f.channel}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => router.push('/outreach-creator')} className="btn-primary text-xs py-1.5 px-3">Send</button>
                                                <button onClick={() => dismissFollowUp(f.id)} className="btn-ghost text-xs py-1.5 px-2"><XCircle size={12} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}
