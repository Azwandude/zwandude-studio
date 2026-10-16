// Firestore data access layer for Projects

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Project, Category } from '@/types';

const COLLECTION = 'projects';

function fromFirestore(id: string, data: Record<string, unknown>): Project {
  return {
    id,
    title: (data.title as string) || '',
    slug: (data.slug as string) || '',
    category: (data.category as Category) || 'Videography',
    coverImage: (data.coverImage as string) || '',
    media: data.media as string | undefined,
    gallery: (data.gallery as string[]) || [],
    description: (data.description as string) || '',
    client: data.client as string | undefined,
    role: (data.role as string) || '',
    date: (data.date as string) || '',
    tags: (data.tags as string[]) || [],
    featured: Boolean(data.featured),
    status: (data.status as 'draft' | 'published') || 'draft',
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : undefined,
  };
}

// Public: get all published projects
export async function getPublishedProjects(): Promise<Project[]> {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', 'published')
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => fromFirestore(d.id, d.data() as Record<string, unknown>))
    .sort((a, b) => b.date.localeCompare(a.date));
}

// Public: get published projects by category
export async function getProjectsByCategory(category: Category): Promise<Project[]> {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', 'published'),
    where('category', '==', category),
    orderBy('date', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromFirestore(d.id, d.data() as Record<string, unknown>));
}

// Public: get featured projects for home page
export async function getFeaturedProjects(): Promise<Project[]> {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', 'published'),
    where('featured', '==', true),
    orderBy('date', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromFirestore(d.id, d.data() as Record<string, unknown>));
}

// Public: get project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const q = query(
    collection(db, COLLECTION),
    where('slug', '==', slug),
    where('status', '==', 'published')
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return fromFirestore(d.id, d.data() as Record<string, unknown>);
}

// Admin: get all projects (draft + published)
export async function getAllProjects(): Promise<Project[]> {
  const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromFirestore(d.id, d.data() as Record<string, unknown>));
}

// Admin: get single project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return fromFirestore(snap.id, snap.data() as Record<string, unknown>);
}

// Admin: create project
export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// Admin: update project
export async function updateProject(id: string, data: Partial<Omit<Project, 'id'>>): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

// Admin: delete project
export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

// Utility: generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
