'use client';

import Image from 'next/image';
import { Target, Eye, Users2, Award, HeartHandshake, ShieldCheck } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

export function About() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <section id="about" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className={`reveal ${shown ? 'in' : ''}`}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">About ApplyMitra</span>
          <h2 className="mt-2 font-extrabold text-3xl sm:text-4xl text-white">Your trusted form-filling partner</h2>
          <p className="mt-5 text-ink-300 leading-relaxed">
            ApplyMitra is an online forms cafe where a trained team fills every kind of form for applicants across India.
            From government schemes and exam registrations to job applications, certificates and pensions — we handle it all.
          </p>
          <p className="mt-4 text-ink-300 leading-relaxed">
            We remove the confusion, queues and paperwork. You share your documents on WhatsApp, our expert fills and submits
            the form, and you receive the confirmation. Simple, transparent and affordable — with category-wise fees that
            are fair for everyone.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { icon: Target, title: 'Our mission', text: 'To make goverment,exam,job and college fprms simple and accessible for everyone.' },
              { icon: Eye, title: 'Our vision', text: 'A future where no one misses an opportunity because of  complicated paperwork.' },
              { icon: Users2, title: 'Expert team', text: 'Trained professionals who knows every form inside out and guide you at every step.' },
              { icon: ShieldCheck, title: 'Trusted service', text: 'Verified payments and transparent category-wise fees for complete peace of mind.' },
            ].map((v) => (
              <div key={v.title} className="glass rounded-xl p-4">
                <v.icon className="text-brand-300" size={24} />
                <h4 className="mt-2 font-semibold text-white text-sm">{v.title}</h4>
                <p className="text-xs text-ink-300 mt-1 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div ref={ref} className="relative">
          <div className="relative card-3d glass rounded-3xl p-3 overflow-hidden">
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/18067562/pexels-photo-18067562.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="ApplyMitra team collaborating"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute top-1/2 right-6 -translate-y-1/2 w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-2xl animate-floaty z-10">
              <HeartHandshake className="text-white" size={40} />
            </div>
            <h3 className="font-bold text-xl text-white mt-4 px-3 pb-3">Why choose ApplyMitra?</h3>
            <ul className="px-3 pb-4 space-y-2.5">
              {[
                'All India government, exam, job & certificate forms in one place',
                'Experts handle every form — zero confusion for you',
                'Documents & payment collected on WhatsApp — no office visits',
                'Category-wise fees — fair pricing for General,OBC, SC, ST , EWS,PH & Women',
                'Payment verified by admin before submission',
                'Dedicated staff assigned to your application',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-ink-200">
                  <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-success-500/20 text-success-500 flex items-center justify-center text-xs">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
