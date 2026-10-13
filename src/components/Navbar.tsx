'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { gsap } from 'gsap';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);

  // Hide Navbar on /studio routes
  const isStudio = pathname?.startsWith('/studio');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (isStudio) return;
    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, { y: -20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });
      if (linksRef.current) {
        gsap.from(linksRef.current.querySelectorAll('li'), {
          y: -20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.4,
        });
      }
    }, navRef);
    return () => ctx.revert();
  }, [isStudio]);

  if (isStudio) return null;

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 shadow-xl shadow-black/40'
          : 'bg-transparent'
      }`}
      style={{ height: 'var(--nav-height)' }}
    >
      <div className="container-wide h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          ref={logoRef}
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Zwandude Studio Home"
        >
          <div
            className="w-9 h-9 bg-[#e8381a] flex items-center justify-center text-white font-bold text-sm tracking-wider transition-transform duration-300 group-hover:scale-110"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            ZS
          </div>
          <span
            className="text-white font-semibold tracking-wide hidden sm:block"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }}
          >
            Zwandude Studio
          </span>
        </Link>

        {/* Desktop nav */}
        <ul ref={linksRef} className="hidden md:flex items-center gap-8 list-none">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-sm tracking-widest uppercase font-semibold transition-colors duration-300 py-1
                    ${isActive ? 'text-[#e8381a]' : 'text-[#999] hover:text-white'}`}
                  style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.15em' }}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#e8381a]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-[#0a0a0a]/98 backdrop-blur-xl z-40 flex flex-col justify-center items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-4xl tracking-widest uppercase font-display transition-colors duration-300 ${
                  isActive ? 'text-[#e8381a]' : 'text-white hover:text-[#e8381a]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
