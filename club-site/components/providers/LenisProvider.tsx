'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Handle same-page anchor link clicks for smooth scrolling to sections
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const element = document.querySelector(href);
      if (!element) return;

      e.preventDefault();
      lenis.scrollTo(element as HTMLElement, {
        offset: -80, // Account for sticky navbar height
        duration: 1.2,
      });
    };

    document.addEventListener('click', handleAnchorClick);

    // Handle cross-page landing when URL contains a hash (e.g. landing on /#about from /events)
    const scrollToHash = () => {
      if (typeof window === 'undefined' || !window.location.hash) return;
      const hash = window.location.hash;
      if (hash === '#') return;

      const attemptScroll = (attemptsLeft: number) => {
        const element = document.querySelector(hash);
        if (element) {
          lenis.scrollTo(element as HTMLElement, {
            offset: -80,
            duration: 1.2,
          });
        } else if (attemptsLeft > 0) {
          setTimeout(() => attemptScroll(attemptsLeft - 1), 100);
        }
      };

      // Delay briefly to allow destination page/section to mount
      setTimeout(() => attemptScroll(5), 50);
    };

    window.addEventListener('hashchange', scrollToHash);
    scrollToHash();

    let rafId: number | null = null;
    let isRunning = true;

    function raf(time: number) {
      if (!isRunning) return;
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else {
        if (!isRunning) {
          isRunning = true;
          rafId = requestAnimationFrame(raf);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    rafId = requestAnimationFrame(raf);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('hashchange', scrollToHash);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (rafId !== null) cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
