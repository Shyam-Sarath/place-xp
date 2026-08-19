'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import SpecularButton from '@/components/reactbits/SpecularButton';
import MagneticButton from '@/components/ui/MagneticButton';
import SectionWrapper from '@/components/ui/SectionWrapper';
import RecruitmentClosedModal from '@/components/sections/RecruitmentClosedModal';
import { createClient } from '@/lib/supabase/client';

gsap.registerPlugin(ScrollTrigger);

const timelineSteps = [
  { label: 'Open Recruitment', description: 'Applications go live on our portal', icon: '01' },
  { label: 'Application', description: 'Submit your profile and interests', icon: '02' },
  { label: 'Shortlisting', description: 'Top applicants are selected', icon: '03' },
  { label: 'Interview', description: 'Demonstrate your skills and passion', icon: '04' },
  { label: 'Results', description: 'Welcome to Place XP!', icon: '05' },
];

const departments = [
  'Technical', 'Design', 'Content', 'Events', 'Marketing', 'Operations',
];

export default function Recruitment() {
  const ref = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [showRecruitmentClosed, setShowRecruitmentClosed] = useState(false);
  const [recruitmentOpen, setRecruitmentOpen] = useState(true);

  useEffect(() => {
    // Fetch recruitment closing time on mount
    const fetchRecruitmentStatus = async () => {
      const supabase = createClient();
      const { data: settings } = await supabase
        .from('site_settings')
        .select('recruitment_closes_at')
        .eq('id', 'site_settings')
        .maybeSingle();

      if (settings?.recruitment_closes_at) {
        const closingTime = new Date(settings.recruitment_closes_at);
        const now = new Date();
        // Recruitment is open if closing time hasn't passed yet
        setRecruitmentOpen(now < closingTime);
      } else {
        // If no closing time is set, recruitment is closed indefinitely
        setRecruitmentOpen(false);
      }
    };

    fetchRecruitmentStatus();
  }, []);

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!recruitmentOpen) {
      setShowRecruitmentClosed(true);
      return;
    }
    // If recruitment is open, the button's default behavior is allowed
    // (you can navigate or do whatever the button does)
  };

  useEffect(() => {
    if (!timelineRef.current) return;

    const ctx = gsap.context(() => {
      // Timeline steps animate one by one — cinematic reveal
      gsap.fromTo(
        '.timeline-step',
        { opacity: 0, x: -40, filter: 'blur(4px)' },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Line grows downward
      gsap.fromTo(
        '.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 2,
          ease: 'power2.out',
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
    <SectionWrapper id="recruitment" className="py-32 md:py-44 relative overflow-hidden">
      {/* Unique visual identity — gradient mesh background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] gradient-glow opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] gradient-blue-glow opacity-15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.02]"
          style={{ background: 'conic-gradient(from 0deg, #F89A4A, #29498B, #07111F, #F89A4A)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8" ref={ref}>
        {/* Section Header — centered, impactful */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-orange-500 font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Recruitment Open
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05]"
          >
            Ready to become{' '}
            <br className="hidden sm:block" />
            <span className="text-orange-500">industry-ready</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-secondary mt-6 text-lg leading-relaxed"
          >
            Join Place XP and gain access to exclusive resources, mentorship, and opportunities
            that will set you apart in the job market.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Timeline — 3 cols */}
          <div className="lg:col-span-3" ref={timelineRef}>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs uppercase tracking-[0.2em] text-text-muted font-medium mb-10"
            >
              Selection Process
            </motion.h3>
            <div className="relative pl-12 md:pl-16">
              {/* Vertical gradient line */}
              <div className="timeline-line absolute left-[18px] md:left-[22px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-orange-500 via-blue-500/60 to-border-divider" />

              <div className="space-y-10">
                {timelineSteps.map((step, index) => (
                  <div key={step.label} className="timeline-step relative flex items-start gap-5" style={{ opacity: 0 }}>
                    {/* Step number */}
                    <div className="absolute -left-12 md:-left-16 top-0.5 w-10 h-10 rounded-xl bg-bg-card border border-border-default flex items-center justify-center z-10 group-hover:border-orange-500/30 transition-colors">
                      <span className="text-xs font-mono font-bold text-orange-500">{step.icon}</span>
                    </div>

                    <div className="pt-1 pb-2">
                      <p className="text-lg font-semibold text-text-primary tracking-tight">{step.label}</p>
                      <p className="text-sm text-text-muted mt-1.5 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Departments & CTA — 2 cols */}
          <div className="lg:col-span-2 space-y-10">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xs uppercase tracking-[0.2em] text-text-muted font-medium"
            >
              Departments
            </motion.h3>

            <div className="space-y-3">
              {departments.map((dept, index) => (
                <motion.div
                  key={dept}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.06 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-bg-card/30 border border-border-default/30 hover:bg-bg-card/60 hover:border-white/10 transition-all duration-300 group cursor-default"
                >
                  <CheckCircle2 className="w-4 h-4 text-orange-500/70 shrink-0 group-hover:text-orange-500 transition-colors" />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{dept}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4 pt-6"
            >
              <MagneticButton strength={0.2}>
                <SpecularButton
                  size="lg"
                  radius={50}
                  tint="#F89A4A"
                  tintOpacity={0.2}
                  textColor="#ffffff"
                  lineColor="#F89A4A"
                  baseColor="#F89A4A"
                  intensity={1.2}
                  shineSize={15}
                  shineFade={40}
                  thickness={1.5}
                  followMouse
                  autoAnimate
                  speed={0.3}
                  className="w-full"
                  onClick={handleApplyClick}
                >
                  Apply Now
                </SpecularButton>
              </MagneticButton>

              <MagneticButton strength={0.15}>
                <a
                  href="#"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm text-text-secondary hover:text-orange-500 transition-colors group rounded-full border border-border-default/50 hover:border-orange-500/30"
                >
                  Explore Departments
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </div>
    </SectionWrapper>

    {showRecruitmentClosed && <RecruitmentClosedModal onClose={() => setShowRecruitmentClosed(false)} />}
    </>
  );
}
