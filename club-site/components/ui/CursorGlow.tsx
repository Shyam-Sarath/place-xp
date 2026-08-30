'use client';

import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    if (!mediaQuery.matches) return;

    let mouseX = -1000;
    let mouseY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let rafId: number | null = null;
    let isMoving = false;

    const animate = () => {
      if (document.hidden) {
        rafId = null;
        isMoving = false;
        return;
      }

      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      glow.style.left = `${currentX}px`;
      glow.style.top = `${currentY}px`;

      const dx = Math.abs(mouseX - currentX);
      const dy = Math.abs(mouseY - currentY);

      if (dx < 0.1 && dy < 0.1) {
        currentX = mouseX;
        currentY = mouseY;
        glow.style.left = `${currentX}px`;
        glow.style.top = `${currentY}px`;
        rafId = null;
        isMoving = false;
      } else {
        rafId = requestAnimationFrame(animate);
      }
    };

    const startAnimate = () => {
      if (!isMoving && !document.hidden) {
        isMoving = true;
        rafId = requestAnimationFrame(animate);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      glow.style.opacity = '1';
      startAnimate();
    };

    const onMouseLeave = () => {
      glow.style.opacity = '0';
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        isMoving = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow hidden lg:block" style={{ opacity: 0 }} />;
}
