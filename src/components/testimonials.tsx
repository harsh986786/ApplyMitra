'use client'

import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Priya Sharma', role: 'Student, Jaipur', content: 'NEET counselling was confusing. ApplyMitra filled everything correctly.' },
  { name: 'Rajesh Kumar', role: 'Job Aspirant, Patna', content: 'Got my SSC CGL form filled within 2 days. ₹100 fee is nothing compared to peace of mind.' },
  { name: 'Sneha Reddy', role: 'Parent, Hyderabad', content: 'Applied for my son\'s JEE Main. The documents panel showed exactly what was missing.' },
  { name: 'Amit Singh', role: 'Govt Job Aspirant, Lucknow', content: 'UPSSSC form was closing in 2 days. ApplyMitra handled it same day.' },
  { name: 'Fatima Khan', role: 'College Student, Delhi', content: 'Delhi University admission was complicated. The expert knew exactly what to upload.' },
  { name: 'Vikram Patel', role: 'Working Professional, Ahmedabad', content: 'Don\'t have time for government forms. Pay ₹100, send documents, and they handle everything!' }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Loved by Applicants Across India</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-glow transition-all"
            >
              <Quote className="absolute top-4 right-4 h-10 w-10 text-primary/10 group-hover:text-primary/20 transition-colors" />
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">{t.content}</p>
              <div className="flex items-center gap-3 pt-3 border-t border-border/30">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600 text-white font-semibold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}