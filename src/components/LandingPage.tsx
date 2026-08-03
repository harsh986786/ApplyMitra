'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { HowItWorks, TrustMarquee } from '@/components/HowItWorks';
import { ServicesGrid } from '@/components/ServicesGrid';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { JoinTeam } from '@/components/JoinTeam';
import Testimonials from '@/components/testimonials';
import { Footer } from '@/components/Footer';
import { ApplyModal } from '@/components/ApplyModal';
import { ToastProvider } from '@/lib/toast';
import type { Service } from '@/types';

export function LandingPage() {
  const [selected, setSelected] = useState<Service | null>(null);

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ToastProvider>
      <div className="relative">
        <Navbar onApply={scrollToServices} />
        <Hero onApply={scrollToServices} />
        <TrustMarquee />
        <HowItWorks />
        <ServicesGrid onApply={setSelected} />
        <About />
        <Testimonials />
        <JoinTeam />
        <Contact />
        <Footer />
        <ApplyModal service={selected} onClose={() => setSelected(null)} />
      </div>
    </ToastProvider>
  );
}
