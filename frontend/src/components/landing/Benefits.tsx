import React from 'react';

const benefits = [
  { icon: '⚡', title: 'Save hours every week', desc: 'Automate invoicing, status updates, and reporting — reclaim time for billable work.' },
  { icon: '💼', title: 'Look more professional', desc: 'Polished invoices and organized client records make a lasting impression.' },
  { icon: '📊', title: 'Make data-driven decisions', desc: "Real-time dashboards help you understand what's working and where to focus." },
  { icon: '🔒', title: 'Keep everything secure', desc: 'JWT-based auth and role-based permissions ensure your business data stays private.' },
  { icon: '🌙', title: 'Works in dark mode too', desc: 'Easy on the eyes — day or night, Taskora adapts to your preference.' },
  { icon: '📱', title: 'Responsive on every device', desc: 'From desktop to mobile, Taskora looks great and works flawlessly anywhere.' },
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
            <div key={b.title} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
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

export default Benefits;
