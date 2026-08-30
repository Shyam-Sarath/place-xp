'use client';
/* eslint-disable react-hooks/set-state-in-effect -- route changes intentionally synchronize the selected navigation item. */

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import GooeyNav from '@/components/reactbits/GooeyNav';
import BubbleMenu from '@/components/reactbits/BubbleMenu';
import MagneticButton from '@/components/ui/MagneticButton';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isManualNav, setIsManualNav] = useState(false);
  const navTimerRef = useRef<number | null>(null);

  const isHome = pathname === '/';

  const handleNavSelect = (index: number) => {
    setActiveIndex(index);
    if (isHome) {
      setIsManualNav(true);
      if (navTimerRef.current) {
        window.clearTimeout(navTimerRef.current);
      }
      navTimerRef.current = window.setTimeout(() => setIsManualNav(false), 700);
    }
  };

  const navLinks = [
    { label: 'About', href: isHome ? '#about' : '/#about' },
    { label: 'Impact', href: isHome ? '#impact' : '/#impact' },
    { label: 'Events', href: isHome ? '#events' : '/events' },
    { label: 'Recruitment', href: isHome ? '#recruitment' : '/#recruitment' },
    { label: 'Gallery', href: isHome ? '#gallery' : '/gallery' },
    { label: 'Team', href: isHome ? '#team' : '/#team' },
  ];

  useEffect(() => {
    if (!isHome) {
      if (pathname.startsWith('/events')) {
        setActiveIndex(2);
      } else if (pathname.startsWith('/gallery')) {
        setActiveIndex(4);
      }
      return;
    }

    const sectionIds = ['about', 'impact', 'events', 'recruitment', 'gallery', 'team'];

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (isManualNav) return;

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
  }, [pathname, isHome, isManualNav]);

  // The active item mirrors the current route after navigation.
   
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    let active = true;

    const syncUser = async (nextUser: User | null) => {
      if (!active) return;
      setUser(nextUser);

      if (!nextUser) {
        setIsStaff(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', nextUser.id)
        .maybeSingle();

      if (!active) return;
      setIsStaff(!error && !!data && (data.role === 'organizer' || data.role === 'admin'));
    };

    supabase.auth.getUser().then(({ data }) => {
      void syncUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncUser(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.replace('/');
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
              onIndexChange={handleNavSelect}
            />
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {isStaff && (
                  <Link
                    href="/admin"
                    className="text-sm text-text-secondary hover:text-orange-500 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
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
                href={isHome ? '#recruitment' : '/#recruitment'}
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
            { label: 'about', href: isHome ? '#about' : '/#about', ariaLabel: 'About', rotation: 8, hoverStyles: { bgColor: '#203B72', textColor: '#ffffff' } },
            { label: 'events', href: isHome ? '#events' : '/events', ariaLabel: 'Events', rotation: -5, hoverStyles: { bgColor: '#F89A4A', textColor: '#ffffff' } },
            { label: 'join us', href: isHome ? '#recruitment' : '/#recruitment', ariaLabel: 'Recruitment', rotation: -8, hoverStyles: { bgColor: '#F89A4A', textColor: '#ffffff' } },
            { label: 'gallery', href: isHome ? '#gallery' : '/gallery', ariaLabel: 'Gallery', rotation: 3, hoverStyles: { bgColor: '#F89A4A', textColor: '#ffffff' } },
            { label: 'team', href: isHome ? '#team' : '/#team', ariaLabel: 'Team', rotation: 6, hoverStyles: { bgColor: '#132238', textColor: '#ffffff' } },
            user
              ? isStaff
                ? { label: 'admin', href: '/admin', ariaLabel: 'Admin Dashboard', rotation: 5, hoverStyles: { bgColor: '#203B72', textColor: '#ffffff' } }
                : { label: 'profile', href: '/dashboard', ariaLabel: 'Profile', rotation: 5, hoverStyles: { bgColor: '#203B72', textColor: '#ffffff' } }
              : { label: 'log in', href: '/login', ariaLabel: 'Log In', rotation: 5, hoverStyles: { bgColor: '#203B72', textColor: '#ffffff' } },
          ]}
          onMenuClick={(open) => setMobileOpen(open)}
        />
      </div>
    </>
  );
}
