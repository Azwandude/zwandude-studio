'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import { getFeaturedProjects } from '@/lib/projects';

gsap.registerPlugin(ScrollTrigger);

const categories = ['All', 'Videography', 'Editing', 'Talent'] as const;

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<'All' | 'Videography' | 'Editing' | 'Talent'>('All');
  const [projects, setProjects] = useState<Awaited<ReturnType<typeof getFeaturedProjects>>>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getFeaturedProjects()
      .then((featuredProjects) => {
        if (active) setProjects(featuredProjects);
      })
      .catch((error: unknown) => {
        console.error('Failed to load featured projects:', error);
      })
      .finally(() => {
        if (active) setProjectsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance timeline
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(titleRef.current, {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
      })
        .from(
          subtitleRef.current,
          { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
        .from(
          ctaRef.current,
          { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        )
        .from(
          scrollLineRef.current,
          { scaleY: 0, opacity: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.2'
        );

      // Scroll-triggered: stats
      if (statsRef.current) {
        gsap.from(statsRef.current.querySelectorAll('.stat-item'), {
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
        });
      }

      // Scroll-triggered: featured project cards
      if (featuredRef.current) {
        gsap.from(featuredRef.current.querySelectorAll('.project-card-wrap'), {
          scrollTrigger: { trigger: featuredRef.current, start: 'top 75%' },
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef}>
      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ paddingTop: 'var(--nav-height)' }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,56,26,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Grid lines decoration */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="container-wide relative z-10">
          <div className="max-w-5xl">
            <p className="section-label mb-6">Zwandude Studio</p>

            <h1
              ref={titleRef}
              className="font-display text-white mb-6 leading-none"
              style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', clipPath: 'inset(0 0% 0 0)' }}
            >
              Stories Told
              <br />
              Through{' '}
              <span style={{ color: 'var(--accent)' }}>Film.</span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              Videographer · Editor · On-Screen Talent — crafting cinematic narratives
              for brands, events, and creative projects across Malaysia.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4">
              <Link href="/projects" className="btn-primary">
                View Projects <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="btn-outline">
                Work With Me
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollLineRef}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={{ transformOrigin: 'top' }}
        >
          <span className="section-label" style={{ fontSize: '0.65rem' }}>Scroll</span>
          <div
            className="w-px h-16"
            style={{ background: 'linear-gradient(to bottom, var(--accent), transparent)' }}
          />
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        ref={statsRef}
        className="py-20 border-y"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: '50+', label: 'Projects Completed' },
              { value: '3', label: 'Disciplines' },
              { value: '5+', label: 'Years Experience' },
              { value: '100%', label: 'Client Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="stat-item text-center md:text-left">
                <div
                  className="font-display mb-1"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--accent)' }}
                >
                  {stat.value}
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS SECTION ── */}
      <section className="py-24">
        <div className="container-wide">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="section-label mb-3">Selected Work</p>
              <h2
                className="font-display text-white"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
              >
                Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="flex items-center gap-2 text-sm font-semibold transition-colors duration-300 hover:text-[#e8381a] whitespace-nowrap"
              style={{ color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}
            >
              All Projects <ArrowRight size={14} />
            </Link>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm px-5 py-2 transition-all duration-300 font-semibold tracking-widest uppercase ${
                  activeCategory === cat
                    ? 'text-white'
                    : 'hover:text-white'
                }`}
                style={{
                  background: activeCategory === cat ? 'var(--accent)' : 'transparent',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'var(--accent)' : 'var(--border)',
                  color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects grid */}
          <div
            ref={featuredRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projectsLoading ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading projects...</p>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div key={project.id} className="project-card-wrap">
                  <ProjectCard project={project} />
                </div>
              ))
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No featured projects yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── DISCIPLINES ── */}
      <section
        className="py-24"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="container-wide">
          <p className="section-label mb-3">What I Do</p>
          <h2
            className="font-display text-white mb-16"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            Three Disciplines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'Videography',
                description:
                  'From corporate events to weddings, documentary shorts to music videos — I shoot with intention, capturing the frame that tells the story.',
                href: '/projects?category=Videography',
              },
              {
                number: '02',
                title: 'Video Editing',
                description:
                  'Color grading, motion graphics, multi-camera cuts, and podcast post-production. Raw footage transformed into polished, emotive content.',
                href: '/projects?category=Editing',
              },
              {
                number: '03',
                title: 'Talent & Presenting',
                description:
                  'On-screen hosting, product presenting, and brand ambassador work. Comfortable in front of the lens as much as behind it.',
                href: '/projects?category=Talent',
              },
            ].map((disc) => (
              <Link
                key={disc.number}
                href={disc.href}
                className="group block p-8 border transition-all duration-400"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--bg-card)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                }}
              >
                <div
                  className="font-display mb-4"
                  style={{ fontSize: '3rem', color: 'var(--accent)', opacity: 0.3 }}
                >
                  {disc.number}
                </div>
                <h3
                  className="text-white font-semibold text-xl mb-4 transition-colors duration-300 group-hover:text-[#e8381a]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {disc.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                  {disc.description}
                </p>
                <div
                  className="flex items-center gap-2 text-sm font-semibold transition-colors duration-300 group-hover:text-[#e8381a]"
                  style={{ color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Explore <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(232,56,26,0.07) 0%, transparent 70%)',
          }}
        />
        <div className="container-wide text-center relative z-10">
          <p className="section-label mb-4">Ready to Create?</p>
          <h2
            className="font-display text-white mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          >
            Let&apos;s Work Together
          </h2>
          <p
            className="text-lg mb-10 max-w-lg mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Have a project in mind? I&apos;d love to hear about it.
          </p>
          <Link href="/contact" className="btn-primary text-base px-10 py-4">
            Get in Touch <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
