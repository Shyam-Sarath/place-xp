'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function LoadingScreen() {
  const mounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, [mounted]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[10000] bg-bg-primary flex items-center justify-center"
        >
          {/* Ambient glow behind logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(41,73,139,0.3) 0%, rgba(248,154,74,0.1) 40%, transparent 70%)',
            }}
          />

          {/* Logo reveal */}
          <div className="relative flex flex-col items-center gap-5">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-16 h-16 rounded-2xl overflow-hidden shadow-blue-glow"
            >
              <Image src="/logo.png" alt="Place XP" width={64} height={64} priority className="w-full h-full object-cover" />
            </motion.div>

            {/* Text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
              className="text-sm tracking-[0.3em] uppercase text-text-muted font-medium"
            >
              Place <span className="text-orange-500">XP</span>
            </motion.p>

            {/* Progress line */}
            <motion.div className="w-32 h-[2px] rounded-full overflow-hidden bg-white/5">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="h-full rounded-full gradient-cta"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
