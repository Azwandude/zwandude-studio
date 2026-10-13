// Project types and interfaces

export type Category = 'Videography' | 'Editing' | 'Talent';
export type ProjectStatus = 'draft' | 'published';

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: Category;
  coverImage: string;
  media?: string; // YouTube/Vimeo embed URL or direct video URL
  gallery?: string[]; // Array of image URLs
  description: string;
  client?: string;
  role: string;
  date: string; // ISO date string
  tags?: string[];
  featured: boolean;
  status: ProjectStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
