'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionWrapper from '@/components/ui/SectionWrapper';

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  label: string;
  value: number;
  suffix: string;
  description: string;
}

// Editable stats — committee can update these values
const stats: Stat[] = [
  { label: 'Members', value: 250, suffix: '+', description: 'Active community members' },
  { label: 'Events', value: 45, suffix: '+', description: 'Workshops & sessions hosted' },
  { label: 'Hackathons', value: 20, suffix: '+', description: 'Competitions organized' },
  { label: 'Workshops', value: 60, suffix: '+', description: 'Skill-building workshops' },
];

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView || !countRef.current) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = Math.round(obj.val).toString() + suffix;
        }
      },
    });
  }, [inView, value, suffix]);

  return (
    <span ref={countRef} className="text-5xl md:text-6xl lg:text-7xl font-bold text-orange-500 tabular-nums tracking-tighter">
      0{suffix}
    </span>
  );
}

export default function Impact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <SectionWrapper id="impact" className="py-32 md:py-44 relative overflow-hidden">
      {/* Distinct visual: diagonal gradient band */}
      <div className="absolute inset-0 bg-bg-secondary" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(248,154,74,0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 50%, rgba(41,73,139,0.15) 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8" ref={ref}>
        {/* Section Header — asymmetric, left-aligned for variety */}
        <div className="max-w-3xl mb-24">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm uppercase tracking-[0.2em] text-orange-500 font-medium mb-4"
          >
            Our Impact
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] mb-6"
          >
            Numbers that speak{' '}
            <br className="hidden md:block" />
            <span className="text-orange-500">for themselves.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-text-secondary text-lg md:text-xl max-w-2xl leading-relaxed"
          >
            Place XP has helped hundreds of students develop their skills to get placed at top companies.
          </motion.p>
        </div>

        {/* Stats — staggered masonry-like layout, not equal grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
              }}
              className={`relative p-8 md:p-10 rounded-3xl overflow-hidden group transition-all duration-500 ${
                index === 0 ? 'col-span-2 lg:col-span-2 bg-bg-card border border-border-default hover:border-orange-500/20' :
                index === 3 ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/10 hover:border-orange-500/30' :
                'bg-bg-card/50 border border-border-default/50 hover:border-white/10'
              }`}
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: 'radial-gradient(circle at 50% 100%, rgba(248,154,74,0.06), transparent 70%)' }}
              />

              <div className="relative z-10">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={isInView} />
                <p className="text-text-primary font-semibold mt-4 text-lg">{stat.label}</p>
                <p className="text-text-muted text-sm mt-1.5 leading-relaxed">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
