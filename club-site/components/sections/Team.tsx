'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import TiltedCard from '@/components/reactbits/TiltedCard';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

// Editable team data
const teamMembers = [
  { name: 'Faculty Coordinator', role: 'Faculty Advisor', initials: 'FC', gradient: 'from-blue-500 to-blue-700' },
  { name: 'Club President', role: 'President', initials: 'CP', gradient: 'from-orange-500 to-orange-700' },
  { name: 'Vice President', role: 'Vice President', initials: 'VP', gradient: 'from-blue-400 to-blue-600' },
  { name: 'Technical Lead', role: 'Tech Lead', initials: 'TL', gradient: 'from-green-500 to-green-700' },
  { name: 'Events Head', role: 'Events Lead', initials: 'EH', gradient: 'from-purple-500 to-purple-700' },
  { name: 'Design Lead', role: 'Design Head', initials: 'DL', gradient: 'from-pink-500 to-pink-700' },
];

export default function Team() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <SectionWrapper id="team" className="py-32 md:py-40 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8" ref={ref}>
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm uppercase tracking-[0.2em] text-orange-500 font-medium mb-4"
          >
            The Team
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            People behind <span className="text-orange-500">Place XP</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-secondary mt-4 max-w-2xl mx-auto text-lg"
          >
            A passionate team dedicated to empowering students for their career journey.
          </motion.p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group text-center flex flex-col items-center justify-center"
            >
              {/* Tilted Card Avatar */}
              <div className="mb-4">
                <TiltedCard
                  imageSrc={`https://i.pravatar.cc/300?u=${member.initials}`}
                  altText={member.name}
                  captionText={member.role}
                  containerHeight="120px"
                  containerWidth="120px"
                  imageHeight="120px"
                  imageWidth="120px"
                  rotateAmplitude={12}
                  scaleOnHover={1.1}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <div className="w-full h-full flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                      <LinkedinIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  }
                />
              </div>

              <h3 className="text-sm font-semibold text-text-primary">{member.name}</h3>
              <p className="text-xs text-text-muted mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-orange-500 transition-colors group"
          >
            Meet the full team
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
