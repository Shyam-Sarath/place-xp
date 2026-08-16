'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';
import Ferrofluid from '@/components/reactbits/Ferrofluid';
import ShinyText from '@/components/reactbits/ShinyText';
import SpecularButton from '@/components/reactbits/SpecularButton';
import MagneticButton from '@/components/ui/MagneticButton';

export default function Hero() {
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.0 });

      tl.fromTo(
        '.hero-badge',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );

      tl.fromTo(
        '.hero-line',
        { y: 100, opacity: 0, rotateX: -20 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.12, ease: 'power3.out' },
        '-=0.2'
      );

      tl.fromTo(
        '.hero-subtitle',
        { y: 30, opacity: 0, filter: 'blur(4px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      );

      tl.fromTo(
        '.hero-cta',
        { y: 15, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
        '-=0.3'
      );

      tl.fromTo(
        '.hero-scroll',
        { y: -5, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
        '-=0.1'
      );
    }, headlineRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={headlineRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Ferrofluid Background */}
      <div className="absolute inset-0 z-[1]">
        <Ferrofluid
          colors={['#29498B', '#203B72', '#4E84F5', '#F89A4A']}
          speed={0.3}
          scale={1.8}
          turbulence={0.7}
          fluidity={0.12}
          rimWidth={0.2}
          sharpness={2.5}
          shimmer={1.2}
          glow={1.5}
          flowDirection="down"
          opacity={0.6}
          mouseInteraction={true}
          mouseStrength={0.6}
          mouseRadius={0.3}
          mouseDampening={0.15}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-[2]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 gradient-blue-glow opacity-30 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 gradient-glow opacity-20 blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-32 pb-12 mt-12">
        {/* Badge */}
        <motion.div
          className="hero-badge mb-8"
          style={{ opacity: 0 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse-glow" />
            VIT Chennai&apos;s Official Placement-Focused Technical Club
          </span>
        </motion.div>

        {/* Headline */}
        <div className="space-y-2 mb-8">
          <h1 className="hero-line text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95]" style={{ opacity: 0 }}>
            <ShinyText
              text="Equip."
              color="#C8D3E0"
              shineColor="#FFFFFF"
              speed={3}
              spread={120}
              className="font-bold"
            />
          </h1>
          <h1 className="hero-line text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95]" style={{ opacity: 0 }}>
            <ShinyText
              text="Engage."
              color="#C8D3E0"
              shineColor="#F89A4A"
              speed={3}
              delay={0.5}
              spread={120}
              className="font-bold"
            />
          </h1>
          <h1 className="hero-line text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95]" style={{ opacity: 0 }}>
            <ShinyText
              text="Execute."
              color="#F89A4A"
              shineColor="#FFFFFF"
              speed={3}
              delay={1}
              spread={120}
              className="font-bold"
            />
          </h1>
        </div>

        {/* Subtitle */}
        <p className="hero-subtitle text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed" style={{ opacity: 0 }}>
          The community that turns students into industry-ready professionals.
          <br className="hidden sm:block" />
          Your gateway to placements, skills & opportunities.
        </p>

        {/* CTAs — reduced SpecularButton effects */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <div className="hero-cta" style={{ opacity: 0 }}>
            <MagneticButton strength={0.2}>
              <SpecularButton
                size="lg"
                radius={50}
                tint="#F89A4A"
                tintOpacity={0.1}
                textColor="#ffffff"
                lineColor="#F89A4A"
                baseColor="#F89A4A"
                intensity={0.6}
                shineSize={8}
                shineFade={30}
                thickness={0.8}
                followMouse
                autoAnimate
                speed={0.2}
                onClick={() => document.getElementById('recruitment')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Join Place XP
              </SpecularButton>
            </MagneticButton>
          </div>
          <div className="hero-cta" style={{ opacity: 0 }}>
            <MagneticButton strength={0.2}>
              <SpecularButton
                size="lg"
                radius={50}
                tint="#29498B"
                tintOpacity={0.06}
                textColor="#C8D3E0"
                lineColor="#4E84F5"
                baseColor="#29498B"
                intensity={0.4}
                shineSize={6}
                shineFade={30}
                thickness={0.6}
                followMouse
                onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Events
              </SpecularButton>
            </MagneticButton>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll flex flex-col items-center gap-2" style={{ opacity: 0 }}>
          <span className="text-xs text-text-muted uppercase tracking-widest">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-text-muted animate-scroll-indicator" />
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-[3]" />
    </section>
  );
}
