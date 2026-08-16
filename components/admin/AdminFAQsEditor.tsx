'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { FAQ } from '@/types/database';

const inputClasses =
  'w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors';

export default function AdminFAQsEditor({ eventId, faqs }: { eventId: string; faqs: FAQ[] }) {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...faqs].sort((a, b) => a.order_index - b.order_index);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from('faqs').insert({
      event_id: eventId,
      question,
      answer,
      order_index: sorted.length > 0 ? sorted[sorted.length - 1].order_index + 1 : 0,
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setQuestion('');
    setAnswer('');
    router.refresh();
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const supabase = createClient();
    await supabase.from('faqs').delete().eq('id', id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="rounded-2xl border border-border-default p-5 space-y-3">
        <input
          required
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className={inputClasses}
        />
        <textarea
          required
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className={`${inputClasses} min-h-[70px] resize-y`}
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl gradient-cta text-white text-sm font-medium hover:shadow-orange-glow transition-all duration-300 disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Add FAQ
        </button>
        {error && <p className="text-sm text-status-error">{error}</p>}
      </form>

      {sorted.length > 0 && (
        <div className="rounded-2xl border border-border-default divide-y divide-border-divider">
          {sorted.map((faq) => (
            <div key={faq.id} className="flex items-start gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{faq.question}</p>
                <p className="text-sm text-text-muted mt-1">{faq.answer}</p>
              </div>
              <button
                onClick={() => handleDelete(faq.id)}
                disabled={busyId === faq.id}
                className="text-text-muted hover:text-status-error transition-colors shrink-0"
              >
                {busyId === faq.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
