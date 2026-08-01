'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import GooeyNav from '@/components/reactbits/GooeyNav';
import BubbleMenu from '@/components/reactbits/BubbleMenu';
import MagneticButton from '@/components/ui/MagneticButton';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Impact', href: '#impact' },
  { label: 'Events', href: '#events' },
  { label: 'Team', href: '#team' },
  { label: 'Recruitment', href: '#recruitment' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 hidden lg:block ${
          scrolled
            ? 'glass-strong shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Place XP Logo"
              width={40}
              height={40}
              className="rounded-lg transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-lg font-semibold text-text-primary tracking-tight">
              Place <span className="text-orange-500">XP</span>
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden lg:flex flex-1 justify-center">
            <GooeyNav
              items={navLinks}
              animationTime={600}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={0}
            />
          </div>

          {/* CTA */}
          <MagneticButton strength={0.2}>
            <a
              href="#recruitment"
              className="px-5 py-2.5 text-sm font-medium rounded-full gradient-cta text-white transition-all duration-300 hover:shadow-orange-glow hover:scale-105"
            >
              Join Us
            </a>
          </MagneticButton>
        </div>
      </motion.header>

      {/* Mobile BubbleMenu */}
      <div className="lg:hidden">
        <BubbleMenu
          logo={
            <Image
              src="/logo.png"
              alt="Place XP"
              width={32}
              height={32}
              className="rounded-md"
            />
          }
          menuBg="#0D1B2A"
          menuContentColor="#ffffff"
          useFixedPosition={true}
          items={[
            { label: 'home', href: '#hero', ariaLabel: 'Home', rotation: -8, hoverStyles: { bgColor: '#29498B', textColor: '#ffffff' } },
            { label: 'about', href: '#about', ariaLabel: 'About', rotation: 8, hoverStyles: { bgColor: '#203B72', textColor: '#ffffff' } },
            { label: 'events', href: '#events', ariaLabel: 'Events', rotation: -5, hoverStyles: { bgColor: '#F89A4A', textColor: '#ffffff' } },
            { label: 'team', href: '#team', ariaLabel: 'Team', rotation: 6, hoverStyles: { bgColor: '#132238', textColor: '#ffffff' } },
            { label: 'join us', href: '#recruitment', ariaLabel: 'Recruitment', rotation: -8, hoverStyles: { bgColor: '#F89A4A', textColor: '#ffffff' } },
          ]}
          onMenuClick={(open) => setMobileOpen(open)}
        />
      </div>
    </>
  );
}
