'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Target, Eye } from 'lucide-react';
import ScrollReveal from '@/components/reactbits/ScrollReveal';
import OptionWheel from '@/components/reactbits/OptionWheel';
import SectionWrapper from '@/components/ui/SectionWrapper';

const aboutContent: Record<string, { title: string; text: string }> = {
  'About': {
    title: 'Who We Are',
    text: 'Place XP is VIT Chennai\'s premier placement-focused technical club, dedicated to bridging the gap between academia and industry. We empower students with the skills, network, and experience they need to land their dream roles at top companies.',
  },
  'Mission': {
    title: 'Our Mission',
    text: 'Equip every student with industry-relevant skills and real-world experience for career success. Through hands-on workshops, hackathons, and industry connections, we create professionals — not just graduates.',
  },
  'Vision': {
    title: 'Our Vision',
    text: 'Build India\'s most impactful student-run placement community that produces industry-ready talent. We aim to set the benchmark for student-driven career development.',
  },
  'Culture': {
    title: 'Our Culture',
    text: 'A collaborative, growth-focused environment where curiosity is celebrated and initiative is rewarded. Every member gets the opportunity to lead, learn, and leave a lasting impact.',
  },
  'Impact': {
    title: 'Our Impact',
    text: 'Hundreds of students placed at top companies. Dozens of workshops, hackathons, and industry sessions. A growing alumni network that mentors the next generation.',
  },
  'Community': {
    title: 'The Community',
    text: 'More than just a club — we\'re a family of ambitious students united by the goal of career excellence. From first-years to final-years, everyone has a place here.',
  },
};

const wheelItems = Object.keys(aboutContent);

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeItem, setActiveItem] = useState('About');

  const currentContent = aboutContent[activeItem];

  return (
    <SectionWrapper id="about" className="py-32 md:py-40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center" ref={ref}>
          {/* OptionWheel Side — 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 relative h-[400px] md:h-[600px] hidden lg:block"
          >
            <OptionWheel
              items={wheelItems}
              defaultSelected={0}
              textColor="#8EA2B8"
              activeColor="#F89A4A"
              side="left"
              fontSize={2.5}
              spacing={1.4}
              curve={1}
              tilt={6}
              blur={2}
              fade={0.3}
              minOpacity={0.05}
              smoothing={200}
              inset={30}
              loop={false}
              draggable
              onChange={(index, item) => setActiveItem(item)}
            />
          </motion.div>

          {/* Content Side — 3 cols */}
          <div className="lg:col-span-3 space-y-8">
            {/* Mobile: Simple label since OptionWheel is desktop-only */}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-sm uppercase tracking-[0.2em] text-orange-500 font-medium lg:hidden"
            >
              Who We Are
            </motion.span>

            <motion.div
              key={activeItem}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
                {currentContent.title}
              </h2>

              <p className="text-text-body text-lg leading-relaxed max-w-2xl">
                {currentContent.text}
              </p>
            </motion.div>

            {/* Mission & Vision Cards */}
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="p-6 rounded-2xl glass group hover:border-orange-500/30 transition-all duration-500"
              >
                <Target className="w-6 h-6 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-base font-semibold text-text-primary mb-2">Mission</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Equip every student with industry-relevant skills and real-world experience for career success.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="p-6 rounded-2xl glass group hover:border-blue-400/30 transition-all duration-500"
              >
                <Eye className="w-6 h-6 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-base font-semibold text-text-primary mb-2">Vision</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Build India&apos;s most impactful student-run placement community that produces industry-ready talent.
                </p>
              </motion.div>
            </div>

            {/* Visual — Logo instead of "XP" placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative mt-8 p-8 rounded-2xl glass overflow-hidden"
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-blue-glow shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Place XP Logo"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xl font-bold text-text-primary">Place XP</p>
                  <p className="text-text-muted text-sm tracking-wider uppercase mt-1">Since 2020 · VIT Chennai</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
