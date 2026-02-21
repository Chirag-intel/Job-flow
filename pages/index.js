import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Search, Users, MessageSquare, BarChart2, Zap, ArrowRight, Check, Star, ChevronDown, Menu, X, Phone, Shield, Briefcase, Cpu, Clock, Globe, Target, Linkedin, PlayCircle, Eye, Loader2, CreditCard } from 'lucide-react';
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
    <div className="w-full max-w-sm relative group perspective-1000">
      <div className="absolute inset-0 bg-blue-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 w-[120%] h-[120%] -left-[10%] -top-[10%] rounded-full mix-blend-screen pointer-events-none" />
      <div className="relative p-8 rounded-[2rem] transform-gpu transition-all duration-500 hover:rotate-y-[-2deg] hover:rotate-x-[2deg] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]"
        style={{ background: 'linear-gradient(145deg, rgba(13,21,38,0.95), rgba(7,13,26,0.95))', border: '1px solid rgba(59,130,246,0.3)' }}>
        <div className="absolute inset-0 bg-noise opacity-[0.03] rounded-[2rem] pointer-events-none" />
        <div className="flex items-center gap-3 mb-8 relative">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
            {step === 'phone' ? <Phone size={20} className="text-white drop-shadow-md" /> : <Shield size={20} className="text-white drop-shadow-md" />}
          </div>
          <div>
            <h3 className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>{step === 'phone' ? 'Outsource Your Hunt' : 'Verify Mobile'}</h3>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--primary)' }}>{step === 'phone' ? 'Start Free Trial' : `Code sent to +91 ${phone}`}</p>
          </div>
        </div>

        {step === 'phone' ? (
          <form onSubmit={sendOTP} className="space-y-4 relative">
            <div className="flex items-center input-dark rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-all border border-blue-500/20 bg-[#0a1122]" style={{ padding: 0 }}>
              <span className="px-4 py-3.5 text-sm font-bold border-r border-blue-500/20 shrink-0 text-blue-400 bg-blue-500/5">+91</span>
              <input className="flex-1 bg-transparent py-3.5 px-4 text-sm font-semibold outline-none text-white placeholder:text-gray-600 tracking-wide" placeholder="Enter mobile number" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} />
            </div>
            {error && <p className="text-xs font-semibold text-red-400 flex items-center gap-1"><X size={12} />{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full h-12 text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 relative overflow-hidden group">
              <span className="relative z-10">{loading ? 'Connecting AI...' : 'Start Job Search'}</span>
              {!loading && <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOTP} className="space-y-4 relative">
            <input className="input-dark text-center text-3xl tracking-[1em] font-black w-full h-14 bg-[#0a1122] border-blue-500/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 rounded-xl outline-none text-white placeholder-[var(--text-muted)]" placeholder="------" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} />
            {error && <p className="text-xs font-semibold text-red-400 flex items-center gap-1"><X size={12} />{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full h-12 text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
              {loading ? 'Authenticating...' : 'Access Hub'}
              {!loading && <Check size={16} />}
            </button>
            <button type="button" onClick={() => { setStep('phone'); setOtp(''); setError(''); }} className="w-full text-center text-xs font-semibold text-gray-500 hover:text-white transition-colors uppercase tracking-wider mt-2">← Change Number</button>
          </form>
        )}
        <div className="mt-6 pt-5 flex items-center justify-center gap-2 border-t border-white/5">
          <Shield size={12} className="text-green-500" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-green-500/70">Military-Grade Encryption</p>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ plan, price, onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
      <div className="w-full max-w-md bg-[#0a1122] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors z-10"><X size={20} /></button>

        {success ? (
          <div className="p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 text-white animate-bounce shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <Check size={32} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Payment Successful!</h3>
            <p className="text-gray-400">Welcome to the {plan} plan.</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white"><CreditCard size={20} /></div>
              <div>
                <h3 className="font-bold text-lg text-white">Secure Checkout</h3>
                <p className="text-xs text-blue-400 uppercase tracking-widest font-bold">Powered by Stripe</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-gray-300">
                <span>Plan Subscription</span>
                <span className="font-bold text-white">{plan}</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span>Total Amount</span>
                <span className="font-black text-xl text-white">₹{price.toLocaleString()}</span>
              </div>

              <div className="space-y-3 mt-6">
                <div className="bg-[#050a14] p-3 rounded-xl border border-white/5 flex items-center gap-3">
                  <input type="radio" checked readOnly className="w-4 h-4 accent-blue-500" />
                  <span className="text-sm font-semibold text-gray-200">UPI / Net Banking</span>
                </div>
                <div className="bg-[#050a14] p-3 rounded-xl border border-white/5 flex items-center gap-3">
                  <input type="radio" disabled className="w-4 h-4" />
                  <span className="text-sm font-semibold text-gray-500">Credit Card (coming soon)</span>
                </div>
              </div>

              <button onClick={handlePay} disabled={loading} className="btn-primary w-full h-12 text-sm font-bold mt-6 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : `Pay ₹${price.toLocaleString()}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:border-blue-500/30" style={{ border: '1px solid var(--border)', background: open ? 'rgba(59,130,246,0.08)' : 'var(--glass)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 text-left p-6">
        <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{q}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${open ? 'bg-blue-500 text-white' : 'bg-white/5 text-[var(--text-muted)] group-hover:bg-white/10'}`}>
          <ChevronDown size={18} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{a}</div>
        </div>
      </div>
    </div>
  );
}

const features = [
  { icon: Search, label: 'Omni-Channel Aggregation', desc: 'Real-time synchronization with LinkedIn, Indeed, Glassdoor, Naukri, and IIM Jobs. We cover the entire market.', badge: '6+ Tech Portals', color: '#3b82f6' },
  { icon: Globe, label: 'Deep Target Insights', desc: 'Pre-interview intelligence gathering via Premium Market Databases. We map out funding rounds, director history, and company trajectory.', badge: 'Rich Data', color: '#a855f7' },
  { icon: Cpu, label: 'Hyper-Personalized Matching', desc: 'Our AI engine reads your resume and cross-references it against market demands to compute precise Match Scores.', badge: 'AI Native', color: '#00e5ff' },
  { icon: Users, label: 'Triple-Verified Recruitment', desc: 'We don\'t just find emails. We locate direct hiring managers, HR heads, and technical leads, triple-verifying contact paths.', badge: 'Direct Line', color: '#10b981' },
  { icon: Target, label: 'Outreach & Follow-Up Automation', desc: 'Done-for-you sequencing. Beautifully crafted pitches hit recruiter inboxes automatically until you secure the interview.', badge: 'Autopilot', color: '#f59e0b' },
  { icon: BarChart2, label: 'End-to-End Tracking Hub', desc: 'A gorgeous dashboard that visualizes your application funnel. Watch interviews stack up while you sleep.', badge: 'Live Metrics', color: '#f97316' },
];

const team = [
  { name: 'Aditya Pareek', role: 'Co-Founder and CEO', image: 'https://media.licdn.com/dms/image/v2/D4D03AQE8Kx0yN_Nl2A/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1703672583279?e=1745452800&v=beta&t=S0BfK2iW7xH5oQzM-J1tA_i3L_zM5v6L-N9U8n0Y7kQ', ln: 'https://in.linkedin.com/in/adityapareek' },
  { name: 'Sumit Goyal', role: 'Co-Founder and COO', image: 'https://media.licdn.com/dms/image/v2/D4D03AQH3xJp_4h0Lqg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1718260027725?e=1745452800&v=beta&t=_bZt6-V8x_X_2k1H-H8Q-9k_h8h8g_y_u7j_jS_V_E', ln: 'https://in.linkedin.com/in/sumit-goyal-7a3bb3100' },
  { name: 'Chirag Ameta', role: 'Co-Founder and CPO', image: 'https://media.licdn.com/dms/image/v2/D5603AQF48Nl8XbVQqA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1714571008035?e=1745452800&v=beta&t=Hk0oQ5w-P2w9_J_f5YQQe_Jtq1-d8zKQH3t2aM1GZ-s', ln: 'https://in.linkedin.com/in/chirag-ameta-b1bb84176' },
];

const plans = [
  { name: 'Beta Launch', price: 0, annualPrice: 0, desc: 'Experience the AI Hub', feats: ['50 Premium Job Syncs/mo', '10 Deep Recruiter Lookups', 'Basic Company Insights (Intel)', '1 Active Campaign'], cta: 'Start Free', highlight: false },
  { name: 'Active Search', price: 2999, annualPrice: 2499, desc: 'Outsource your daily hunt', feats: ['300 Premium Job Syncs/mo', '100 Verified Recruiter Invites', 'Full Company Intel Analytics', 'AI-Tuned Matching Algorithms', 'Automated LinkedIn Outreach', 'Priority Inbox Placements'], cta: 'Upgrade Now', highlight: true, badge: 'High ROI' },
  { name: 'Executive Suite', price: 9999, annualPrice: 7999, desc: 'For Senior & C-Level Transitions', feats: ['Unlimited VIP Syncs', 'Direct Founder/CEO Contact Unlocks', 'Dedicated Success Strategist', 'Bespoke Resume Reprogramming', 'Interview Preparation AI Agent', 'End-to-End Handled Application'], cta: 'Contact Partners', highlight: false },
];

const faqs = [
  { q: 'What does "Done-For-You" actually mean?', a: 'It means we treat your job search like a B2B sales campaign. You input your target role, salary (e.g., ₹20 LPA+), and preferred locations. Our system syncs, filters, analyzes the companies via Private Databases, finds the decision-makers, and executes outreach. You literally just show up to the interviews.' },
  { q: 'Which open source job portals do you sync with?', a: 'Our live-scan engine currently pulls real-time listings from LinkedIn, Naukri, Indeed, Glassdoor, IIM Jobs, and AngelList (Wellfound). We aggregate them into a single, deduplicated, highly enriched feed.' },
  { q: 'How do you generate insights about a company?', a: 'We employ deep web crawling. Before you apply or interview, we present you with employer financial health data, funding rounds, recent PR news, and employee sentiment analysis from Glassdoor. You walk into interviews knowing more than they do.' },
  { q: 'Is this only for high-paying Tech jobs?', a: 'No. Our algorithm is trained across the entire spectrum—from Fresher Operational roles at ₹4-6 LPA, Mid-level Marketing at ₹15-25 LPA, to Executive Finance and Tech positions hitting ₹60+ LPA. The system adapts its scoring and outreach tactics based on the tier.' },
  { q: 'How does the Recruiter Enrichment differ from just Googling?', a: 'Googling yields generic "hr@company.com" addresses. Our Enrichment simulates proprietary lookup algorithms to identify the specific Talent Acquisition Managers, Technical Leads, or even Founders relevant to your job req. We then triple-verify the email and phone data for 90%+ deliverability.' },
];

export default function LandingPage() {
  const router = useRouter();
  const { login } = useApp();
  const [annual, setAnnual] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogin = (phone) => { login(phone); router.push('/dashboard'); };

  const handleUpgradeClick = (planName, price) => {
    if (price === 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.querySelector('input[placeholder="Enter mobile number"]')?.focus();
    } else {
      setCheckoutPlan({ plan: planName, price: price });
    }
  };

  return (
    <div className="bg-[var(--bg-base)] text-white overflow-x-hidden selection:bg-blue-500/30">
      <Head>
        <title>JobFlow — AI Job Search Outsourcing</title>
        <meta name="description" content="Outsource your complete job seeking lifecycle. Real-time sourcing, Deep Company insights, AI matching, and automated outreach." />
      </Head>

      {checkoutPlan && <PaymentModal plan={checkoutPlan.plan} price={checkoutPlan.price} onClose={() => setCheckoutPlan(null)} />}

      {/* Modern Blurry Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(7,13,26,0.7)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent'
        }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo.png" alt="JobFlow Logo" className="w-10 h-10 rounded-xl shadow-[0_4px_12px_rgba(59,130,246,0.4)] object-cover" />
            <span className="font-black text-2xl tracking-tighter" style={{ color: 'var(--text-primary)' }}>Job<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Flow</span></span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1.5 border border-white/5 backdrop-blur-md">
            {['Service', 'Process', 'Pricing', 'Team', 'FAQ'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm font-semibold px-4 py-2 rounded-full transition-all hover:bg-white/10 hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href="#get-started" className="hidden sm:inline-flex relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-xl blur-md opacity-30 group-hover:opacity-70 transition-opacity" />
              <div className="relative btn-primary text-sm h-11 px-6 rounded-xl flex items-center gap-2 border border-white/10 font-bold tracking-wide shadow-2xl">
                Access Hub <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
            <button className="md:hidden p-2 rounded-xl border border-white/10 bg-white/5" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#070d1a]/95 backdrop-blur-xl border-b border-white/10 py-4 px-6 space-y-2 shadow-2xl">
            {['Service', 'Process', 'Pricing', 'Team', 'FAQ'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileMenu(false)} className="block py-3 text-lg font-bold border-b border-white/5 text-gray-300">
                {l}
              </a>
            ))}
            <a href="#get-started" onClick={() => setMobileMenu(false)} className="block mt-4 btn-primary text-center py-4 rounded-xl text-lg w-full">Access Hub</a>
          </div>
        )}
      </nav>

      {/* Cinematic Hero Section */}
      <section id="get-started" className="relative min-h-[105vh] flex items-center pt-24 pb-12 overflow-hidden justify-center perspective-1000">
        {/* Abstract 3D Gradients */}
        <div className="absolute top-1/4 -left-[20%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute bottom-1/4 -right-[20%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />

        {/* Floating AI Brain Image */}
        <div className="absolute top-[15%] right-[-10%] w-[500px] xl:top-[10%] xl:right-[-5%] xl:w-[700px] opacity-40 xl:opacity-60 mix-blend-screen animate-float pointer-events-none" style={{ animationDuration: '10s' }}>
          <img src="/brain.png" alt="AI Brain Core" className="w-full h-full object-contain filter hover:scale-105 transition-transform duration-1000 drop-shadow-[0_0_80px_rgba(59,130,246,0.8)] animate-pulse" style={{ animationDuration: '6s' }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid xl:grid-cols-12 gap-16 items-center">

          <div className="xl:col-span-7 flex flex-col items-start pt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-8 transform hover:scale-105 transition-transform cursor-default">
              <span className="relative flex h-2 w-2 shadow-[0_0_10px_#3b82f6]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Market intelligence Engine Active</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black leading-[1.05] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
              Stop Applying. <br />
              Let AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">Outsource</span><br />
              Your Job Search.
            </h1>

            <p className="text-lg sm:text-xl font-medium leading-relaxed mb-10 max-w-2xl text-gray-400 border-l-4 border-blue-500/50 pl-6 py-2 bg-gradient-to-r from-blue-500/5 to-transparent">
              We handle the entire lifecycle. Live syncing from 6+ open-source portals, deep market insights, triple-verified recruiter contacts, and automated personalized outreach.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12 w-full">
              {[
                { title: 'Live Sync', val: 'LinkedIn', icon: Eye },
                { title: 'Insights', val: 'Private DB', icon: Target },
                { title: 'Match', val: 'AI Score', icon: Cpu },
                { title: 'Outreach', val: 'Automated', icon: PlayCircle }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                    <stat.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{stat.title}</p>
                    <p className="text-sm font-black text-gray-200">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-5 flex justify-center xl:justify-end">
            <OTPForm onSuccess={handleLogin} />
          </div>

        </div>
      </section>

      {/* Corporate Trusted Section */}
      <section className="py-12 border-t border-b border-white/5 bg-[#0a1122]/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-8 text-center">We discover opportunities and place candidates across top organizations</p>
          <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {['Zomato', 'Freshworks', 'Razorpay', 'Zerodha', 'Swiggy', 'CRED', 'Paytm', 'PhonePe', 'Flipkart'].map(logo => (
                <li key={logo} className="text-2xl font-black font-serif tracking-tighter mx-10 text-white">{logo}.</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* "Service" Features - 3D Card Grid */}
      <section id="service" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-3 block">The Service Paradigm</span>
            <h2 className="text-4xl sm:text-5xl font-black mb-6 text-white leading-tight">We Don't Provide Tools.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">We Provide Execution.</span></h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">From discovering obscure startup listings to analyzing Fortune 500 balance sheets before your interview. It's a complete done-for-you service.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, label, desc, badge, color }, index) => (
              <div key={label} className="group relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-white/0 hover:from-white/20 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
                <div className="relative h-full bg-[#0a1122]/90 backdrop-blur-xl rounded-3xl p-8 flex flex-col gap-6 transform-gpu transition-transform duration-500 group-hover:-translate-y-1">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${color}20, ${color}05)`, border: `1px solid ${color}40`, color: color }}>
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] uppercase font-bold px-3 py-1 bg-white/5 border border-white/10 rounded-full tracking-wider text-gray-300 transition-colors">{badge}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white transition-colors">{label}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "Process" - Deep Dive section */}
      <section id="process" className="py-32 border-t border-white/5 bg-[#050a14] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            <div className="order-2 lg:order-1 relative perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl transform rotate-12 scale-110 opacity-50" />
              <div className="relative bg-[#0a1122]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl transform transition-transform duration-700">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"><Globe size={28} className="text-white" /></div>
                  <div>
                    <h4 className="font-bold text-lg text-white">Premium DB Synthesis</h4>
                    <p className="text-xs text-gray-400 font-mono mt-1">Status: Extracting Live Intelligence</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { l: 'Company Match:', v: 'Razorpay Software Pvt Ltd', c: 'text-white' },
                    { l: 'Funding Stage:', v: 'Series F ($375M)', c: 'text-green-400' },
                    { l: 'Corporate Setup:', v: 'Active (DIR-12 FILED)', c: 'text-blue-400' },
                    { l: 'Growth Sentiment:', v: 'Hyper-Scale (+45% YoY hiring)', c: 'text-purple-400' },
                  ].map(row => (
                    <div key={row.l} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                      <span className="text-sm font-semibold text-gray-400">{row.l}</span>
                      <span className={`text-sm font-bold font-mono ${row.c}`}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-purple-500 font-bold tracking-widest uppercase text-sm mb-3 block">Corporate Intelligence</span>
              <h2 className="text-4xl sm:text-5xl font-black mb-8 text-white leading-tight">Don't Interview <br />In The Dark.</h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Applying on a portal is amateur. Our system pulls live statutory filings from <b>Private Registries</b>, funding rounds from <b>Premium VC Trackers</b>, and sentiment from <b>Glassdoor</b> to build a comprehensive dossier on the employer.
              </p>
              <ul className="space-y-4 mb-10">
                {['Know their funding run-way before accepting an offer.', 'Identify exactly which Director is responsible for your department.', 'Tailor your automated outreach based on their recent PR announcements.'].map((li, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 bg-purple-500/20 p-1 rounded-md border border-purple-500/30"><Check size={14} className="text-purple-400" /></div>
                    <span className="text-gray-300 font-medium">{li}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* The Team / Co-founders */}
      <section id="team" className="py-32 bg-[var(--bg-base)] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-green-500 font-bold tracking-widest uppercase text-sm mb-3 block">The Brains Behind The Operation</span>
            <h2 className="text-4xl sm:text-5xl font-black mb-6 text-white leading-tight">Meet The Founders.</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Built by industry veterans who realized the traditional job search was hopelessly broken and decided to automate it.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {team.map((member, i) => (
              <div key={member.name} className="flex flex-col items-center group">
                <div className="relative w-48 h-48 mb-8">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 blur-md transition-opacity duration-500" />
                  <div className="absolute inset-1 bg-[var(--bg-base)] rounded-full z-10 overflow-hidden border-2 border-white/10 group-hover:border-transparent transition-colors">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{member.name}</h3>
                <p className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">{member.role}</p>
                <a href={member.ln} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[#0077b5] hover:border-transparent transition-all group/ln">
                  <Linkedin size={16} className="text-gray-400 group-hover/ln:text-white transition-colors" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - SaaS/Service Hybrid */}
      <section id="pricing" className="py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-blue-600/5 rounded-[100%] blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-3 block">Service Tiers</span>
            <h2 className="text-4xl sm:text-5xl font-black mb-8 text-white leading-tight">Fractional Cost. <br />Exponential <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Results.</span></h2>

            <div className="inline-flex items-center justify-center gap-4 p-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <span className={`text-sm font-bold px-4 cursor-pointer transition-colors ${!annual ? 'text-white' : 'text-gray-500'}`} onClick={() => setAnnual(false)}>Monthly Retainer</span>
              <button onClick={() => setAnnual(!annual)} className="w-14 h-7 rounded-full relative transition-colors bg-blue-600 shadow-inner overflow-hidden">
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${annual ? 'left-[32px]' : 'left-1'}`} />
              </button>
              <span className={`text-sm font-bold px-4 cursor-pointer transition-colors flex items-center gap-2 ${annual ? 'text-white' : 'text-gray-500'}`} onClick={() => setAnnual(true)}>
                Annual Contract <span className="px-2 py-0.5 rounded text-[10px] uppercase font-black bg-orange-500/20 text-orange-400 border border-orange-500/30">Save 25%</span>
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map(({ name, price, annualPrice, desc, feats, cta, highlight, badge }) => (
              <div key={name} className={`relative flex flex-col p-px rounded-[2rem] transition-transform duration-500 hover:-translate-y-2 ${highlight ? 'bg-gradient-to-b from-blue-500 to-purple-600 shadow-[0_20px_80px_rgba(59,130,246,0.3)] z-10 scale-105' : 'bg-white/10'}`}>
                {badge && <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"><span className="px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border border-white/20">{badge}</span></div>}

                <div className="flex-1 rounded-[2rem] bg-[#0a1122] p-8 flex flex-col items-center text-center h-full">
                  <h3 className="font-black text-2xl mb-2 text-white">{name}</h3>
                  <p className="text-sm font-semibold text-gray-400 mb-8 uppercase tracking-widest">{desc}</p>

                  <div className="mb-10 w-full pb-8 border-b border-white/10">
                    {price === 0 ? <span className="text-6xl font-black text-white">Free</span> : (
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xl font-bold text-gray-400">₹</span>
                        <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{(annual ? annualPrice : price).toLocaleString()}</span>
                        <span className="text-sm font-bold text-gray-500 self-end mb-2">/mo</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-10 w-full text-left flex-1">
                    {feats.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${highlight ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-500'}`}><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-semibold text-gray-300 leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button onClick={() => handleUpgradeClick(name, annual ? annualPrice : price)} className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${highlight ? 'bg-white text-blue-900 hover:bg-gray-100 shadow-xl' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
                    {cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 bg-[var(--bg-base)] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-gray-500 font-bold tracking-widest uppercase text-sm mb-3 block">Clarity</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Operational <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600">Details.</span></h2>
          </div>
          <div className="space-y-4">
            {faqs.map(({ q, a }, index) => <FAQItem key={index} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050a14] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="JobFlow Logo" className="w-8 h-8 rounded-lg shadow-[0_4px_12px_rgba(59,130,246,0.4)] object-cover" />
                <span className="font-black text-xl tracking-tighter text-white">JobFlow</span>
              </div>
              <p className="text-sm font-medium leading-relaxed text-gray-500 max-w-sm mb-6">
                The ultimate 'Done-For-You' job search engine for the Indian market. Sync. Analyze. Connect. Automate.
              </p>
              <div className="flex gap-4">
                {[Linkedin, Search, Briefcase].map((Ic, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"><Ic size={16} /></div>
                ))}
              </div>
            </div>
            {[{ title: 'Product', links: ['Live Sync Engine', 'Market Integration', 'Company Intel', 'AI Matching', 'Outreach Bots'] },
            { title: 'Company', links: ['About the Founders', 'Methodology', 'Manifesto', 'Contact Team'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Data Encryption Standards'] }].map(({ title, links }) => (
              <div key={title} className="col-span-1">
                <p className="font-bold text-sm mb-6 text-white uppercase tracking-widest">{title}</p>
                <ul className="space-y-4">
                  {links.map(l => <li key={l}><a href="#" className="text-sm font-semibold text-gray-500 hover:text-blue-400 transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-gray-600 tracking-wider text-center sm:text-left">© 2025 JOBFLOW AUTOMATION. DEVELOPED BY THE FOUNDING TEAM.</p>
            <p className="text-xs font-black font-mono tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20">SYSTEM CORE: ACTIVE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
