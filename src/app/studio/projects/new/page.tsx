'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProjectForm from '@/components/ProjectForm';

export default function NewProjectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/studio');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen">
      {/* Admin mini-header */}
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
          Studio · New Project
        </span>
      </div>
      <ProjectForm mode="create" />
    </div>
  );
}
