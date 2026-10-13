'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProjectById } from '@/lib/projects';
import ProjectForm from '@/components/ProjectForm';
import type { Project } from '@/types';

export default function EditProjectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

  const [project, setProject] = useState<Project | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/studio');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && id) {
      getProjectById(id).then((p) => {
        setProject(p);
        setFetching(false);
      });
    }
  }, [user, id]);

  if (loading || !user || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-display text-3xl" style={{ color: 'var(--text-muted)' }}>Loading...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-display text-3xl" style={{ color: 'var(--text-muted)' }}>Project not found.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div
        className="border-b px-6 py-3 flex items-center gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div
          className="w-7 h-7 flex items-center justify-center text-white text-xs font-bold"
          style={{ background: 'var(--accent)', fontFamily: 'Space Grotesk, sans-serif' }}
        >
          ZS
        </div>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
          Studio · Edit Project
        </span>
      </div>
      <ProjectForm
        mode="edit"
        initialData={{ ...project, id: project.id }}
      />
    </div>
  );
}
