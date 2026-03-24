import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

/* ─── Navbar ──────────────────────────────────────────────────────────────── */
const Navbar: React.FC<{ user: boolean }> = ({ user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Services', href: '#services' },
    { label: 'Benefits', href: '#benefits' },
  ];

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-slate-900/95 shadow-sm backdrop-blur-md border-b border-slate-200 dark:border-slate-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" onClick={() => scrollTo('#hero')} className="flex items-center gap-2">
          <img src="/logo.png" alt="Taskora" className="h-8 object-contain" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.href)}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {l.label}
            </button>
          ))}
          {user ? (
            <Link
              to="/dashboard"
              className="ml-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/register"
              className="ml-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
            >
              Get Started
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.href)}
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-left"
            >
              {l.label}
            </button>
          ))}
          {user ? (
            <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium text-center">
              Dashboard
            </Link>
          ) : (
            <Link to="/register" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium text-center">
              Get Started
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

/* ─── Hero ────────────────────────────────────────────────────────────────── */
const Hero: React.FC<{ user: boolean }> = ({ user }) => (
  <section
    id="hero"
    className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 overflow-hidden"
  >
    {/* Background blobs */}
    <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-300/30 dark:bg-indigo-700/20 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-300/30 dark:bg-purple-700/20 rounded-full blur-3xl pointer-events-none" />

    <div className="relative max-w-4xl mx-auto px-6 text-center pt-24 pb-16">
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wide mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        All-in-one freelance platform
      </span>

      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
        Run your freelance{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          business smarter
        </span>
      </h1>

      <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
        Taskora brings together task management, client relationships, project tracking, and invoicing — so you can focus on the work that matters.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {user ? (
          <Link
            to="/dashboard"
            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base transition-colors shadow-lg shadow-indigo-500/25"
          >
            Go to Dashboard →
          </Link>
        ) : (
          <>
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base transition-colors shadow-lg shadow-indigo-500/25"
            >
              Get started free →
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-base hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Sign in
            </Link>
          </>
        )}
      </div>

      {/* Stats row */}
      <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-8 max-w-lg mx-auto">
        {[
          { value: '10k+', label: 'Freelancers' },
          { value: '98%', label: 'Satisfaction' },
          { value: '3x', label: 'Faster billing' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Features ────────────────────────────────────────────────────────────── */
const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: 'Task Management',
    desc: 'Create, assign, and track tasks with real-time status updates. Never miss a deadline again.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Client Management',
    desc: 'Keep all your client contacts, notes, and history organized in one clean place.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    title: 'Project Tracking',
    desc: 'Organize work into projects, monitor progress, and deliver on time every time.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Smart Invoicing',
    desc: 'Generate professional invoices and download PDF — get paid faster with less effort.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Analytics Dashboard',
    desc: 'Get a bird\'s-eye view of revenue, tasks, and project health at a glance.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Role-Based Access',
    desc: 'Separate permissions for admins and freelancers — your data stays secure and organized.',
  },
];

const Features: React.FC = () => (
  <section id="features" className="py-24 bg-white dark:bg-slate-900">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Everything you need to thrive
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
          Purpose-built tools for independent professionals who mean business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-50 dark:hover:shadow-indigo-950 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
              {f.icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Services ────────────────────────────────────────────────────────────── */
const services = [
  {
    badge: 'For Freelancers',
    color: 'indigo',
    title: 'Solo Freelancer Suite',
    desc: 'Everything a solo professional needs: manage clients, run projects, track tasks, and bill with confidence.',
    items: ['Unlimited clients & projects', 'Task board with status tracking', 'PDF invoice generation', 'Income overview dashboard'],
  },
  {
    badge: 'For Teams',
    color: 'purple',
    title: 'Team Workspace',
    desc: 'Coordinate with collaborators, delegate tasks, and keep everyone aligned on shared goals.',
    items: ['Multi-user role management', 'Shared project spaces', 'Admin analytics panel', 'User activity monitoring'],
  },
  {
    badge: 'Automation',
    color: 'emerald',
    title: 'Automated Workflows',
    desc: 'Let Taskora handle the repetitive admin so you can stay in the creative zone.',
    items: ['Auto-generate invoices', 'Status transition triggers', 'Deadline reminders', 'Report scheduling'],
  },
];

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
};

const Services: React.FC = () => (
  <section id="services" className="py-24 bg-slate-50 dark:bg-slate-950">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Services built for your workflow
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
          Whether you work alone or with a team, Taskora scales with you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((s) => (
          <div
            key={s.title}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col"
          >
            <span className={`self-start px-3 py-1 text-xs font-semibold rounded-full border ${colorMap[s.color]} mb-4`}>
              {s.badge}
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{s.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{s.desc}</p>
            <ul className="space-y-2 mt-auto">
              {s.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Benefits ────────────────────────────────────────────────────────────── */
const benefits = [
  {
    icon: '⚡',
    title: 'Save hours every week',
    desc: 'Automate invoicing, status updates, and reporting — reclaim time for billable work.',
  },
  {
    icon: '💼',
    title: 'Look more professional',
    desc: 'Polished invoices and organized client records make a lasting impression.',
  },
  {
    icon: '📊',
    title: 'Make data-driven decisions',
    desc: 'Real-time dashboards help you understand what\'s working and where to focus.',
  },
  {
    icon: '🔒',
    title: 'Keep everything secure',
    desc: 'JWT-based auth and role-based permissions ensure your business data stays private.',
  },
  {
    icon: '🌙',
    title: 'Works in dark mode too',
    desc: 'Easy on the eyes — day or night, Taskora adapts to your preference.',
  },
  {
    icon: '📱',
    title: 'Responsive on every device',
    desc: 'From desktop to mobile, Taskora looks great and works flawlessly anywhere.',
  },
];

const Benefits: React.FC = () => (
  <section id="benefits" className="py-24 bg-white dark:bg-slate-900">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Why freelancers choose Taskora
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">
            We built Taskora by talking to hundreds of freelancers. Every feature solves a real pain point.
          </p>
          <div className="space-y-5">
            {benefits.slice(0, 3).map((b) => (
              <div key={b.title} className="flex items-start gap-4">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{b.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {benefits.slice(3).map((b) => (
            <div
              key={b.title}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <span className="text-3xl">{b.icon}</span>
              <h4 className="font-semibold text-slate-900 dark:text-white mt-3 mb-1">{b.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ─── CTA ─────────────────────────────────────────────────────────────────── */
const CTA: React.FC<{ user: boolean }> = ({ user }) => (
  <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Ready to take control of your freelance business?
      </h2>
      <p className="text-indigo-200 text-lg mb-10">
        Join thousands of freelancers who use Taskora to work smarter, bill faster, and grow confidently.
      </p>
      {user ? (
        <Link
          to="/dashboard"
          className="inline-block px-10 py-4 rounded-xl bg-white text-indigo-600 font-bold text-base hover:bg-indigo-50 transition-colors shadow-xl"
        >
          Go to your Dashboard →
        </Link>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="px-10 py-4 rounded-xl bg-white text-indigo-600 font-bold text-base hover:bg-indigo-50 transition-colors shadow-xl"
          >
            Get started free →
          </Link>
          <Link
            to="/login"
            className="px-10 py-4 rounded-xl bg-transparent border-2 border-white text-white font-bold text-base hover:bg-white/10 transition-colors"
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  </section>
);

/* ─── Footer ──────────────────────────────────────────────────────────────── */
const Footer: React.FC = () => (
  <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-16">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <img src="/logo.png" alt="Taskora" className="h-8 object-contain mb-4" />
          <p className="text-sm leading-relaxed max-w-xs">
            The all-in-one platform for freelancers to manage clients, projects, tasks, and invoices in one place.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            {['Features', 'Services', 'Pricing', 'Changelog'].map((l) => (
              <li key={l}>
                <a href="#" className="hover:text-white transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {['About', 'Blog', 'Careers', 'Contact'].map((l) => (
              <li key={l}>
                <a href="#" className="hover:text-white transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">© {new Date().getFullYear()} Taskora. All rights reserved.</p>
        <div className="flex items-center gap-6 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

/* ─── Page ────────────────────────────────────────────────────────────────── */
const LandingPage: React.FC = () => {
  const user = useAppSelector((s) => s.auth.user);
  const isLoggedIn = !!user;

  return (
    <div className="font-sans antialiased">
      <Navbar user={isLoggedIn} />
      <Hero user={isLoggedIn} />
      <Features />
      <Services />
      <Benefits />
      <CTA user={isLoggedIn} />
      <Footer />
    </div>
  );
};

export default LandingPage;
