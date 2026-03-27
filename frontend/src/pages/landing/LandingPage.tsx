import React from 'react';
import { useAppSelector } from '../../store/hooks';
import Navbar from '../../components/landing/Navbar';
import Hero from '../../components/landing/Hero';
import Features from '../../components/landing/Features';
import Services from '../../components/landing/Services';
import Benefits from '../../components/landing/Benefits';
import CTA from '../../components/landing/CTA';
import Footer from '../../components/landing/Footer';

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
