import React, { useEffect, useState } from 'react';
import { Loader2, Search, ArrowRight, ExternalLink, ShieldCheck, Zap, Lock, Headphones } from 'lucide-react';
import { api } from '@/lib/api';
import type { Service } from '@/types';

interface ServicesGridProps {
  onApply: (service: Service) => void;
}

export function ServicesGrid({ onApply }: ServicesGridProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.getServices()
      .then((s) => setServices(s))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter services by search query
  const filteredServices = services.filter((service: any) => {
    const title = service.name || service.title || '';
    const desc = service.description || '';
    return title.toLowerCase().includes(query.toLowerCase()) || 
           desc.toLowerCase().includes(query.toLowerCase());
  });

  // Fixed categories like SarkariResult columns
  const categories = [
    { title: 'Latest Forms / Jobs', key: 'Job', color: 'border-blue-500 text-blue-400 bg-blue-950/40' },
    { title: 'Exam Forms', key: 'Exam', color: 'border-emerald-500 text-emerald-400 bg-emerald-950/40' },
    { title: 'General / Other Services', key: 'General', color: 'border-purple-500 text-purple-400 bg-purple-950/40' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <section id="services" className="py-12 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Available Services & Forms</h2>
            <p className="text-slate-400 text-sm mt-1">Select any form to apply directly with our guidance</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search forms, exams, certificates..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* SarkariResult-Style Multi-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            // Get items belonging to this category
           // Line 73-76 ko isse replace karein:
const items = filteredServices.filter((s: any) => {
  const itemCat = (s.category || 'General').toLowerCase();
  const targetKey = cat.key.toLowerCase();
  const targetTitle = cat.title.toLowerCase();

  return (
    itemCat === targetKey ||
    itemCat === targetTitle ||
    itemCat.includes(targetKey) ||
    targetKey.includes(itemCat) ||
    (targetKey.includes('job') && itemCat.includes('job')) ||
    (targetKey.includes('exam') && itemCat.includes('exam')) ||
    (targetKey.includes('cert') && (itemCat.includes('cert') || itemCat.includes('card')))
  );
});

            return (
              <div 
                key={cat.key} 
                className="bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col overflow-hidden shadow-lg hover:border-slate-700 transition-all"
              >
                {/* Column Header */}
                <div className={`px-4 py-3 border-b border-slate-800 font-bold text-center text-sm uppercase tracking-wide ${cat.color}`}>
                  {cat.title}
                </div>


                {/* Column Links List */}
                <div className="flex-1 divide-y divide-slate-800/60 overflow-y-auto max-h-[480px] custom-scrollbar">
                  {items.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No forms available in this section.
                    </div>
                  ) : (
                    items.map((service: any) => {
                      const serviceId = service._id || service.id;
                      const serviceName = service.name || service.title || 'Form';

                      return (
                        <div
                          key={serviceId}
                          onClick={() => onApply(service)}
                          className="p-3.5 hover:bg-slate-800/60 cursor-pointer transition-colors group flex items-start justify-between gap-2"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-400 text-xs font-bold mt-0.5">•</span>
                            <span className="text-xs font-medium text-slate-300 group-hover:text-emerald-400 transition-colors leading-relaxed">
                              {serviceName}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Column Footer Badge */}
                <div className="p-2.5 bg-slate-950/60 border-t border-slate-800/80 text-center text-[11px] text-slate-500 font-medium">
                  {items.length} {items.length === 1 ? 'Option Available' : 'Options Available'}
                </div>
              </div>
            );
          })}
        </div>
        {/* Is Grid Block ke khatam hone ke baad paste karein */}

        {/* 🌟 YAHAN PASTE KAREIN (Trust Badge Strip) 🌟 */}
        <div className="mt-6 bg-slate-900/50 rounded-xl border border-slate-800/80 p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-blue-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Trusted by 1,000+</h4>
                <p className="text-[11px] text-slate-400">applicants</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-blue-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Fast & easy</h4>
                <p className="text-[11px] text-slate-400">process</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-blue-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">100% secure</h4>
                <p className="text-[11px] text-slate-400">payments</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-blue-400 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Expert guidance</h4>
                <p className="text-[11px] text-slate-400">at every step</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}