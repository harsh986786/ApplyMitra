'use client';

import { useEffect, useState } from 'react';
import { FileText, CheckCircle2, IndianRupee, Loader2, Search, Tag } from 'lucide-react';
import { api } from '@/lib/api';
import type { Service, CategoryFee } from '@/types';

interface ServicesGridProps {
  onApply: (service: Service) => void;
}

export function ServicesGrid({ onApply }: ServicesGridProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');

  useEffect(() => {
    api.getServices()
      .then((s) => setServices(s))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];
  const filtered = services.filter((s) => {
    const matchCat = activeCat === 'All' || s.category?.toLowerCase() === activeCat.toLowerCase();
    const matchQuery = !query || s.name?.toLowerCase().includes(query.toLowerCase()) || s.description?.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  const minFee = (fees: CategoryFee[]) => {
    if (!fees || fees.length === 0) return 0;
    return Math.min(...fees.map((f) => f.governmentFee + f.convenienceFee));
  };

  return (
    <section id="services" className="relative py-24 px-6 bg-ink-950/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Our Services</span>
          <h2 className="mt-2 font-extrabold text-3xl sm:text-4xl text-white">Forms we fill for you</h2>
          <p className="mt-3 text-ink-300 max-w-2xl mx-auto">Browse by category. Every service shows eligibility, documents needed and fees for each caste/category — General, OBC, SC, ST &amp; EWS, PH</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-8">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-ink-400 focus:outline-none focus:border-brand-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  activeCat === c ? 'bg-brand-600 text-white' : 'glass text-ink-200 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-ink-300">
            <Loader2 className="animate-spin mr-2" /> Loading services...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="mx-auto text-ink-400 mb-3" size={40} />
            <p className="text-ink-300">No services found. The admin can add services from the dashboard.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s, i) => (
              <div
                key={s._id ? s._id.toString() : `service-${i}`}
                className="group card-3d glass rounded-2xl p-6 flex flex-col"
                style={{ transitionDelay: `${(i % 6) * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg group-hover:rotate-6 transition">
                    <FileText className="text-white" size={22} />
                  </div>
                  <span className="pill bg-brand-500/15 text-brand-300 border border-brand-400/30">
                    <Tag size={12} /> {s.category}
                  </span>
                </div>

                <h3 className="mt-4 font-bold text-lg text-white">{s.name}</h3>
                <p className="mt-2 text-sm text-ink-300 leading-relaxed line-clamp-3">{s.description || 'Expert form filling assistance.'}</p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-ink-200">
                    <CheckCircle2 className="text-success-500 shrink-0 mt-0.5" size={14} />
                    <span><b className="text-white">Eligibility:</b> {s.eligibility || 'As per form guidelines'}</span>
                  </div>
                  <div className="flex items-start gap-2 text-ink-200">
                    <FileText className="text-brand-400 shrink-0 mt-0.5" size={14} />
                    <span><b className="text-white">Documents:</b> {s.documentsRequired || 'ID proof, photo & relevant certificates'}</span>
                  </div>
                </div>

                {/* category-wise fees */}
                <div className="mt-4 glass rounded-xl p-3 text-xs">
                  <p className="text-ink-400 uppercase tracking-wider mb-2 text-[10px]">Fees by category</p>
                  <div className="space-y-1">
                    {(s.fees || []).map((f) => (
                      <div key={f.category} className="flex justify-between">
                        <span className="text-ink-300">{f.category}</span>
                        <span className="text-white font-semibold flex items-center"><IndianRupee size={11} />{f.governmentFee + f.convenienceFee}</span>
                      </div>
                    ))}
                    {!s.fees?.length && <div className="text-ink-400">Contact for pricing</div>}
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between"><span className="text-ink-400">Starts from</span><span className="text-accent-400 font-bold flex items-center"><IndianRupee size={12} />{minFee(s.fees)}</span></div>
                </div>

                <button
                  onClick={() => onApply(s)}
                  className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white text-sm font-semibold hover:scale-[1.02] transition"
                >
                  Apply for this service
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
