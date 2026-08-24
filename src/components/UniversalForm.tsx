'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, FileText, User, Phone, Mail, Sparkles } from 'lucide-react';

export default function UniversalForm() {
  const [formData, setFormData] = useState({
    applicantName: '',
    phone: '',
    email: '',
    serviceName: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        applicantName: formData.applicantName,
        phone: formData.phone,
        email: formData.email,
        serviceName: formData.serviceName,
        notes: formData.notes,
      };

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to submit request. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden bg-slate-950 text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-xl mx-auto">
        <div className="text-center mb-8 space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 backdrop-blur-md">
            <Sparkles size={14} className="text-blue-400" /> Universal Service Desk
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Request Any Online Service
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Submit your application details below. Our team will verify requirements and guide you through the process.
          </p>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Only a 100 INR convenience fee is charged for processing your request. Government fees, if applicable, will be communicated separately.
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 sm:p-10 rounded-3xl shadow-2xl shadow-blue-950/40">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-bold text-white">Request Submitted!</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                We have received your application request. Our representative will contact you shortly via WhatsApp / Phone.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ applicantName: '', phone: '', email: '', serviceName: '', notes: '' });
                }}
                className="mt-4 px-6 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-blue-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Phone / WhatsApp Number <span className="text-blue-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                  <input
                    type="tel"
                    required
                    placeholder="+91 xxxxx xxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address <span className="text-blue-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Service / Form Required <span className="text-blue-400">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. SSC CGL 2026, Income Certificate, etc."
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention category, deadline, or specific instructions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3.5 text-sm bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Submit Request'} <Send size={16} />
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" /> End-to-End Assistance
            </span>
            <span>Fast Turnaround</span>
          </div>
        </div>
      </div>
    </section>
  );
}