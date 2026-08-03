'use client';

import { useEffect, useState } from 'react';
import { Menu, X, ShieldCheck, UserCog, Phone } from 'lucide-react';
import { LogoLockup } from './Logo3D';

interface NavbarProps {
  onApply: () => void;
}

const links = [
  { label: 'Services', href: '#services' },
  { label: 'How it Works', href: '#how' },
  { label: 'About', href: '#about' },
  { label: 'Join Team', href: '#join' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar({ onApply }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-ink-950/80 backdrop-blur-xl border-b border-white/10 py-2' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <a href="#top" className="shrink-0"><LogoLockup size={scrolled ? 36 : 44} /></a>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="px-4 py-2 text-sm font-medium text-ink-200 hover:text-white rounded-lg hover:bg-white/5 transition">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <a href="/login" className="flex items-center gap-1.5 px-3 py-2 text-sm text-ink-200 hover:text-white rounded-lg hover:bg-white/5 transition">
            <UserCog size={16} /> Staff
          </a>
          <a href="/login" className="flex items-center gap-1.5 px-3 py-2 text-sm text-ink-200 hover:text-white rounded-lg hover:bg-white/5 transition">
            <ShieldCheck size={16} /> Admin
          </a>
          <button
            onClick={onApply}
            className="ml-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white text-sm font-semibold shadow-lg shadow-brand-700/30 hover:scale-[1.03] transition"
          >
            Apply Now
          </button>
        </div>

        <button className="lg:hidden text-white p-2" onClick={() => setOpen((o) => !o)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden mx-4 mt-2 glass rounded-2xl p-4 flex flex-col gap-1">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-ink-100 hover:bg-white/10">
              {l.label}
            </a>
          ))}
          <div className="h-px bg-white/10 my-1" />
          <a href="/login" className="px-3 py-2.5 rounded-lg text-ink-100 hover:bg-white/10 flex items-center gap-2"><ShieldCheck size={16}/> Admin / Staff Login</a>
          <a href="tel:+910000000000" className="px-3 py-2.5 rounded-lg text-ink-100 hover:bg-white/10 flex items-center gap-2"><Phone size={16}/> Call us</a>
          <button onClick={() => { setOpen(false); onApply(); }} className="mt-2 px-4 py-3 rounded-xl bg-brand-600 text-white font-semibold">
            Apply Now
          </button>
        </div>
      )}
    </header>
  );
}
