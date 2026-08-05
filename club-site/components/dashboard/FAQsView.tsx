'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQ } from '@/types/database';

export default function FAQsView({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (faqs.length === 0) {
    return (
      <div className="glass rounded-2xl py-16 text-center">
        <p className="text-text-muted">No FAQs posted yet.</p>
      </div>
    );
  }

  const sorted = [...faqs].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="glass rounded-2xl divide-y divide-border-divider overflow-hidden">
      {sorted.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id}>
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-sm font-medium text-text-primary">{faq.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-text-muted shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-5 -mt-1">
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
