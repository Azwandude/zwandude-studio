'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAllProjects, deleteProject } from '@/lib/projects';
import type { Project } from '@/types';
import {
  Plus, LogOut, Edit2, Trash2, Eye, EyeOff,
  Home, Film, CheckCircle, Clock, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/studio');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    setFetching(true);
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch {
      toast.error('Failed to load projects.');
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success(`"${title}" deleted.`);
    } catch {
      toast.error('Failed to delete project.');
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/studio');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-display text-3xl" style={{ color: 'var(--text-muted)' }}>Loading...</div>
      </div>
    );
  }

  const published = projects.filter((p) => p.status === 'published').length;
  const drafts = projects.filter((p) => p.status === 'draft').length;

  return (
    <div className="min-h-screen">
      {/* Admin header */}
      <header
        className="sticky top-0 z-50 border-b px-6 py-4 flex items-center justify-between"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-8 h-8 flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'var(--accent)', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            ZS
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
              Studio Dashboard
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs transition-colors duration-200 hover:text-white"
            style={{ color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            <ExternalLink size={13} /> View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs transition-colors duration-200 hover:text-[#e8381a]"
            style={{ color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </header>

      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Film, label: 'Total Projects', value: projects.length, color: 'var(--accent)' },
            { icon: CheckCircle, label: 'Published', value: published, color: '#22c55e' },
            { icon: Clock, label: 'Drafts', value: drafts, color: '#f59e0b' },
            { icon: Home, label: 'Featured', value: projects.filter((p) => p.featured).length, color: '#60a5fa' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="p-5 border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <Icon size={18} className="mb-2" style={{ color }} />
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                {value}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-bold"
            style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            All Projects
          </h2>
          <Link href="/studio/projects/new" className="btn-primary text-sm px-5 py-2.5">
            <Plus size={15} /> New Project
          </Link>
        </div>

        {/* Projects table */}
        {fetching ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Loading projects...</div>
        ) : projects.length === 0 ? (
          <div
            className="text-center py-20 border"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
          >
            <Film size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>No projects yet</p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Add your first project to started.</p>
            <Link href="/studio/projects/new" className="btn-primary">
              <Plus size={15} /> Add Project
            </Link>
          </div>
        ) : (
          <div
            className="border overflow-hidden"
            style={{ borderColor: 'var(--border)' }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                  {['Title', 'Category', 'Status', 'Featured', 'Date', 'Actions'].map((col) => (
                    <th
                      key={col}
                      className="text-left text-xs font-semibold px-5 py-4 uppercase tracking-widest"
                      style={{ color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((project, i) => (
                  <tr
                    key={project.id}
                    className="transition-colors duration-200 hover:bg-white/2"
                    style={{
                      borderBottom: i < projects.length - 1 ? `1px solid var(--border)` : 'none',
                      background: 'transparent',
                    }}
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {project.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>/{project.slug}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="badge" style={{ fontSize: '0.65rem' }}>{project.category}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs px-2.5 py-1 font-semibold"
                        style={{
                          background: project.status === 'published' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                          color: project.status === 'published' ? '#22c55e' : '#f59e0b',
                          border: `1px solid ${project.status === 'published' ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
                        }}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {project.featured ? (
                        <CheckCircle size={16} style={{ color: '#22c55e' }} />
                      ) : (
                        <span className="w-4 h-4 block rounded-full" style={{ background: 'var(--border)' }} />
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(project.date).toLocaleDateString('en-MY', { year: 'numeric', month: 'short' })}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          className="p-1.5 transition-colors duration-200 hover:text-white"
                          style={{ color: 'var(--text-muted)' }}
                          title="Preview"
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          href={`/studio/projects/${project.id}/edit`}
                          className="p-1.5 transition-colors duration-200 hover:text-[#e8381a]"
                          style={{ color: 'var(--text-muted)' }}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          disabled={deleting === project.id}
                          className="p-1.5 transition-colors duration-200 hover:text-red-400"
                          style={{ color: 'var(--text-muted)' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
