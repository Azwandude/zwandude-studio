'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { createProject, updateProject, generateSlug } from '@/lib/projects';
import type { Project, Category } from '@/types';
import { ArrowLeft, Upload, X, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

type FormData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

const emptyForm: FormData = {
  title: '',
  slug: '',
  category: 'Videography',
  coverImage: '',
  media: '',
  gallery: [],
  description: '',
  client: '',
  role: '',
  date: new Date().toISOString().split('T')[0],
  tags: [],
  featured: false,
  status: 'draft',
};

interface ProjectFormProps {
  initialData?: FormData & { id?: string };
  mode: 'create' | 'edit';
}

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialData ? { ...emptyForm, ...initialData } : emptyForm);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState<'cover' | 'gallery' | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (val: string) => {
    set('title', val);
    if (mode === 'create') {
      set('slug', generateSlug(val));
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags?.includes(tag)) {
      set('tags', [...(form.tags || []), tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    set('tags', form.tags?.filter((t) => t !== tag));
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileRef = storageRef(storage, path);
      const task = uploadBytesResumable(fileRef, file);
      task.on(
        'state_changed',
        (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        reject,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading('cover');
    setUploadProgress(0);
    try {
      const url = await uploadFile(file, `covers/${Date.now()}_${file.name}`);
      set('coverImage', url);
      toast.success('Cover image uploaded!');
    } catch {
      toast.error('Cover upload failed.');
    } finally {
      setUploading(null);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading('gallery');
    setUploadProgress(0);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const url = await uploadFile(file, `gallery/${Date.now()}_${file.name}`);
        urls.push(url);
      }
      set('gallery', [...(form.gallery || []), ...urls]);
      toast.success(`${urls.length} image(s) uploaded!`);
    } catch {
      toast.error('Gallery upload failed.');
    } finally {
      setUploading(null);
    }
  };

  const removeGalleryImage = (url: string) => {
    set('gallery', form.gallery?.filter((u) => u !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.role || !form.description) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    try {
      if (mode === 'create') {
        await createProject(form);
        toast.success('Project created!');
      } else if (initialData?.id) {
        await updateProject(initialData.id, form);
        toast.success('Project updated!');
      }
      router.push('/studio/dashboard');
    } catch {
      toast.error('Failed to save project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      {/* Back */}
      <Link
        href="/studio/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-white"
        style={{ color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}
      >
        <ArrowLeft size={14} /> Dashboard
      </Link>

      <h1
        className="text-2xl font-bold mb-10"
        style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {mode === 'create' ? 'New Project' : 'Edit Project'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic info */}
        <fieldset
          className="p-6 space-y-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <legend className="section-label mb-2">Basic Info</legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>
                Title <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Project title"
                className="input-dark"
                required
              />
            </div>
            <div>
              <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>
                Slug (URL) <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                placeholder="auto-generated"
                className="input-dark"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>Category</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value as Category)}
                className="input-dark"
              >
                <option value="Videography">Videography</option>
                <option value="Editing">Editing</option>
                <option value="Talent">Talent</option>
              </select>
            </div>
            <div>
              <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className="input-dark"
              />
            </div>
            <div>
              <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>Status</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as 'draft' | 'published')}
                className="input-dark"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>
                My Role <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => set('role', e.target.value)}
                placeholder="e.g. Videographer & Editor"
                className="input-dark"
                required
              />
            </div>
            <div>
              <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>Client (optional)</label>
              <input
                type="text"
                value={form.client || ''}
                onChange={(e) => set('client', e.target.value)}
                placeholder="Client or brand name"
                className="input-dark"
              />
            </div>
          </div>

          <div>
            <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>
              Description <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={6}
              placeholder="Describe the project — context, your role, approach, outcome..."
              className="input-dark resize-y"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Add tag and press Enter"
                className="input-dark flex-1"
              />
              <button type="button" onClick={addTag} className="btn-outline px-4 py-0 text-xs">Add</button>
            </div>
            {(form.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1"
                    style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(232,56,26,0.2)' }}
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${form.featured ? 'bg-[#e8381a]' : 'bg-[#333]'}`}
              onClick={() => set('featured', !form.featured)}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </div>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Featured on homepage
            </span>
          </label>
        </fieldset>

        {/* Media */}
        <fieldset
          className="p-6 space-y-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <legend className="section-label mb-2">Media</legend>

          {/* Cover image */}
          <div>
            <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>Cover Image</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => set('coverImage', e.target.value)}
                placeholder="Paste URL or upload below"
                className="input-dark flex-1"
              />
              <label
                className="btn-outline cursor-pointer px-4 text-xs flex items-center gap-2 whitespace-nowrap"
                style={{ cursor: uploading === 'cover' ? 'wait' : 'pointer' }}
              >
                {uploading === 'cover' ? (
                  <><Loader2 size={13} className="animate-spin" /> {uploadProgress}%</>
                ) : (
                  <><Upload size={13} /> Upload</>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                  disabled={uploading !== null}
                />
              </label>
            </div>
            {form.coverImage && (
              <div className="mt-2 relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.coverImage} alt="Cover preview" className="h-24 object-cover" />
                <button
                  type="button"
                  onClick={() => set('coverImage', '')}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  <X size={10} />
                </button>
              </div>
            )}
          </div>

          {/* Video embed */}
          <div>
            <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>
              Video URL (YouTube / Vimeo embed or direct)
            </label>
            <input
              type="url"
              value={form.media || ''}
              onChange={(e) => set('media', e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              className="input-dark"
            />
          </div>

          {/* Gallery */}
          <div>
            <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>Gallery Images (optional)</label>
            <label
              className="btn-outline cursor-pointer text-xs flex items-center gap-2 w-fit"
              style={{ cursor: uploading === 'gallery' ? 'wait' : 'pointer' }}
            >
              {uploading === 'gallery' ? (
                <><Loader2 size={13} className="animate-spin" /> Uploading... {uploadProgress}%</>
              ) : (
                <><Upload size={13} /> Upload Gallery Images</>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryUpload}
                disabled={uploading !== null}
              />
            </label>
            {(form.gallery || []).length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-3">
                {form.gallery?.map((url) => (
                  <div key={url} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="Gallery" className="w-full aspect-video object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(url)}
                      className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full text-white"
                      style={{ background: 'rgba(0,0,0,0.7)' }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </fieldset>

        {/* Submit */}
        <div className="flex gap-4 pb-10">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <><Loader2 size={15} className="animate-spin" /> Saving...</>
            ) : (
              <><CheckCircle size={15} /> {mode === 'create' ? 'Create Project' : 'Save Changes'}</>
            )}
          </button>
          <Link href="/studio/dashboard" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
