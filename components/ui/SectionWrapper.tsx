'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}

export default function SectionWrapper({
  children,
  className = '',
  id,
  delay = 0,
  direction = 'up',
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 60 : 0,
      x: direction === 'left' ? -60 : direction === 'right' ? 60 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`section-transition ${className}`}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={direction === 'none' ? undefined : variants}
    >
      {children}
    </motion.section>
  );
}
