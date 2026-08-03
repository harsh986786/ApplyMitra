'use client';

import Image from 'next/image';
import { MousePointerClick, FileText, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

const steps = [
  {
    icon: MousePointerClick,
    title: 'Pick your service',
    desc: 'Choose from 500+ form categories — exams, jobs, schemes, certificates and more. Fees shown by category.',
    img: 'https://images.pexels.com/photos/6863338/pexels-photo-6863338.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    color: 'from-brand-500 to-brand-700',
  },
  {
    icon: FileText,
    title: 'Fill basic details',
    desc: 'Enter your name, address, email and phone. Pick your category and the fee updates instantly.',
    img: 'https://images.pexels.com/photos/7979436/pexels-photo-7979436.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    color: 'from-accent-400 to-accent-600',
  },
  {
    icon: MessageSquare,
    title: 'We connect on WhatsApp',
    desc: 'Our team messages you, collects documents and payment — all on WhatsApp. No office visits.',
    img: 'https://images.pexels.com/photos/8867208/pexels-photo-8867208.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    color: 'from-success-500 to-success-600',
  },
  {
    icon: CheckCircle2,
    title: 'We submit your form',
    desc: 'Our expert fills and submits the form. You get the confirmation and receipt.',
    img: 'https://images.pexels.com/photos/8441787/pexels-photo-8441787.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    color: 'from-brand-400 to-brand-600',
  },
];

export function HowItWorks() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <section id="how" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">The Process</span>
          <h2 className="mt-2 font-extrabold text-3xl sm:text-4xl text-white">How ApplyMitra works</h2>
          <p className="mt-3 text-ink-300 max-w-2xl mx-auto">Four simple steps from picking a service to getting your form submitted.</p>
        </div>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className={`reveal ${shown ? 'in' : ''} group relative card-3d glass rounded-2xl overflow-hidden`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                <div className={`absolute -bottom-4 -left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white font-bold flex items-center justify-center shadow-lg z-10`}>
                  {i + 1}
                </div>
              </div>
              <div className="p-5">
                <s.icon className="text-brand-300 group-hover:text-accent-400 transition" size={26} />
                <h3 className="mt-3 font-bold text-lg text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-300 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustMarquee() {
  const items = ['Govt Schemes', 'UPSC', 'SSC', 'Railway Recruitment', 'Aadhaar', 'PAN Card', 'Voter ID', 'Passport', 'Driving License', 'Birth Certificate', 'Income Certificate', 'Caste Certificate', 'Pension', 'Scholarships', 'Board Exams'];
  const loop = [...items, ...items];
  return (
    <div className="relative py-6 border-y border-white/10 bg-ink-950/40 overflow-hidden">
      <div className="marquee-track gap-8">
        {loop.map((t, i) => (
          <span key={i} className="text-ink-400 font-semibold text-sm whitespace-nowrap flex items-center gap-2">
            <span className="text-brand-500">◆</span> {t}
          </span>
        ))}
      </div>
    </div>
  );
}
