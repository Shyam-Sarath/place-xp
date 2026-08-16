'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Code2, Users, Rocket, Trophy, Building2, Crown,
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';

const benefits = [
  {
    icon: Code2,
    title: 'Technical Learning',
    description: 'Master industry-demanded skills through curated workshops, coding bootcamps, and mentorship from experienced developers.',
    color: '#4E84F5',
  },
  {
    icon: Users,
    title: 'Networking',
    description: 'Connect with peers, alumni, and industry professionals. Build relationships that accelerate your career trajectory.',
    color: '#F89A4A',
  },
  {
    icon: Rocket,
    title: 'Real Projects',
    description: 'Work on production-grade projects that go beyond the classroom. Build a portfolio that stands out to recruiters.',
    color: '#2ECC71',
  },
  {
    icon: Trophy,
    title: 'Hackathons',
    description: 'Compete in national-level hackathons, sharpen your problem-solving skills, and win recognition for your innovations.',
    color: '#FFB870',
  },
  {
    icon: Building2,
    title: 'Industry Exposure',
    description: 'Get access to company visits, guest lectures, and mock interviews with professionals from top tech companies.',
    color: '#7EA8FF',
  },
  {
    icon: Crown,
    title: 'Leadership',
    description: 'Take ownership, lead teams, organize events, and develop the soft skills that set future leaders apart.',
    color: '#F89A4A',
  },
];

export default function WhyJoin() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <SectionWrapper id="why-join" className="py-32 md:py-40 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8" ref={ref}>
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm uppercase tracking-[0.2em] text-orange-500 font-medium mb-4"
          >
            Why Place XP
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            Everything you need to <span className="text-orange-500">succeed</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-secondary mt-4 max-w-2xl mx-auto text-lg"
          >
            We don&apos;t just prepare you for placements — we prepare you for your career.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group relative p-8 rounded-2xl glass hover:bg-white/[0.06] transition-all duration-500 cursor-default"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${benefit.color}15, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110"
                    style={{
                      background: `${benefit.color}15`,
                      border: `1px solid ${benefit.color}30`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: benefit.color }} />
                  </div>

                  <h3 className="text-lg font-semibold text-text-primary mb-3 group-hover:text-white transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Bottom accent line on hover */}
                <div
                  className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:left-4 group-hover:right-4"
                  style={{ background: `linear-gradient(90deg, transparent, ${benefit.color}, transparent)` }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
