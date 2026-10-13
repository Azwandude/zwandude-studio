'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, { scale: 1.07, duration: 0.6, ease: 'power2.out' });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.4 });
    gsap.to(contentRef.current, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, { scale: 1, duration: 0.6, ease: 'power2.out' });
    gsap.to(overlayRef.current, { opacity: 0.7, duration: 0.4 });
    gsap.to(contentRef.current, { y: 10, opacity: 0.8, duration: 0.4, ease: 'power2.out' });
  };

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block group"
      aria-label={`View project: ${project.title}`}
    >
      <div
        ref={cardRef}
        className="relative overflow-hidden card-glow cursor-pointer"
        style={{ aspectRatio: '16/10', background: 'var(--bg-card)' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Cover image */}
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={false}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'var(--bg-card)' }}
            >
              <span className="text-6xl font-display text-white/10">{project.title[0]}</span>
            </div>
          )}
        </div>

        {/* Gradient overlay */}
        <div
          ref={overlayRef}
          className="card-overlay"
          style={{ opacity: 0.7 }}
        />

        {/* Content */}
        <div
          ref={contentRef}
          className="absolute bottom-0 left-0 right-0 p-5"
          style={{ opacity: 0.8, transform: 'translateY(10px)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="badge" style={{ fontSize: '0.65rem' }}>{project.category}</span>
            {project.tags?.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-sm"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3
            className="text-white font-semibold text-lg leading-tight mb-1"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {project.title}
          </h3>
          {project.client && (
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {project.client}
            </p>
          )}
        </div>

        {/* Play icon for video projects */}
        {project.media && (
          <div className="absolute top-4 right-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm opacity-90 transition-opacity group-hover:opacity-100"
              style={{ background: 'rgba(232, 56, 26, 0.85)' }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Below-card meta */}
      <div className="mt-3 px-1">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {new Date(project.date).getFullYear()} · {project.role}
        </p>
      </div>
    </Link>
  );
}
