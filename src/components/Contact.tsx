'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { useToast } from '@/lib/toast';
import { useReveal } from '@/lib/useReveal';

export function Contact() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const adminPhoneNumber = '919229570967';
    const text = `Hello, I am ${form.name}. ${form.message} (Email: ${form.email})`;
    const url = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setTimeout(() => {
      setSending(false);
      toast({ type: 'success', message: 'Thanks! We will reach out to you shortly on WhatsApp.' });
      setForm({ name: '', email: '', message: '' });
    }, 800);
  };

  return (
    <section id="contact" className="relative py-24 px-6 bg-ink-950/30">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''} max-w-7xl mx-auto grid lg:grid-cols-2 gap-10`}>
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Get in touch</span>
          <h2 className="mt-2 font-extrabold text-3xl sm:text-4xl text-white">Have a question? Talk to us</h2>
          <p className="mt-3 text-ink-300">Our team is ready to help you with any form across India. Reach us through any of these channels.</p>

          <div className="mt-8 space-y-4">
            {[
              { icon: Phone, label: 'Call / WhatsApp', value: '+91 9263094661', href: `<tel:+919229570967></tel:+919229570967>` },
              { icon: Mail, label: 'Email', value: 'k47471508@gmail.com', href: 'mailto:k47471508@gmail.com' },
              { icon: Clock, label: 'Hours', value: 'Mon – Sun, 9:00 AM – 9:00 PM' },
            ].map((c) => (
              <a key={c.label} href={c.href || '#'} className="flex items-center gap-4 glass rounded-xl p-4 hover:bg-white/10 transition">
                <div className="w-11 h-11 rounded-xl bg-brand-600/20 text-brand-300 flex items-center justify-center"><c.icon size={20} /></div>
                <div>
                  <p className="text-xs text-ink-400 uppercase tracking-wider">{c.label}</p>
                  <p className="text-white font-semibold">{c.value}</p>
                </div>
              </a>
            ))}
          </div>

          <a href="https://wa.me/919229570967" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-success-600 text-white font-semibold hover:scale-[1.02] transition">
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
        </div>

        <form onSubmit={submit} className="glass rounded-2xl p-6 sm:p-8">
          <h3 className="font-bold text-xl text-white">Send us a message</h3>
          <p className="text-sm text-ink-300 mt-1">We usually reply within a few hours.</p>
          <div className="mt-5 space-y-4">
            <Field label="Your name">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" placeholder="Full name" />
            </Field>
            <Field label="Email or phone">
              <input required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="you@email.com" />
            </Field>
            <Field label="Message">
              <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="form-input resize-none" placeholder="Which form do you need help with?" />
            </Field>
            <button type="submit" disabled={sending} className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.01] transition disabled:opacity-60">
              <Send size={16} /> {sending ? 'Sending...' : 'Send message'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-300 uppercase tracking-wider">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
