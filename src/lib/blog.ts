import { supabase } from './supabase';
import { type PostCategory, POST_CATEGORIES } from './constants';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published';
  author: string;
  category: PostCategory;
}

export async function getAllPosts(options: { status?: 'draft' | 'published' } = {}) {
  const query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (options.status) {
    query.eq('status', options.status);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data as Post[];
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    throw error;
  }

  return data as Post;
}

export async function getPostById(id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data as Post;
}

export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('posts')
    .insert([post])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Post;
}

export async function updatePost(id: string, post: Partial<Post>) {
  const { data, error } = await supabase
    .from('posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Post;
}

export async function deletePost(id: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
