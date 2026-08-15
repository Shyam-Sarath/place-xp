'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import GooeyNav from '@/components/reactbits/GooeyNav';
import BubbleMenu from '@/components/reactbits/BubbleMenu';
import MagneticButton from '@/components/ui/MagneticButton';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const isHome = pathname === '/';

  const navLinks = [
    { label: 'About', href: isHome ? '#about' : '/#about' },
    { label: 'Impact', href: isHome ? '#impact' : '/#impact' },
    { label: 'Events', href: isHome ? '#events' : '/events' },
    { label: 'Team', href: isHome ? '#team' : '/#team' },
    { label: 'Recruitment', href: isHome ? '#recruitment' : '/#recruitment' },
  ];

  useEffect(() => {
    if (!isHome) {
      if (pathname.startsWith('/events')) {
        setActiveIndex(2);
      }
      return;
    }

    const sectionIds = ['about', 'impact', 'events', 'team', 'recruitment'];

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const scrollPosition = window.scrollY + 250;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(sectionIds[i]);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveIndex(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, isHome]);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  }

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
          <Link href="/" className="flex items-center gap-3 group">
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
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex flex-1 justify-center">
            <GooeyNav
              items={navLinks}
              animationTime={600}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              activeIndex={activeIndex}
              onIndexChange={(idx) => setActiveIndex(idx)}
            />
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <a
                  href="/dashboard"
                  className="text-sm text-text-secondary hover:text-orange-500 transition-colors"
                >
                  My Events
                </a>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-text-muted hover:text-orange-500 transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="text-sm text-text-secondary hover:text-orange-500 transition-colors"
              >
                Log In
              </a>
            )}
            <MagneticButton strength={0.2}>
              <a
                href="#recruitment"
                className="px-5 py-2.5 text-sm font-medium rounded-full gradient-cta text-white transition-all duration-300 hover:shadow-orange-glow hover:scale-105"
              >
                Join Us
              </a>
            </MagneticButton>
          </div>
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
            { label: 'home', href: '/', ariaLabel: 'Home', rotation: -8, hoverStyles: { bgColor: '#29498B', textColor: '#ffffff' } },
            { label: 'about', href: '#about', ariaLabel: 'About', rotation: 8, hoverStyles: { bgColor: '#203B72', textColor: '#ffffff' } },
            { label: 'events', href: '/events', ariaLabel: 'Events', rotation: -5, hoverStyles: { bgColor: '#F89A4A', textColor: '#ffffff' } },
            { label: 'team', href: '#team', ariaLabel: 'Team', rotation: 6, hoverStyles: { bgColor: '#132238', textColor: '#ffffff' } },
            user
              ? { label: 'my events', href: '/dashboard', ariaLabel: 'My Events', rotation: 5, hoverStyles: { bgColor: '#203B72', textColor: '#ffffff' } }
              : { label: 'log in', href: '/login', ariaLabel: 'Log In', rotation: 5, hoverStyles: { bgColor: '#203B72', textColor: '#ffffff' } },
            { label: 'join us', href: '#recruitment', ariaLabel: 'Recruitment', rotation: -8, hoverStyles: { bgColor: '#F89A4A', textColor: '#ffffff' } },
          ]}
          onMenuClick={(open) => setMobileOpen(open)}
        />
      </div>
    </>
  );
}
