'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import type { Project, Category } from '@/types';

gsap.registerPlugin(ScrollTrigger);

// Demo projects (same data used in home)
const demoProjects: Project[] = [
  {
    id: '1', title: 'Penang Vlog', slug: 'penang-vlog',
    category: 'Videography', coverImage: '', media: 'https://www.youtube.com/watch?v=mngh1o5YSbw',
    description: 'A Vlog series that captures the essence of Penang\'s culture, food, and lifestyle for a corporate client.',
    client: 'Content Creator Client', role: 'Videographer & Director', date: '2025-04-01',
    tags: ['corporate', 'event'], featured: true, status: 'published',
  },
  {
    id: '2', title: 'Podcast Documentary', slug: 'podcast-documentary',
    category: 'Videography', coverImage: '', media: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'A sad podcast that capture the truth of retirement of acting and the struggles behind the scenes of a famous actor in Malaysia Wan Maimunah.',
    client: 'Private Client', role: 'Videographer & Editor', date: '2025-02-14',
    tags: ['wedding', 'cinematic'], featured: true, status: 'published',
  },
  {
    id: '3', title: 'Convocation | Long call ', slug: 'convocation-long-call',
    category: 'Editing', coverImage: '', media: 'https://www.youtube.com/watch?v=w49l2pKyKwY',
    description: 'Multi-camera podcast editing with color grading, motion graphics, and audio mixing.',
    client: 'Local Creator', role: 'Video Editor', date: '2025-01-10',
    tags: ['podcast', 'editing'], featured: true, status: 'published',
  },
  {
    id: '4', title: 'Brand Ambassador Feature', slug: 'brand-ambassador-feature',
    category: 'Talent', coverImage: '',
    description: 'On-screen hosting and presenting for a tech product launch event.',
    client: 'Tech Brand', role: 'Host & Presenter', date: '2024-12-01',
    tags: ['hosting', 'presenting'], featured: false, status: 'published',
  },
  {
    id: '5', title: 'Travel Documentary Short', slug: 'travel-documentary-short',
    category: 'Videography', coverImage: '', media: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'A short-form travel documentary exploring hidden gems across Peninsular Malaysia.',
    role: 'Videographer & Editor', date: '2024-10-20',
    tags: ['travel', 'documentary'], featured: false, status: 'published',
  },
  {
    id: '6', title: 'Social Media Content Series', slug: 'social-media-content-series',
    category: 'Editing', coverImage: '',
    description: 'A 10-part short-form video series optimized for Instagram Reels and TikTok.',
    client: 'Fashion Brand', role: 'Video Editor', date: '2024-09-15',
    tags: ['social media', 'reels'], featured: false, status: 'published',
  },
  {
    id: '7', title: 'Product Unboxing Presenter', slug: 'product-unboxing-presenter',
    category: 'Talent', coverImage: '',
    description: 'Hosted and presented an e-commerce product line for a lifestyle brand campaign.',
    client: 'Lifestyle Brand', role: 'Presenter', date: '2024-08-01',
    tags: ['hosting', 'e-commerce'], featured: false, status: 'published',
  },
  {
    id: '8', title: 'Music Video Direction', slug: 'music-video-direction',
    category: 'Videography', coverImage: '', media: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Directed and shot a cinematic music video for an indie Malaysian artist.',
    client: 'Indie Artist', role: 'Director & Videographer', date: '2024-06-10',
    tags: ['music video', 'cinematic'], featured: false, status: 'published',
  },
  {
    id: '9', title: 'Documentary Feature Edit', slug: 'documentary-feature-edit',
    category: 'Editing', coverImage: '',
    description: 'Full post-production edit for a 25-minute documentary on Malaysian heritage crafts.',
    client: 'Cultural Foundation', role: 'Editor', date: '2024-04-20',
    tags: ['documentary', 'heritage'], featured: false, status: 'published',
  },
];

const categories: Array<'All' | Category> = ['All', 'Videography', 'Editing', 'Talent'];

function ProjectsContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as Category) || 'All';

  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<'All' | Category>(initialCategory);
  const [search, setSearch] = useState('');
  const [projects] = useState<Project[]>(demoProjects);

  const filtered = projects.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.querySelectorAll('.hero-item') ?? [], {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.1,
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(gridRef.current?.querySelectorAll('.project-card-wrap') ?? [], {
        y: 40, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
      });
    }, gridRef);
    return () => ctx.revert();
  }, [filtered.length]);

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
      <div className="sticky top-[72px] z-30 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)' }}>
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
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
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
        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-display text-5xl mb-4" style={{ color: 'var(--text-muted)' }}>No Projects</p>
            <p style={{ color: 'var(--text-secondary)' }}>No {activeCategory !== 'All' ? activeCategory : ''} projects found yet.</p>
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
