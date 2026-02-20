import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Search, Users, MessageSquare, BarChart2, Zap, ArrowRight, Check, Star, ChevronDown, Menu, X, Phone, Shield, Briefcase, Cpu, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

function Counter({ end, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let s = 0;
      const step = end / (duration / 16);
      const t = setInterval(() => {
        s = Math.min(s + step, end);
        setCount(Math.floor(s));
        if (s >= end) clearInterval(t);
      }, 16);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function OTPForm({ onSuccess }) {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOTP = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) { setError('Enter a valid 10-digit number'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 900));
    setLoading(false); setStep('otp');
  };
  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) { setError('Enter the OTP'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    onSuccess(phone);
  };

  return (
    <div className="w-full max-w-sm">
      <div className="p-7 rounded-2xl" style={{ background: 'rgba(13,21,38,0.95)', border: '1px solid rgba(59,130,246,0.25)', boxShadow: '0 24px 64px rgba(0,0,0,0.5),0 0 0 1px rgba(59,130,246,0.08)' }}>
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
            {step === 'phone' ? <Phone size={16} className="text-white" /> : <Shield size={16} className="text-white" />}
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{step === 'phone' ? 'Get Started Free' : 'Verify OTP'}</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{step === 'phone' ? 'No credit card required' : `Sent to +91 ${phone}`}</p>
          </div>
        </div>
        {step === 'phone' ? (
          <form onSubmit={sendOTP} className="space-y-3">
            <div className="flex items-center input-dark" style={{ padding: 0 }}>
              <span className="px-3 py-2.5 text-sm border-r shrink-0" style={{ color: 'var(--text-secondary)', borderColor: 'rgba(255,255,255,0.08)' }}>+91</span>
              <input className="flex-1 bg-transparent py-2.5 pr-3 text-sm outline-none" style={{ color: 'var(--text-primary)' }} placeholder="10-digit mobile" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending…' : 'Send OTP'}{!loading && <ArrowRight size={14} />}</button>
          </form>
        ) : (
          <form onSubmit={verifyOTP} className="space-y-3">
            <input className="input-dark text-center text-xl tracking-widest font-mono" placeholder="• • • • •" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Verifying…' : 'Verify & Continue'}{!loading && <ArrowRight size={14} />}</button>
            <button type="button" onClick={() => { setStep('phone'); setOtp(''); setError(''); }} className="w-full text-center text-xs" style={{ color: 'var(--text-muted)' }}>← Back</button>
          </form>
        )}
        <div className="mt-4 pt-4 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Shield size={11} style={{ color: 'var(--text-muted)' }} />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Your data is never shared. No spam.</p>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: open ? 'rgba(59,130,246,0.05)' : 'var(--glass)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 text-left p-5">
        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{q}</span>
        <ChevronDown size={15} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
      </button>
      {open && <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{a}</div>}
    </div>
  );
}

const features = [
  { icon: Search, label: 'Multi-Platform Scraper', desc: 'LinkedIn, Indeed, Glassdoor, Instahyre — filter by role, salary, location.', badge: '4 Platforms', color: '#3b82f6' },
  { icon: Users, label: 'Recruiter Enrichment', desc: 'AI finds recruiter emails, LinkedIn profiles and phone numbers automatically.', badge: '94% Accuracy', color: '#a855f7' },
  { icon: MessageSquare, label: 'Outreach Creator', desc: 'Personalized templates with variable substitution and one-click AI polish.', badge: 'AI-Powered', color: '#10b981' },
  { icon: BarChart2, label: 'Analytics Dashboard', desc: 'Track open rates, reply rates, and response trends to optimize your strategy.', badge: '38% Avg Reply', color: '#f59e0b' },
  { icon: Cpu, label: 'AI Job Matching', desc: 'Smart compatibility scoring matches you to relevant roles before you apply.', badge: 'New ✨', color: '#00e5ff' },
  { icon: Clock, label: 'Follow-up Reminders', desc: 'Automated Day 1/4/7 follow-up reminders. Never drop the ball again.', badge: '3x More Replies', color: '#f97316' },
];

