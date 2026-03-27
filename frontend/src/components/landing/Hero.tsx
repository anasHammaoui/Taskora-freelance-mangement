import React from 'react';
import { Link } from 'react-router-dom';

interface HeroProps {
  user: boolean;
}

const Hero: React.FC<HeroProps> = ({ user }) => (
  <section
    id="hero"
    className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 overflow-hidden"
  >
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
          <Link to="/dashboard" className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base transition-colors shadow-lg shadow-indigo-500/25">
            Go to Dashboard →
          </Link>
        ) : (
          <>
            <Link to="/register" className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base transition-colors shadow-lg shadow-indigo-500/25">
              Get started free →
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-base hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Sign in
            </Link>
          </>
        )}
      </div>

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

export default Hero;
