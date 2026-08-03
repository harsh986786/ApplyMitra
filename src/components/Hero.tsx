'use client';

import { useEffect, useRef } from 'react';
import { Sparkles, ShieldCheck, Zap, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Logo3D } from './Logo3D';

interface HeroProps {
  onApply: () => void;
}

export function Hero({ onApply }: HeroProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = sceneRef.current;
      if (!el) return;
      const dots = el.querySelectorAll<HTMLDivElement>('.dot');
      dots.forEach((d, i) => {
        const depth = (i % 3) * 12 + 8;
        d.style.transform = `translate(${(e.clientX - window.innerWidth / 2) / depth}px, ${(e.clientY - window.innerHeight / 2) / depth}px)`;
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <section id="top" className="relative min-h-screen flex items-center mesh-bg overflow-hidden pt-28 pb-16">
      <div ref={sceneRef} className="absolute inset-0 pointer-events-none">
        <span className="dot" style={{ width: 14, height: 14, top: '18%', left: '12%' }} />
        <span className="dot" style={{ width: 8, height: 8, top: '30%', left: '80%', animationDelay: '1s' }} />
        <span className="dot" style={{ width: 18, height: 18, top: '70%', left: '20%', animationDelay: '2s' }} />
        <span className="dot" style={{ width: 10, height: 10, top: '60%', left: '88%', animationDelay: '0.5s' }} />
        <span className="dot" style={{ width: 6, height: 6, top: '45%', left: '50%', animationDelay: '1.5s' }} />
      </div>

      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
        <div className="animate-riseUp">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-brand-200 mb-6">
            <Sparkles size={14} className="text-accent-400" /> 
Trusted by 1,000+ applicants across India
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] text-white">
            Get Any Government, Exam <span className="text-gradient">or College Form Filled Accurately by</span><br />
             Experts from Home!
          </h1>
          <p className="mt-6 text-lg text-ink-300 max-w-xl leading-relaxed">
            Government schemes, exams, jobs, certificates, pensions — our experts handle the paperwork end to end.
            You just share documents on WhatsApp. We do the rest.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onApply}
              className="group px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-semibold shadow-xl shadow-brand-700/40 hover:scale-[1.03] transition flex items-center gap-2"
            >
              Start your application <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </button>
            <a href="#services" className="px-7 py-3.5 rounded-xl glass text-white font-semibold hover:bg-white/10 transition">
              Browse services
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              { icon: ShieldCheck, label: 'Expert verified' },
              { icon: Zap, label: 'Fast turnaround' },
              { icon: FileText, label: '500+ form types' },
            ].map((f) => (
              <div key={f.label} className="glass rounded-xl p-3 text-center">
                <f.icon className="mx-auto text-brand-300" size={22} />
                <p className="mt-1.5 text-[11px] text-ink-200 font-medium leading-tight">{f.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center min-h-[420px] scene">
          <div className="absolute w-72 h-72 rounded-full bg-brand-600/20 blur-3xl animate-pulseRing" />
          <div className="absolute w-96 h-96 rounded-full border border-brand-400/20 animate-spin3d" style={{ animationDuration: '40s' }} />

          <div className="relative z-10 animate-floaty">
            <Logo3D size={180} />
          </div>

          <div className="absolute inset-0 animate-spin3d" style={{ animationDuration: '30s' }}>
            <OrbitCard icon="📄" title="Exam forms" className="top-4 left-6" delay="0s" />
            <OrbitCard icon="🏛️" title="Govt schemes" className="top-10 right-2" delay="0.4s" />
            <OrbitCard icon="🎓" title="Certificates" className="bottom-8 left-10" delay="0.8s" />
            <OrbitCard icon="💼" title="Job forms" className="bottom-4 right-6" delay="1.2s" />
            <OrbitCard icon="🧾" title="Approval Rate 99.2%" className="top-20 right-20" delay="1.6s" />
          </div>

          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 glass rounded-2xl px-5 py-3 flex items-center gap-3 animate-floaty" style={{ animationDelay: '1s' }}>
            <CheckCircle2 className="text-success-500" size={20} />
            <span className="text-sm text-white font-medium">Convenience fee only <span className="text-accent-400 font-bold">₹100</span> per form</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrbitCard({ icon, title, className, delay }: { icon: string; title: string; className: string; delay: string }) {
  return (
    <div
      className={`absolute glass rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg ${className}`}
      style={{ animation: `floaty 5s ease-in-out infinite`, animationDelay: delay }}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-semibold text-white whitespace-nowrap">{title}</span>
    </div>
  );
}
