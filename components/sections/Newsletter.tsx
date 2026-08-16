'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Send } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';

export default function Newsletter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <SectionWrapper id="newsletter" className="py-32 md:py-40 relative bg-bg-secondary overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] gradient-blue-glow opacity-15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] gradient-glow opacity-10 blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 md:px-8 text-center" ref={ref}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-block text-sm uppercase tracking-[0.2em] text-orange-500 font-medium mb-4"
        >
          Stay Updated
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
        >
          Never miss an <span className="text-orange-500">update</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-secondary mb-10 text-lg"
        >
          Subscribe to get the latest news about events, workshops, and recruitment drives.
        </motion.p>

        {/* Email Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-5 py-3.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/25 transition-all duration-300 text-sm"
            required
          />
          <button
            type="submit"
            className="px-6 py-3.5 rounded-full gradient-cta text-white font-medium text-sm hover:shadow-orange-glow transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center"
          >
            Subscribe
            <Send className="w-4 h-4" />
          </button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-xs text-text-muted mt-4"
        >
          No spam, ever. Unsubscribe anytime.
        </motion.p>
      </div>
    </SectionWrapper>
  );
}
