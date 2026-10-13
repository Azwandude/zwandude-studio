'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Download, Code2, Camera, Video, Mic2, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const tools = [
  { name: 'Adobe Premiere Pro', category: 'Editing' },
  { name: 'DaVinci Resolve', category: 'Color & Edit' },
  { name: 'Adobe After Effects', category: 'Motion Graphics' },
  { name: 'Adobe Audition', category: 'Audio' },
  { name: 'Sony FX3', category: 'Camera' },
  { name: 'DJI Ronin', category: 'Stabilizer' },
  { name: 'Aputure Lighting', category: 'Lighting' },
  { name: 'Rode Wireless GO', category: 'Audio' },
];

const skills = [
  { icon: Camera, label: 'Cinematography', desc: 'Narrative-driven shot composition, lighting design, and camera movement.' },
  { icon: Video, label: 'Post-Production', desc: 'Color grading, editing, motion graphics, and audio mixing from raw to final.' },
  { icon: Mic2, label: 'On-Screen Presenting', desc: 'Script delivery, hosting, ad-lib, and natural charisma on camera.' },
  { icon: Code2, label: 'Digital Strategy', desc: 'Content planning for social platforms, SEO-aligned video production.' },
];

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero
      gsap.from('.about-hero-item', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.2 });

      // Skills
      gsap.from('.skill-card', {
        scrollTrigger: { trigger: '.skills-section', start: 'top 75%' },
        y: 50, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      });

      // Tools
      gsap.from('.tool-item', {
        scrollTrigger: { trigger: '.tools-section', start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} style={{ paddingTop: 'var(--nav-height)' }}>
      {/* ── PAGE HERO ── */}
      <div
        className="relative py-20 md:py-32 overflow-hidden border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(232,56,26,0.07) 0%, transparent 70%)' }}
        />
        <div className="container-wide relative z-10">
          <div className="max-w-4xl">
            <p className="section-label about-hero-item mb-4">The Person Behind the Lens</p>
            <h1
              className="font-display text-white about-hero-item mb-8"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
            >
              About
            </h1>
            <p
              className="text-xl leading-relaxed about-hero-item max-w-2xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              Hi, I&apos;m <strong style={{ color: 'var(--text-primary)' }}>Azwan</strong> — a Malaysian videographer, video editor,
              and on-screen talent passionate about telling authentic stories through film.
            </p>
          </div>
        </div>
      </div>

      {/* ── BIO SECTION ── */}
      <section className="py-24">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div className="space-y-6">
              <p className="section-label">My Story</p>
              <div className="space-y-5" style={{ color: 'var(--text-secondary)' }}>
                <p className="leading-relaxed text-base">
                  It started with a cheap camera and a YouTube obsession. What began as a hobby quickly became
                  a calling — I realised I had a natural instinct for finding the frame, for knowing when a
                  moment was about to happen, and for making people feel comfortable in front of a lens.
                </p>
                <p className="leading-relaxed text-base">
                  Over the past 5+ years, I&apos;ve shot weddings, corporate events, travel documentaries, and
                  social media content across Malaysia. I&apos;ve sat in the edit suite for thousands of hours,
                  and I&apos;ve stood in front of the camera just as much — hosting product launches, presenting
                  for brands, and appearing on screen for clients who needed a face as well as a crew.
                </p>
                <p className="leading-relaxed text-base">
                  The name <strong style={{ color: 'var(--text-primary)' }}>Zwandude Studio</strong> reflects that duality —
                  a creative studio that&apos;s also a solo practitioner, built for flexibility, quality, and
                  genuine storytelling.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/projects" className="btn-primary">
                  View My Work <ArrowRight size={15} />
                </Link>
                <a
                  href="/resume.pdf"
                  download
                  className="btn-outline"
                >
                  <Download size={15} /> Resume
                </a>
              </div>
            </div>

            {/* Visual — ZS monogram card */}
            <div className="relative">
              <div
                className="aspect-square flex items-center justify-center relative overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="font-display text-center select-none"
                  style={{ fontSize: 'clamp(8rem, 20vw, 14rem)', color: 'rgba(232,56,26,0.15)', letterSpacing: '-0.05em' }}
                >
                  ZS
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Azwan · Zwandude Studio · Malaysia</p>
                </div>
              </div>
              <div
                className="absolute -top-3 -right-3 w-12 h-12 flex items-center justify-center"
                style={{ background: 'var(--accent)' }}
              >
                <Award size={20} color="white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section
        className="skills-section py-24"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="container-wide">
          <p className="section-label mb-3">What I Bring</p>
          <h2 className="font-display text-white mb-16" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
            Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="skill-card p-6 border transition-colors duration-300 hover:border-[#e8381a]/40"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <Icon size={28} className="mb-4" style={{ color: 'var(--accent)' }} />
                <h3
                  className="font-semibold text-white mb-3"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS & GEAR ── */}
      <section className="tools-section py-24">
        <div className="container-wide">
          <p className="section-label mb-3">The Kit</p>
          <h2 className="font-display text-white mb-16" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
            Tools & Gear
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map(({ name, category }) => (
              <div
                key={name}
                className="tool-item p-5 border transition-colors duration-300 hover:border-[#e8381a]/30"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <p className="text-xs mb-2" style={{ color: 'var(--accent)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>
                  {category}
                </p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="border-t py-20 text-center" style={{ borderColor: 'var(--border)' }}>
        <div className="container-wide">
          <p className="section-label mb-4">Let&apos;s Connect</p>
          <h2 className="font-display text-white mb-6" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
            Ready to Work Together?
          </h2>
          <Link href="/contact" className="btn-primary">
            Get in Touch <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
