import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-16">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="col-span-1 md:col-span-2">
          <img src="/logo.png" alt="Taskora" className="h-8 object-contain mb-4" />
          <p className="text-sm leading-relaxed max-w-xs">
            The all-in-one platform for freelancers to manage clients, projects, tasks, and invoices in one place.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            {['Features', 'Services', 'Pricing', 'Changelog'].map((l) => (
              <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {['About', 'Blog', 'Careers', 'Contact'].map((l) => (
              <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
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

export default Footer;
