'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const quickLinks = [
    { label: 'About', href: isHome ? '#about' : '/#about' },
    { label: 'Events', href: isHome ? '#events' : '/events' },
    { label: 'Recruitment', href: isHome ? '#recruitment' : '/#recruitment' },
    { label: 'Team', href: isHome ? '#team' : '/#team' },
    { label: 'Gallery', href: isHome ? '#gallery' : '/gallery' },
  ];

  const resourceLinks = [
    { label: 'Events', href: '/events' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: 'mailto:placexp@vit.ac.in' },
  ];

  const [socialLinks, setSocialLinks] = useState<
    { icon: typeof InstagramIcon; href: string; label: string }[]
  >([]);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadSocialLinks() {
      const { data } = await supabase
        .from('site_settings')
        .select('instagram_url, linkedin_url, x_url')
        .eq('id', 'site_settings')
        .maybeSingle();

      if (!active) return;

      const nextLinks = [
        { icon: InstagramIcon, href: data?.instagram_url?.trim() ?? '', label: 'Instagram' },
        { icon: LinkedinIcon, href: data?.linkedin_url?.trim() ?? '', label: 'LinkedIn' },
        { icon: GithubIcon, href: '#', label: 'GitHub' },
        { icon: TwitterIcon, href: data?.x_url?.trim() ?? '', label: 'Twitter' },
      ].filter((link) => !!link.href && link.href.trim() !== '#');

      setSocialLinks(nextLinks);
    }

    void loadSocialLinks();

    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="relative pt-20 pb-8 border-t border-border-divider">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <Image
                src="/logo.png"
                alt="Place XP Logo"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-base font-semibold tracking-tight">
                Place <span className="text-orange-500">XP</span>
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed mb-5">
              VIT Chennai&apos;s official placement-focused technical club.
              Building industry-ready professionals.
            </p>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>VIT University, Chennai Campus</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-5 uppercase tracking-wider">Navigate</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted hover:text-orange-500 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-5 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted hover:text-orange-500 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-5 uppercase tracking-wider">Connect</h4>
            <div className="flex items-center gap-3 mb-5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-muted hover:text-orange-500 hover:border-orange-500/30 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
            <a
              href="mailto:placexp@vit.ac.in"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-orange-500 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              placexp@vit.ac.in
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-divider flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Place XP, VIT Chennai. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Built with passion by the Place XP Team
          </p>
        </div>
      </div>
    </footer>
  );
}
