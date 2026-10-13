'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ArrowLeft, ArrowRight, Calendar, User, Building2, Tag } from 'lucide-react';
import type { Project } from '@/types';

// Demo data
const demoProjects: Project[] = [
  {
    id: '1', title: 'Penang Vlog', slug: 'penang-vlog',
    category: 'Videography', coverImage: '', media: 'https://www.youtube.com/watch?v=mngh1o5YSbw',
    description: 'A cinematic and energetic Vlog series that captures the essence of Penang\'s culture, food, and lifestyle for a corporate client. The series was designed to engage viewers with dynamic storytelling, showcasing the vibrant street life, local cuisine, and cultural landmarks of Penang.',
    client: 'Corporate Client (NDA)', role: 'Videographer & Director', date: '2025-04-01',
    tags: ['corporate', 'event', 'festive'], featured: true, status: 'published',
  },
  {
    id: '2', title: 'Podcast Documentary', slug: 'podcast-documentary',
    category: 'Videography', coverImage: '', media: 'https://www.youtube.com/watch?v=kc_SXf7etUE',
    description: 'A sad podcast that capture the truth of retirement of acting and the struggles behind the scenes of a famous actor in Malaysia Wan Maimunah. The documentary-style podcast explores the emotional journey of the actor, highlighting the challenges faced in the entertainment industry and the personal sacrifices made throughout their career.',
    client: 'Private Client', role: 'Videographer & Editor', date: '2025-02-14',
    tags: ['wedding', 'cinematic', 'emotional'], featured: true, status: 'published',
  },
  {
    id: '3', title: 'Convocation | Long call ', slug: 'convocation-long-call',
    category: 'Editing', coverImage: '', media: 'https://www.youtube.com/watch?v=w49l2pKyKwY',
    description: 'Multi-camera podcast editing for a growing local creator — complete with color grading, lower thirds, intro/outro animations, and audio mastering. Delivered a 12-episode series ready for YouTube and Spotify.',
    client: 'Local Creator', role: 'Video Editor', date: '2025-01-10',
    tags: ['podcast', 'editing', 'post-production'], featured: true, status: 'published',
  },
  {
    id: '4', title: 'Brand Ambassador Feature', slug: 'brand-ambassador-feature',
    category: 'Talent', coverImage: '',
    description: 'On-screen hosting and presenting for a tech product launch event. The campaign required a presenter who could communicate technical product features in an engaging, approachable way — bridging the gap between the engineering team\'s language and the consumer audience.',
    client: 'Tech Brand', role: 'Host & Presenter', date: '2024-12-01',
    tags: ['hosting', 'presenting', 'tech'], featured: false, status: 'published',
  },
  {
    id: '5', title: 'Travel Documentary Short', slug: 'travel-documentary-short',
    category: 'Videography', coverImage: '', media: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'A short-form travel documentary exploring hidden gems across Peninsular Malaysia. Shot entirely handheld with intentional verité style to maintain authenticity and immersion.',
    role: 'Videographer & Editor', date: '2024-10-20',
    tags: ['travel', 'documentary', 'Malaysia'], featured: false, status: 'published',
  },
  {
    id: '6', title: 'Social Media Content Series', slug: 'social-media-content-series',
    category: 'Editing', coverImage: '',
    description: 'A 10-part short-form video series optimized for Instagram Reels and TikTok for a Malaysian fashion brand. Each episode was edited for maximum retention with pattern interrupts, subtitles, and platform-specific aspect ratios.',
    client: 'Fashion Brand', role: 'Video Editor', date: '2024-09-15',
    tags: ['social media', 'reels', 'fashion'], featured: false, status: 'published',
  },
];

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';

  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [prevProject, setPrevProject] = useState<Project | null>(null);

  useEffect(() => {
    const idx = demoProjects.findIndex((p) => p.slug === slug);
    if (idx === -1) {
      router.push('/projects');
      return;
    }
    setProject(demoProjects[idx]);
    setNextProject(demoProjects[idx + 1] || demoProjects[0]);
    setPrevProject(demoProjects[idx - 1] || demoProjects[demoProjects.length - 1]);
  }, [slug, router]);

  useEffect(() => {
    if (!project) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(heroRef.current, { scale: 1.05, duration: 1.2, ease: 'power3.out' })
        .from(titleRef.current, { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.8')
        .from(contentRef.current?.querySelectorAll('.content-item') ?? [], {
          y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        }, '-=0.4');
    }, pageRef);
    return () => ctx.revert();
  }, [project]);

  if (!project) {
    return (
      <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="font-display text-4xl" style={{ color: 'var(--text-muted)' }}>Loading...</div>
      </div>
    );
  }

  const embedUrl = project.media ? getYouTubeEmbedUrl(project.media) : '';

  return (
    <div ref={pageRef} style={{ paddingTop: 'var(--nav-height)' }}>
      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden"
        style={{ height: '65vh', minHeight: '400px', background: 'var(--bg-card)' }}
      >
        <div ref={heroRef} className="absolute inset-0">
          {project.coverImage ? (
            <Image src={project.coverImage} alt={project.title} fill className="object-cover" priority />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)' }}
            >
              <span className="font-display" style={{ fontSize: '20vw', color: 'rgba(232,56,26,0.08)' }}>
                {project.title[0]}
              </span>
            </div>
          )}
        </div>
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.2) 100%)' }}
        />
        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 container-wide pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge">{project.category}</span>
            {project.tags?.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5" style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.06)' }}>
                {tag}
              </span>
            ))}
          </div>
          <h1
            ref={titleRef}
            className="font-display text-white"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
          >
            {project.title}
          </h1>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div ref={contentRef} className="container-wide py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Back link */}
            <Link
              href="/projects"
              className="content-item inline-flex items-center gap-2 text-sm transition-colors duration-300 hover:text-white"
              style={{ color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <ArrowLeft size={14} /> Back to Projects
            </Link>

            {/* Video embed */}
            {embedUrl && (
              <div className="content-item">
                <div className="video-container rounded-none overflow-hidden" style={{ borderRadius: 0 }}>
                  <iframe
                    src={embedUrl}
                    title={project.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="content-item space-y-4">
              <p className="section-label">About This Project</p>
              {project.description.split('\n\n').map((para, i) => (
                <p key={i} className="leading-relaxed text-base" style={{ color: 'var(--text-secondary)' }}>
                  {para}
                </p>
              ))}
            </div>

            {/* Gallery (placeholder) */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="content-item">
                <p className="section-label mb-4">Gallery</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.gallery.map((img, i) => (
                    <div key={i} className="relative aspect-video overflow-hidden" style={{ background: 'var(--bg-card)' }}>
                      <Image src={img} alt={`${project.title} gallery ${i + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — project details */}
          <div className="space-y-6">
            <div
              className="content-item p-6 space-y-6"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p className="section-label">Project Details</p>
              <hr className="divider" />

              {project.client && (
                <div className="flex items-start gap-3">
                  <Building2 size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Client</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{project.client}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <User size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>My Role</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{project.role}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Date</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {new Date(project.date).toLocaleDateString('en-MY', { year: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>

              {project.tags && project.tags.length > 0 && (
                <div className="flex items-start gap-3">
                  <Tag size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1"
                          style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(232,56,26,0.2)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="content-item">
              <Link href="/contact" className="btn-primary w-full justify-center">
                Hire Me for a Similar Project
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── NEXT/PREV NAVIGATION ── */}
      <div className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-2">
          {prevProject && (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group p-8 border-r flex items-center gap-4 transition-colors duration-300 hover:bg-white/2"
              style={{ borderColor: 'var(--border)' }}
            >
              <ArrowLeft size={20} style={{ color: 'var(--text-muted)' }} />
              <div>
                <p className="section-label mb-1">Previous</p>
                <p className="text-sm font-medium transition-colors duration-300 group-hover:text-[#e8381a]" style={{ color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {prevProject.title}
                </p>
              </div>
            </Link>
          )}
          {nextProject && (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group p-8 flex items-center justify-end gap-4 ml-auto w-full transition-colors duration-300 hover:bg-white/2"
            >
              <div className="text-right">
                <p className="section-label mb-1">Next</p>
                <p className="text-sm font-medium transition-colors duration-300 group-hover:text-[#e8381a]" style={{ color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {nextProject.title}
                </p>
              </div>
              <ArrowRight size={20} style={{ color: 'var(--text-muted)' }} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
