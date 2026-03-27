import React from 'react';
import { Link } from 'react-router-dom';

interface CTAProps {
  user: boolean;
}

const CTA: React.FC<CTAProps> = ({ user }) => (
  <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Ready to take control of your freelance business?
      </h2>
      <p className="text-indigo-200 text-lg mb-10">
        Join thousands of freelancers who use Taskora to work smarter, bill faster, and grow confidently.
      </p>
      {user ? (
        <Link to="/dashboard" className="inline-block px-10 py-4 rounded-xl bg-white text-indigo-600 font-bold text-base hover:bg-indigo-50 transition-colors shadow-xl">
          Go to your Dashboard →
        </Link>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="px-10 py-4 rounded-xl bg-white text-indigo-600 font-bold text-base hover:bg-indigo-50 transition-colors shadow-xl">
            Get started free →
          </Link>
          <Link to="/login" className="px-10 py-4 rounded-xl bg-transparent border-2 border-white text-white font-bold text-base hover:bg-white/10 transition-colors">
            Sign in
          </Link>
        </div>
      )}
    </div>
  </section>
);

export default CTA;
