import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    LayoutDashboard, Search, Users, MessageSquare, BarChart2,
    Settings, LogOut, Bell, ChevronDown, X, Menu,
    Briefcase, Zap
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/job-scraper', icon: Search, label: 'Live Job Sync' },
    { href: '/recruiter-enrichment', icon: Users, label: 'Recruiter Enrichment' },
    { href: '/outreach-creator', icon: MessageSquare, label: 'Outreach Creator' },
    { href: '/tracking', icon: BarChart2, label: 'Tracking & Analytics' },
    { href: '/settings', icon: Settings, label: 'Settings' },
];

function NotifPanel({ onClose }) {
    const { notifications, markNotifRead, markAllNotifsRead } = useApp();
    return (
        <div className="absolute right-0 top-12 w-80 z-50 animate-slide-in-right" style={{ right: 0 }}>
            <div className="card-dark shadow-2xl overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                    <div className="flex gap-2 items-center">
                        <button onClick={markAllNotifsRead} className="text-xs font-medium" style={{ color: 'var(--primary)' }}>Mark all read</button>
                        <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={14} /></button>
                    </div>
                </div>
                <div className="max-h-72 overflow-y-auto">
                    {notifications.map(n => (
                        <div
                            key={n.id}
                            onClick={() => markNotifRead(n.id)}
                            className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors border-b ${n.read ? '' : ''}`}
                            style={{
                                borderColor: 'var(--border)',
                                background: n.read ? 'transparent' : 'rgba(59,130,246,0.06)',
                            }}
                        >
                            <span className="text-lg shrink-0 mt-0.5">{n.icon}</span>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold leading-tight" style={{ color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{n.title}</p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{n.body}</p>
                                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{n.time}</p>
                            </div>
                            {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Layout({ children }) {
    const router = useRouter();
    const { user, logout, unreadCount } = useApp();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    const handleLogout = () => { logout(); router.push('/'); };

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 lg:hidden"
                    style={{ background: 'rgba(0,0,0,0.7)' }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-30 flex flex-col w-60 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
                style={{
                    background: 'rgba(7,13,26,0.92)',
                    backdropFilter: 'blur(24px)',
                    borderRight: '1px solid var(--border)',
                }}
            >
                {/* Logo */}
                <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
                    <img src="/logo.png" alt="JobFlow Logo" className="w-8 h-8 rounded-lg shadow-[0_4px_12px_rgba(59,130,246,0.4)] object-cover" />
                    <span className="font-black text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        Job<span className="gradient-text">Flow</span>
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ href, icon: Icon, label }) => {
                        const active = router.pathname === href || router.pathname.startsWith(href + '/');
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative"
                                style={{
                                    background: active ? 'var(--primary-dim)' : 'transparent',
                                    color: active ? '#60a5fa' : 'var(--text-muted)',
                                    border: active ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                                }}
                            >
                                {active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r" style={{ background: 'var(--primary)' }} />
                                )}
                                <Icon size={17} style={{ color: active ? '#60a5fa' : 'var(--text-muted)' }} className="group-hover:text-blue-400 transition-colors shrink-0" />
                                <span className="group-hover:text-blue-300 transition-colors">{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* AI Badge */}
                <div className="mx-3 mb-3 p-3 rounded-xl" style={{ background: 'var(--primary-dim)', border: '1px solid rgba(59,130,246,0.15)' }}>
                    <div className="flex items-center gap-2 mb-1">
                        <Zap size={13} style={{ color: 'var(--primary)' }} />
                        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>AI Active</span>
                    </div>
                    <p className="text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>Smart suggestions & auto-enrichment enabled</p>
                </div>

                {/* Logout */}
                <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#f87171'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="flex items-center gap-3 px-4 lg:px-6 py-3.5 shrink-0 relative z-[100]" style={{ background: 'rgba(7,13,26,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
                    <button
                        className="lg:hidden p-2 rounded-lg"
                        style={{ color: 'var(--text-muted)', background: 'var(--glass)' }}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Menu size={18} />
                    </button>

                    <div className="flex-1" />

                    {/* Notification Bell */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                            className="relative p-2 rounded-xl transition-all"
                            style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                        >
                            <Bell size={17} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ background: '#ef4444', fontSize: '10px' }}>
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} />}
                    </div>

                    {/* Profile */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all"
                            style={{ background: 'var(--glass)', border: '1px solid var(--border)' }}
                        >
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#3b82f6,#a855f7)' }}>
                                {user.avatar}
                            </div>
                            <span className="text-sm font-semibold hidden sm:block" style={{ color: 'var(--text-primary)' }}>{user.name}</span>
                            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                        </button>
                        {profileOpen && (
                            <div className="absolute right-0 top-12 w-48 z-50 card-dark shadow-2xl overflow-hidden animate-fade-in" style={{ background: 'var(--bg-elevated)' }}>
                                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.plan} Plan</p>
                                </div>
                                <div className="p-2">
                                    <Link href="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-hover)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <Settings size={14} /> Settings
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors" style={{ color: '#f87171' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <LogOut size={14} /> Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
