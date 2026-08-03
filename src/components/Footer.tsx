'use client';

import { LogoLockup } from './Logo3D';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-ink-950/60">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <LogoLockup size={42} />
          <p className="mt-4 text-sm text-ink-300 leading-relaxed">
            India&apos;s online forms cafe. Our experts fill every form for you — government schemes, exams, jobs, certificates and more.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Services</h4>
          <ul className="space-y-2 text-sm text-ink-300">
            <li><a href="#services" className="hover:text-brand-300">Government schemes</a></li>
            <li><a href="#services" className="hover:text-brand-300">Exam &amp; job forms</a></li>
            <li><a href="#services" className="hover:text-brand-300">Certificates</a></li>
            <li><a href="#services" className="hover:text-brand-300">Pension &amp; welfare</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm text-ink-300">
            <li><a href="#about" className="hover:text-brand-300">About us</a></li>
            <li><a href="#join" className="hover:text-brand-300">Join our team</a></li>
            <li><a href="#contact" className="hover:text-brand-300">Contact</a></li>
            <li><a href="/login" className="hover:text-brand-300">Admin / Staff login</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Reach us</h4>
          <ul className="space-y-2 text-sm text-ink-300">
            <li className="flex items-center gap-2"><Mail size={15} className="text-brand-400" /> k47471508@gmail.com</li>
            <li className="flex items-center gap-2"><Phone size={15} className="text-brand-400" /> +91 9229570967</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-ink-400">© {new Date().getFullYear()} ApplyMitra. All rights reserved.</p>
        <p className="text-xs text-ink-400 flex items-center gap-1.5"><ShieldCheck size={14} className="text-success-500" /> We are independent platform not affiliated with any government agency.</p>
      </div>
    </footer>
  );
}
