'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ArrowLeft, ArrowRight, Calendar, User, Building2, Tag } from 'lucide-react';
import type { Project } from '@/types';
import { getProjectBySlug, getPublishedProjects } from '@/lib/projects';

function parseVideoUrl(url: string): { embedUrl: string; isShort: boolean } {
  if (!url) return { embedUrl: '', isShort: false };

  // Already an embed link
  if (url.includes('youtube.com/embed/') || url.includes('player.vimeo.com/')) {
    return { embedUrl: url, isShort: false };
  }

  // YouTube Shorts
  const shortsMatch = url.match(/youtube\.com\/shorts\/([\w-]+)/);
  if (shortsMatch) {
    return { embedUrl: `https://www.youtube.com/embed/${shortsMatch[1]}`, isShort: true };
  }

  // Normal YouTube: watch?v=, youtu.be/, live/
  const ytMatch = url.match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/live\/)([\w-]+)/);
  if (ytMatch) {
    return { embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`, isShort: false };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return { embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`, isShort: false };
  }

  return { embedUrl: url, isShort: false };
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
  const [loadError, setLoadError] = useState<string | null>(null);

  // inside the component, replace the first useEffect:
const [notFound, setNotFound] = useState(false);

useEffect(() => {
  let active = true;
  getPublishedProjects()
    .then((all) => {
      if (!active) return;
      const idx = all.findIndex((p) => p.slug === slug);
      if (idx === -1) {
        setNotFound(true);
        return;
      }
      setProject(all[idx]);
      setNextProject(all[idx + 1] || all[0]);
      setPrevProject(all[idx - 1] || all[all.length - 1]);
    })
    .catch((err) => {
      console.error(err);
      if (active) setNotFound(true);
    });
  return () => { active = false; };
}, [slug]);

useEffect(() => {
  if (notFound) router.push('/projects');
}, [notFound, router]);
    if (loadError) {
    return (
      <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }} className="container-wide py-20">
        <p style={{ color: 'var(--accent)' }}>Error: {loadError}</p>
      </div>
    );
  }
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

const { embedUrl, isShort } = project.media
  ? parseVideoUrl(project.media)
  : { embedUrl: '', isShort: false };
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
    {isShort ? (
      <div
        className="mx-auto overflow-hidden"
        style={{ aspectRatio: '9 / 16', maxWidth: '360px', background: '#000' }}
      >
        <iframe
          src={embedUrl}
          title={project.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    ) : (
      <div className="video-container rounded-none overflow-hidden" style={{ borderRadius: 0 }}>
        <iframe
          src={embedUrl}
          title={project.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )}
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
