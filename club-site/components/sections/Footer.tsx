'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Proper, recognizable brand marks (Simple Icons paths) — not generic
// outline glyphs — so these read unmistakably as Instagram/LinkedIn/YouTube.
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.68c-3.405 0-6.16 2.756-6.16 6.16 0 3.405 2.755 6.16 6.16 6.16 3.405 0 6.16-2.755 6.16-6.16 0-3.404-2.755-6.16-6.16-6.16zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.795.645-1.44 1.44-1.44.794-.001 1.44.645 1.44 1.44z" />
  </svg>
);
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.025-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.016 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Recruitment', href: '#recruitment' },
  { label: 'Team', href: '#team' },
  { label: 'Gallery', href: '#gallery' },
];

const resourceLinks = [
  { label: 'Resources', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Privacy Policy', href: '#' },
];

export default function Footer() {
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
        { icon: YoutubeIcon, href: data?.x_url?.trim() ?? '', label: 'YouTube' },
      ].filter((link) => !!link.href && link.href.trim() !== '#');

      setSocialLinks(nextLinks);
    }

    void loadSocialLinks();

    return () => {
      active = false;
    };
  }, []);

  return (
    <footer id="site-footer" className="relative pt-20 pb-8 border-t border-border-divider">
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
              href="mailto:placexp@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-orange-500 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              placexp@gmail.com
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