const lbItems = [
  { rank: 1, label: 'Job Scraper', installs: '265.8K', tag: 'Core' },
  { rank: 2, label: 'Recruiter AI', installs: '146.6K', tag: 'AI' },
  { rank: 3, label: 'Outreach Templates', installs: '110.8K', tag: 'Templates' },
  { rank: 4, label: 'Analytics Engine', installs: '98.9K', tag: 'Analytics' },
  { rank: 5, label: 'Follow-up Scheduler', installs: '80.7K', tag: 'Automation' },
  { rank: 6, label: 'Resume Parser', installs: '47.3K', tag: 'AI' },
];

const testimonials = [
  { name: 'Arjun Mehta', role: 'Placed @ Flipkart', av: 'AM', text: 'JobFlow cut my search time by 70%. I had 3 offers in 6 weeks.', rating: 5 },
  { name: 'Priya Nair', role: 'SWE @ Razorpay', av: 'PN', text: 'The AI recruiter enrichment is magical. Direct contacts I couldn\'t find anywhere.', rating: 5 },
  { name: 'Karthik Reddy', role: 'ML Eng @ Google India', av: 'KR', text: 'The outreach templates + follow-up scheduler doubled my reply rate.', rating: 5 },
];

const plans = [
  { name: 'Launch', price: 0, annualPrice: 0, desc: 'Get started for free', feats: ['50 jobs/month', '10 recruiter lookups', '5 outreach messages', 'Basic analytics'], cta: 'Start Free', highlight: false },
  { name: 'Accelerate', price: 1999, annualPrice: 1499, desc: 'For active job seekers', feats: ['150 jobs/month', '50 recruiter lookups', 'Unlimited outreach', 'AI message polish', 'Follow-up scheduler', 'Priority support'], cta: 'Start Trial', highlight: true, badge: 'Most Popular' },
  { name: 'Dominate', price: 3999, annualPrice: 2999, desc: 'For power users', feats: ['Unlimited everything', 'AI job scoring', 'LinkedIn automation', 'Multi-profile', 'API access', 'Success manager'], cta: 'Contact Sales', highlight: false },
];

const faqs = [
  { q: 'How does the job scraper work?', a: 'Our AI simultaneously searches LinkedIn, Indeed, Glassdoor, and Instahyre using your filters, ranking results by match score and freshness.' },
  { q: 'Is my data safe?', a: 'Absolutely. We use AES-256 encryption and never sell your data. Your phone is only used for authentication.' },
  { q: 'How accurate is recruiter enrichment?', a: 'About 94% accuracy using LinkedIn data, company directories, and proprietary databases. All contacts are verified.' },
  { q: 'Can I try before subscribing?', a: 'Yes! The Launch plan is completely free forever. No credit card required.' },
  { q: 'What is the AI message polish feature?', a: 'One click runs your draft through our AI to improve tone, clarity, personalization, and reply probability.' },
];

