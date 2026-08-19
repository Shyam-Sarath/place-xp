'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarClock, Sparkles, X } from 'lucide-react';

export default function RecruitmentClosedModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm sm:p-6"
        role="presentation"
      >
        <motion.section
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="recruitment-closed-title"
          aria-describedby="recruitment-closed-description"
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border-default glass-strong shadow-2xl"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-5 rounded-xl p-2 text-text-muted transition-colors hover:bg-white/[0.07] hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-orange-400"
            aria-label="Close recruitment notice"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="px-6 pb-7 pt-9 text-center sm:px-9 sm:pb-9">
            <div className="relative mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-orange-400/25 bg-orange-500/10 text-orange-400">
              <CalendarClock className="h-8 w-8" />
              <Sparkles className="absolute -right-3 -top-2 h-5 w-5 text-amber-300" />
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">Place XP</p>
            <h2 id="recruitment-closed-title" className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Recruitment is not open yet
            </h2>
            <p id="recruitment-closed-description" className="mx-auto mt-4 max-w-sm text-sm leading-6 text-text-muted sm:text-base">
              We are preparing the next recruitment window. Follow Place XP and check back soon for the announcement.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-7 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white gradient-cta transition-all duration-300 hover:shadow-orange-glow focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-bg-primary"
            >
              Got it, I’ll check back
            </button>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
