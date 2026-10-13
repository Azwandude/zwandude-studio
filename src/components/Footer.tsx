import Link from 'next/link';
import { Mail } from 'lucide-react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'var(--accent)', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                ZS
              </div>
              <span
                className="text-white font-semibold"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Zwandude Studio
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Crafting cinematic stories through the lens — videography, editing, and on-screen presence.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="section-label">Navigate</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/projects', label: 'Projects' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-300 hover:text-[#e8381a]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="section-label">Get in Touch</h3>
            <div className="space-y-3">
              <a
                href="mailto:azwan160902@gmail.com"
                className="flex items-center gap-3 text-sm transition-colors duration-300 hover:text-[#e8381a]"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Mail size={15} />
                azwan160902@gmail.com
              </a>
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="transition-colors duration-300 hover:text-[#e8381a]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <FaInstagram size={18} />
                </a>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="transition-colors duration-300 hover:text-[#e8381a]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <FaYoutube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="divider my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {year} Zwandude Studio. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Built with passion &amp; code.
          </p>
        </div>
      </div>
    </footer>
  );
}
