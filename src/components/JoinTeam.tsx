'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Users2, ShieldCheck, IndianRupee, CheckCircle2, Loader2, FileSignature } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { useReveal } from '@/lib/useReveal';

const TERMS = [
  'A one-time fee of ₹500 is payable to join the ApplyMitra team.',
  'You must hold any certificate of form-filling or data entry experience to be eligible.',
  'You must be at least 18 years old to apply.',
  'You must pass our verification process, including document checks and a brief interview on WhatsApp.',
  'The ₹500 fee is strictly non-refundable under any circumstances.',
  'You must provide accurate personal details and contact information.',
  'You agree to be contacted by our team on WhatsApp for further onboarding.',
  'Payment must be made on WhatsApp as instructed by the ApplyMitra team.',
  'Your application will be reviewed and verified by the admin team.',
  'Approval into the team is at the sole discretion of ApplyMitra.',
  'You must keep all applicant information confidential and secure.',
];

export function JoinTeam() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const toast = useToast();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', city: '', experience: '' });
  const [accepted, setAccepted] = useState(false);
  const [feePaid, setFeePaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) return toast({ type: 'error', message: 'Please accept the terms and conditions.' });
    if (!feePaid) return toast({ type: 'error', message: 'Please confirm that the ₹500 fee has been paid on WhatsApp.' });
    setSubmitting(true);
    try {
      await api.submitTeam({ ...form, acceptedTerms: accepted, feePaid });
      toast({ type: 'success', message: 'Application received! Our team will verify your payment and reach out on WhatsApp.' });
      setForm({ fullName: '', email: '', phone: '', city: '', experience: '' });
      setAccepted(false);
      setFeePaid(false);
    } catch (err: any) {
      toast({ type: 'error', message: err.message || 'Something went wrong' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="join" className="relative py-24 px-6">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''} max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-start`}>
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">Join Our Team</span>
          <h2 className="mt-2 font-extrabold text-3xl sm:text-4xl text-white">Become an ApplyMitra partner</h2>
          <p className="mt-4 text-ink-300 leading-relaxed">
            Want to help people fill forms and earn while doing it? Join our team and get assigned real applications.
            One-time onboarding fee applies.
          </p>

          <div className="mt-6 relative card-3d glass rounded-2xl p-6 overflow-hidden">
            <div className="relative h-40 rounded-xl overflow-hidden mb-4">
              <Image
                src="https://images.pexels.com/photos/7710139/pexels-photo-7710139.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Join our team"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 to-transparent" />
            </div>
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-accent-500/20 blur-2xl" />
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-xs text-ink-300 uppercase tracking-wider">One-time onboarding fee</p>
                <p className="mt-1 font-extrabold text-4xl text-white flex items-center"><IndianRupee size={28} />500</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-xl animate-floaty">
                <Users2 className="text-white" size={30} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-danger-500 bg-danger-500/10 border border-danger-500/30 rounded-lg px-3 py-2">
              <ShieldCheck size={16} /> Non-refundable. Please read terms carefully before paying.
            </div>
          </div>

          <div className="mt-6 glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileSignature className="text-brand-300" size={20} />
              <h3 className="font-bold text-white">Terms &amp; Conditions</h3>
            </div>
            <ul className="space-y-2.5">
              {TERMS.map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-ink-200">
                  <CheckCircle2 className="text-brand-400 shrink-0 mt-0.5" size={15} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form onSubmit={submit} className="glass rounded-2xl p-6 sm:p-8 sticky top-24">
          <h3 className="font-bold text-xl text-white">Team application form</h3>
          <p className="text-sm text-ink-300 mt-1">Fill in your details below. Our team will contact you on WhatsApp.</p>

          <div className="mt-5 space-y-4">
            <Field label="Full name *">
              <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="form-input" placeholder="Your full name" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email *">
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="you@email.com" />
              </Field>
              <Field label="Phone *">
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-input" placeholder="10-digit mobile" />
              </Field>
            </div>
            <Field label="City *">
              <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="form-input" placeholder="Your city" />
            </Field>
            <Field label="Experience (optional)">
              <textarea value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} rows={3} className="form-input resize-none" placeholder="Any prior form-filling or data entry experience?" />
            </Field>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 w-4 h-4 accent-brand-500" />
              <span className="text-sm text-ink-200">I have read and accept all the terms &amp; conditions, including the ₹500 non-refundable fee.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={feePaid} onChange={(e) => setFeePaid(e.target.checked)} className="mt-1 w-4 h-4 accent-brand-500" />
              <span className="text-sm text-ink-200">I confirm I have paid the ₹500 fee on WhatsApp as instructed.</span>
            </label>

            <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-400 to-accent-600 text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.01] transition disabled:opacity-60">
              {submitting ? <><Loader2 className="animate-spin" size={18} /> Submitting...</> : <><Users2 size={18} /> Submit application</>}
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
