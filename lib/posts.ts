import { createAdminClient } from './supabase';
import { Post, PostInput, PostStatus } from './types';

// ─── Row → Post mapper ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPost(row: Record<string, any>): Post {
  return {
    id: row.id as string,
    title: row.title as string,
    subtitle: (row.subtitle as string) || undefined,
    slug: row.slug as string,
    keyIdea: row.key_idea as string,
    content: row.content as string,
    coverImage: (row.cover_image as string) || undefined,
    tags: (row.tags as string[]) || [],
    weekNumber: row.week_number as number,
    status: row.status as PostStatus,
    publishedAt: (row.published_at as string) || undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ─── Post → DB row mapper ────────────────────────────────────────────────────

function postInputToRow(input: Partial<PostInput>) {
  const row: Record<string, unknown> = {};
  if (input.title !== undefined) row.title = input.title;
  if (input.subtitle !== undefined) row.subtitle = input.subtitle || null;
  if (input.slug !== undefined) row.slug = input.slug;
  if (input.keyIdea !== undefined) row.key_idea = input.keyIdea;
  if (input.content !== undefined) row.content = input.content;
  if (input.coverImage !== undefined) row.cover_image = input.coverImage || null;
  if (input.tags !== undefined) row.tags = input.tags;
  if (input.weekNumber !== undefined) row.week_number = input.weekNumber;
  if (input.status !== undefined) row.status = input.status;
  if (input.publishedAt !== undefined) row.published_at = input.publishedAt || null;
  return row;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('week_number', { ascending: false });

  if (error) {
    console.error('[posts] getAllPosts error:', error.message);
    return [];
  }
  return (data ?? []).map(rowToPost);
}

export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'PUBLISHED')
    .order('week_number', { ascending: false });

  if (error) {
    console.error('[posts] getPublishedPosts error:', error.message);
    return [];
  }
  return (data ?? []).map(rowToPost);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return undefined;
  return rowToPost(data);
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;
  return rowToPost(data);
}

export async function createPost(input: PostInput): Promise<Post> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const row = {
    ...postInputToRow(input),
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from('posts')
    .insert(row)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`[posts] createPost error: ${error?.message ?? 'no data returned'}`);
  }
  return rowToPost(data);
}

export async function updatePost(id: string, input: Partial<PostInput>): Promise<Post | null> {
  const supabase = createAdminClient();
  const row = {
    ...postInputToRow(input),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('posts')
    .update(row)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return rowToPost(data);
}

export async function deletePost(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  return !error;
}
