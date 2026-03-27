import React from 'react';

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
          <div key={s.title} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col">
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

export default Services;
