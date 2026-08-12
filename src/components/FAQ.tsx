import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How does ApplyMitra fill forms on my behalf?",
    answer: "You select the service/form you need and share required details/documents over WhatsApp. Our trained form-filling experts accurately complete and submit your application on official portals."
  },
  {
    question: "Are my personal documents safe with ApplyMitra?",
    answer: "Yes, 100%. We strictly maintain user data privacy. Your documents are used solely for your form application process and are not shared with any third party."
  },
  {
    question: "What are the fees charged for form filling?",
    answer: "Our convenience fee starts at just ₹100 per form filling along with official government form fees (if applicable by category like Gen/OBC/SC/ST/EWS/PH)."
  },
  {
    question: "How will I receive proof of my submitted form?",
    answer: "Once our expert submits your form, we instantly send the official PDF confirmation receipt and application acknowledgement to your WhatsApp and email."
  },
  {
    question: "What if there is an error in my form?",
    answer: "Every form is cross-checked by our admin verification team before final submission to ensure zero mistakes in personal details, photo, or document upload."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-slate-950 text-slate-100 border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Got Questions?
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-2 text-sm text-slate-400">Everything you need to know about our form-filling service</p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-slate-800/40 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-slate-200">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-emerald-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 border-t border-slate-800/50 leading-relaxed bg-slate-950/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}