'use client';

import { useEffect, useState } from 'react';
import { X, FileText, CheckCircle2, IndianRupee, Loader2, ArrowRight, ArrowLeft, MessageSquare, User, MapPin, Mail, Phone, Tag } from 'lucide-react';
import type { Service, CasteCategory, CategoryFee } from '@/types';
import { CASTE_CATEGORIES } from '@/types';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast';

interface ApplyModalProps {
  service: Service | null;
  onClose: () => void;
}

export function ApplyModal({ service, onClose }: ApplyModalProps) {
  const [step, setStep] = useState(1);
  const [caste, setCaste] = useState<CasteCategory>('General');
  const [form, setForm] = useState({ applicantName: '', address: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setStep(1);
    setDone(false);
    setCaste('General');
    setForm({ applicantName: '', address: '', email: '', phone: '', notes: '' });
  }, [service]);

  if (!service && !done) return null;

  const feeRow: CategoryFee | undefined = service?.fees?.find((f) => f.category === caste) || service?.fees?.[0];
  const gov = feeRow?.governmentFee ?? 0;
  const conv = feeRow?.convenienceFee ?? 100;
  const total = gov + conv;

  const validStep1 = form.applicantName.trim() && form.address.trim() && form.email.trim() && form.phone.trim();

  const submit = async () => {
    if (!service) return;
    setSubmitting(true);
    try {
      await api.submitApplication({ ...form, serviceId: service._id, casteCategory: caste });
      setDone(true);
      toast({ type: 'success', message: 'Application submitted! Our team will connect with you on WhatsApp.' });
    } catch (err: any) {
      toast({ type: 'error', message: err.message || 'Could not submit application' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto glass rounded-3xl p-6 sm:p-8 animate-riseUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-ink-300 hover:text-white p-2 rounded-lg hover:bg-white/10">
          <X size={20} />
        </button>

        {done ? (
          <SuccessView service={service} total={total} onClose={onClose} />
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex-1">
                  <div className={`h-1.5 rounded-full transition ${n <= step ? 'bg-brand-500' : 'bg-white/10'}`} />
                  <span className={`text-[10px] mt-1 block ${n === step ? 'text-brand-300' : 'text-ink-400'}`}>
                    {n === 1 ? 'Your details' : n === 2 ? 'Review' : 'Submit'}
                  </span>
                </div>
              ))}
            </div>

            {service && (
              <div className="glass rounded-xl p-3 mb-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center"><FileText className="text-white" size={18} /></div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{service.name}</p>
                  <p className="text-xs text-ink-400">{service.category}</p>
                </div>
              </div>
            )}

            {step === 1 && service && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-white">Enter your details</h3>
                <p className="text-sm text-ink-300">Select your category to see the correct fee. Our team will contact you on WhatsApp.</p>

                {/* category selector */}
                <div>
                  <span className="text-xs font-medium text-ink-300 uppercase tracking-wider">Category / Caste *</span>
                  <div className="mt-1.5 grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {CASTE_CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCaste(c)}
                        className={`px-2 py-2 rounded-lg text-xs font-semibold transition ${caste === c ? 'bg-brand-600 text-white' : 'glass text-ink-200 hover:text-white'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <IconField icon={User} label="Full name *">
                  <input value={form.applicantName} onChange={(e) => setForm({ ...form, applicantName: e.target.value })} className="form-input" placeholder="Your full name" />
                </IconField>
                <IconField icon={MapPin} label="Address *">
                  <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className="form-input resize-none" placeholder="Full address" />
                </IconField>
                <div className="grid sm:grid-cols-2 gap-4">
                  <IconField icon={Mail} label="Email *">
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="you@email.com" />
                  </IconField>
                  <IconField icon={Phone} label="Phone *">
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-input" placeholder="10-digit mobile" />
                  </IconField>
                </div>
                <IconField icon={FileText} label="Notes (optional)">
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="form-input resize-none" placeholder="Anything we should know" />
                </IconField>

                <button
                  disabled={!validStep1}
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] transition"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            )}

            {step === 2 && service && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-white">Review your application</h3>
                <div className="glass rounded-xl p-4 text-sm space-y-2">
                  <p className="text-white font-semibold">{service.name}</p>
                  <p className="text-ink-300">{service.description || 'Expert form filling assistance.'}</p>
                  <div className="h-px bg-white/10 my-2" />
                  <Row label="Eligibility" value={service.eligibility || 'As per form guidelines'} />
                  <Row label="Documents needed" value={service.documentsRequired || 'ID proof, photo & certificates'} />
                  <Row label="Selected category" value={<span className="pill bg-brand-500/15 text-brand-300"><Tag size={10} /> {caste}</span>} />
                </div>
                <div className="glass rounded-xl p-4 text-sm space-y-1.5">
                  <p className="text-white font-semibold mb-1">Your details</p>
                  <Row label="Name" value={form.applicantName} />
                  <Row label="Address" value={form.address} />
                  <Row label="Email" value={form.email} />
                  <Row label="Phone" value={form.phone} />
                </div>
                <FeeBreakdown caste={caste} gov={gov} conv={conv} />
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-4 py-3 rounded-xl glass text-white font-semibold flex items-center gap-2 hover:bg-white/10">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    disabled={!validStep1}
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 rounded-xl bg-brand-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] transition"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && service && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-white">Confirm &amp; submit</h3>
                <FeeBreakdown caste={caste} gov={gov} conv={conv} />

                <div className="glass rounded-xl p-4 text-sm text-ink-200 flex items-start gap-3">
                  <MessageSquare className="text-success-500 shrink-0 mt-0.5" size={18} />
                  <span>After submitting, our team will message you on <b className="text-white">WhatsApp</b> to collect your documents and payment. The form will be filled and submitted by our expert once payment is verified.</span>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-4 py-3 rounded-xl glass text-white font-semibold flex items-center gap-2 hover:bg-white/10">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    disabled={submitting}
                    onClick={submit}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-success-500 to-success-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 hover:scale-[1.01] transition"
                  >
                    {submitting ? <><Loader2 className="animate-spin" size={18} /> Submitting...</> : <><CheckCircle2 size={18} /> Submit application</>}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FeeBreakdown({ caste, gov, conv }: { caste: CasteCategory; gov: number; conv: number }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs uppercase tracking-wider text-ink-400">Fee breakdown</p>
        <span className="pill bg-brand-500/15 text-brand-300 text-[10px]"><Tag size={10} /> {caste}</span>
      </div>
      <div className="flex justify-between text-sm py-1"><span className="text-ink-300">Government fee</span><span className="text-white font-semibold">₹{gov}</span></div>
      <div className="flex justify-between text-sm py-1"><span className="text-ink-300">ApplyMitra convenience fee</span><span className="text-accent-400 font-semibold">₹{conv}</span></div>
      <div className="h-px bg-white/10 my-2" />
      <div className="flex justify-between"><span className="text-white font-bold">Total payable</span><span className="text-white font-extrabold text-lg flex items-center"><IndianRupee size={16} />{gov + conv}</span></div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink-400 shrink-0">{label}</span>
      <span className="text-white text-right">{value}</span>
    </div>
  );
}

function IconField({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-300 uppercase tracking-wider">{label}</span>
      <div className="mt-1.5 relative">
        <Icon className="absolute left-3 top-3.5 text-ink-400" size={16} />
        <div className="[&_*]:!pl-9">{children}</div>
      </div>
    </label>
  );
}

function SuccessView({ service, total, onClose }: { service: Service | null; total: number; onClose: () => void }) {
  return (
    <div className="text-center py-4">
      <div className="mx-auto w-20 h-20 rounded-full bg-success-500/20 flex items-center justify-center animate-floaty">
        <CheckCircle2 className="text-success-500" size={44} />
      </div>
      <h3 className="mt-5 font-extrabold text-2xl text-white">Application submitted!</h3>
      <p className="mt-2 text-ink-300 text-sm max-w-sm mx-auto">
        Thank you. Our team will connect with you on <b className="text-white">WhatsApp</b> shortly to collect your documents and payment of <b className="text-accent-400">₹{total}</b> for {service?.name}.
      </p>
      <div className="mt-5 glass rounded-xl p-4 text-left text-sm space-y-1.5">
        <p className="text-white font-semibold">What happens next?</p>
        <p className="text-ink-300">1. Our team messages you on WhatsApp</p>
        <p className="text-ink-300">2. You share the required documents</p>
        <p className="text-ink-300">3. You make the payment on WhatsApp</p>
        <p className="text-ink-300">4. We fill and submit your form</p>
      </div>
      <button onClick={onClose} className="mt-6 w-full py-3 rounded-xl bg-brand-600 text-white font-semibold hover:scale-[1.01] transition">
        Done
      </button>
    </div>
  );
}
