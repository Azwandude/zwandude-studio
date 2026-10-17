'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import { getPublishedProjects } from '@/lib/projects';
import type { Project, Category } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const categories: Array<'All' | Category> = ['All', 'Videography', 'Editing', 'Talent'];

function ProjectsContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as Category) || 'All';

  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<'All' | Category>(initialCategory);
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load published projects from Firestore
  useEffect(() => {
    let active = true;

    getPublishedProjects()
      .then((data) => {
        if (active) setProjects(data);
      })
      .catch((error: unknown) => {
        console.error('Failed to load projects:', error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = projects.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Hero animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.querySelectorAll('.hero-item') ?? [], {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.1,
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  // Grid animation (re-runs when results change)
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.from(gridRef.current?.querySelectorAll('.project-card-wrap') ?? [], {
        y: 40, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
      });
    }, gridRef);
    return () => ctx.revert();
  }, [filtered.length, loading]);

  return (
    <div ref={pageRef} style={{ paddingTop: 'var(--nav-height)' }}>
      {/* Page hero */}
      <div
        ref={heroRef}
        className="relative py-20 md:py-28 border-b overflow-hidden"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(232,56,26,0.07) 0%, transparent 70%)' }}
        />
        <div className="container-wide relative z-10">
          <p className="section-label hero-item mb-3">Portfolio</p>
          <h1
            className="font-display text-white hero-item mb-6"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
          >
            Projects
          </h1>
          <p
            className="text-lg max-w-xl hero-item"
            style={{ color: 'var(--text-secondary)' }}
          >
            A curated collection of work across Videography, Editing, and on-screen Talent.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div
        className="sticky top-[72px] z-30 py-4 border-b"
        style={{ borderColor: 'var(--border)', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)' }}
      >
        <div className="container-wide flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-4 py-2 font-semibold tracking-widest uppercase transition-all duration-300 ${
                  activeCategory === cat ? 'text-white' : 'hover:text-white'
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

          {/* Search */}
          <div className="relative sm:ml-auto">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark pl-9 text-sm py-2"
              style={{ width: '200px' }}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container-wide py-16">
        {loading ? (
          <p className="text-sm text-center py-32" style={{ color: 'var(--text-muted)' }}>
            Loading projects...
          </p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-display text-5xl mb-4" style={{ color: 'var(--text-muted)' }}>No Projects</p>
            <p style={{ color: 'var(--text-secondary)' }}>
              No {activeCategory !== 'All' ? activeCategory : ''} projects found yet.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
              Showing {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
            </p>
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((project) => (
                <div key={project.id} className="project-card-wrap">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }} />}>
      <ProjectsContent />
    </Suspense>
  );
}