export default function LandingPage() {
  const router = useRouter();
  const { login } = useApp();
  const [annual, setAnnual] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogin = (phone) => { login(phone); router.push('/dashboard'); };

  return (
    <>
      <Head>
        <title>JobFlow — AI Job Search Automation</title>
        <meta name="description" content="Automate your job search. Scrape jobs, find recruiters, send personalized outreach, and track everything on autopilot." />
      </Head>

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300" style={{ background: scrolled ? 'rgba(7,13,26,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}><Briefcase size={13} className="text-white" /></div>
            <span className="font-black text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>Job<span className="gradient-text">Flow</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {['Features', 'Pricing', 'FAQ'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="#get-started" className="btn-primary text-sm hidden sm:flex">Get Started <ArrowRight size={13} /></a>
            <button className="md:hidden p-2 rounded-lg" style={{ color: 'var(--text-secondary)', background: 'var(--glass)' }} onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden px-4 pb-4 space-y-1" style={{ borderTop: '1px solid var(--border)', background: 'rgba(7,13,26,0.95)' }}>
            {['Features', 'Pricing', 'FAQ'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileMenu(false)} className="block px-4 py-2.5 rounded-xl text-sm" style={{ color: 'var(--text-secondary)' }}>{l}</a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="get-started" className="relative min-h-screen flex items-center pt-16 overflow-hidden" style={{ background: 'var(--bg-base)' }}>
        <div className="orb animate-orb" style={{ width: 500, height: 500, top: -100, left: -150, background: 'radial-gradient(circle,rgba(59,130,246,0.18) 0%,transparent 70%)' }} />
        <div className="orb animate-orb" style={{ width: 400, height: 400, bottom: -80, right: -100, background: 'radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%)', animationDelay: '2s' }} />
        <div className="absolute inset-0 dot-grid opacity-40" style={{ zIndex: 0 }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
          <div className="animate-fade-in">
            <div className="badge badge-blue mb-5 w-fit"><Zap size={11} /> AI-Powered · 10,000+ job seekers</div>
            <h1 className="text-5xl sm:text-6xl font-black leading-[1.08] tracking-tight mb-5" style={{ color: 'var(--text-primary)' }}>
              Land Your <span className="shimmer-text">Dream Job</span><br />on Autopilot
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: 'var(--text-secondary)' }}>
              Scrape jobs across 4 platforms, find recruiter contacts with AI, craft personalized outreach, and track every interaction — from one dashboard.
            </p>
            <div className="flex flex-wrap gap-6 mb-8">
              {[{ val: 70, suf: '%', label: 'Less time searching' }, { val: 38, suf: '%', label: 'Avg reply rate' }, { val: 10, suf: 'k+', label: 'Jobs placed' }].map(({ val, suf, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black gradient-text"><Counter end={val} suffix={suf} /></div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              <a href="#get-started" className="btn-primary">Start Free <ArrowRight size={14} /></a>
              <a href="#features" className="btn-ghost">See Features</a>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['AM', 'PN', 'KR', 'NK', 'AD'].map((av, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white" style={{ borderColor: 'var(--bg-base)', background: ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444'][i] }}>{av}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#f59e0b" stroke="none" />)}
                  <span className="text-xs font-bold ml-1" style={{ color: 'var(--text-primary)' }}>4.9</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>from 2,400+ reviews</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end animate-slide-up">
            <OTPForm onSuccess={handleLogin} />
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-8" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'rgba(13,21,38,0.5)' }}>
        <p className="text-center text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Trusted by job seekers who landed at</p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 px-4">
          {['Flipkart', 'Razorpay', 'PhonePe', 'Zerodha', 'Swiggy', 'CRED', 'Freshworks', 'Infosys'].map(l => (
            <span key={l} className="text-sm font-bold" style={{ color: 'rgba(148,163,184,0.5)', letterSpacing: '0.05em' }}>{l}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="badge badge-purple mx-auto mb-4 w-fit">Features</div>
            <h2 className="text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Everything to <span className="gradient-text">get hired</span></h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>One platform automating the most time-consuming parts of your job search.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {features.map(({ icon: Icon, label, desc, badge, color }) => (
              <div key={label} className="card-dark p-6 animate-fade-in">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}1a`, border: `1px solid ${color}33` }}><Icon size={20} style={{ color }} /></div>
                  <span className="badge badge-gray text-xs">{badge}</span>
                </div>
                <h3 className="font-bold mb-2 text-sm" style={{ color: 'var(--text-primary)' }}>{label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard section */}
      <section className="py-20" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="badge badge-blue mb-4 w-fit">Automation Toolkit</div>
              <h2 className="text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Top-used <span className="gradient-text">modules</span></h2>
              <p className="text-base mb-4" style={{ color: 'var(--text-secondary)' }}>The most powerful job-search automations, ranked by usage across 10,000+ users.</p>
              <code className="text-sm font-mono px-4 py-2.5 rounded-xl inline-block mb-4" style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: '#60a5fa' }}>$ npx jobflow add &lt;module&gt;</code>
              <div className="flex gap-2">
                {['All Time', 'Trending', 'New'].map((t, i) => (
                  <span key={t} className={`badge ${i === 0 ? 'badge-blue' : 'badge-gray'} cursor-pointer select-none`}>{t}</span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {lbItems.map(({ rank, label, installs, tag }) => (
                <div key={rank} className="lb-row">
                  <span className="w-6 text-center text-sm font-black font-mono shrink-0" style={{ color: rank <= 3 ? '#f59e0b' : 'var(--text-muted)' }}>{rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}</span>
                  <p className="flex-1 font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{label}</p>
                  <span className="badge badge-gray shrink-0">{tag}</span>
                  <span className="text-sm font-bold font-mono shrink-0" style={{ color: 'var(--primary)' }}>{installs}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 50%,#7c3aed 100%)' }}>
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[{ val: 10000, suf: '+', label: 'Jobs scraped/day' }, { val: 38, suf: '%', label: 'Avg reply rate' }, { val: 94, suf: '%', label: 'Recruiter accuracy' }, { val: 70, suf: '%', label: 'Time saved' }].map(({ val, suf, label }) => (
            <div key={label}><div className="text-4xl font-black text-white"><Counter end={val} suffix={suf} /></div><p className="text-blue-200 text-sm mt-1">{label}</p></div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="badge badge-green mx-auto mb-4 w-fit">Testimonials</div>
            <h2 className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>Real results from <span className="gradient-text">real users</span></h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {testimonials.map(({ name, role, av, text, rating }) => (
              <div key={name} className="card-dark p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">{[...Array(rating)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" stroke="none" />)}</div>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#3b82f6,#a855f7)' }}>{av}</div>
                  <div><p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{name}</p><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="badge badge-orange mx-auto mb-4 w-fit">Pricing</div>
            <h2 className="text-4xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>Simple <span className="gradient-text">pricing</span></h2>
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm font-medium" style={{ color: annual ? 'var(--text-muted)' : 'var(--text-primary)' }}>Monthly</span>
              <button onClick={() => setAnnual(!annual)} className="w-12 h-6 rounded-full relative transition-colors" style={{ background: annual ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}>
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: annual ? '26px' : '2px' }} />
              </button>
              <span className="text-sm font-medium flex items-center gap-2" style={{ color: annual ? 'var(--text-primary)' : 'var(--text-muted)' }}>Annual <span className="badge badge-green">Save 25%</span></span>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {plans.map(({ name, price, annualPrice, desc, feats, cta, highlight, badge }) => (
              <div key={name} className="p-6 rounded-2xl relative flex flex-col" style={{ background: highlight ? 'linear-gradient(135deg,rgba(37,99,235,0.3),rgba(124,58,237,0.2))' : 'var(--glass)', border: highlight ? '1px solid rgba(59,130,246,0.5)' : '1px solid var(--border)', boxShadow: highlight ? '0 0 30px rgba(59,130,246,0.2)' : 'none' }}>
                {badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="badge badge-blue">{badge}</span></div>}
                <div className="mb-4">
                  <h3 className="font-black text-lg mb-0.5" style={{ color: 'var(--text-primary)' }}>{name}</h3>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                  {price === 0 ? <span className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>Free</span> : (
                    <div className="flex items-baseline gap-1"><span className="text-4xl font-black gradient-text">₹{(annual ? annualPrice : price).toLocaleString()}</span><span className="text-sm" style={{ color: 'var(--text-muted)' }}>/mo</span></div>
                  )}
                </div>
                <ul className="space-y-2 flex-1 mb-5">
                  {feats.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(59,130,246,0.15)' }}><Check size={9} style={{ color: 'var(--primary)' }} /></div>{f}
                    </li>
                  ))}
                </ul>
                <a href="#get-started" className={`${highlight ? 'btn-primary' : 'btn-ghost'} justify-center`}>{cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="badge badge-gray mx-auto mb-4 w-fit">FAQ</div>
            <h2 className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>Got <span className="gradient-text">questions?</span></h2>
          </div>
          <div className="space-y-3">{faqs.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}</div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div className="orb" style={{ width: 400, height: 400, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle,rgba(59,130,246,0.15) 0%,transparent 70%)' }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Ready to land your<br /><span className="shimmer-text">dream job?</span></h2>
          <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>Join 10,000+ job seekers. Free to start, no credit card needed.</p>
          <a href="#get-started" className="btn-primary text-base px-8 py-3.5 inline-flex">Get Started Free <ArrowRight size={17} /></a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-base)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3"><div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}><Briefcase size={13} className="text-white" /></div><span className="font-black" style={{ color: 'var(--text-primary)' }}>JobFlow</span></div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>AI-powered job search automation for modern professionals.</p>
            </div>
            {[{ title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] }, { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] }, { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] }].map(({ title, links }) => (
              <div key={title}><p className="font-bold text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{title}</p><ul className="space-y-2">{links.map(l => <li key={l}><a href="#" className="text-xs" style={{ color: 'var(--text-muted)' }}>{l}</a></li>)}</ul></div>
            ))}
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© 2025 JobFlow. Built with ❤️ for job seekers.</p>
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>v2.0.0</p>
          </div>
        </div>
      </footer>
    </>
  );
}
