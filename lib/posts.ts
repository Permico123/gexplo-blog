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

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('week_number', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToPost);
  } catch (err) {
    console.error('[posts] getAllPosts error:', err);
    return [];
  }
}

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('week_number', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToPost);
  } catch (err) {
    console.error('[posts] getPublishedPosts error:', err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return undefined;
    return rowToPost(data);
  } catch (err) {
    console.error('[posts] getPostBySlug error:', err);
    return undefined;
  }
}

export async function getPostById(id: string): Promise<Post | undefined> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return undefined;
    return rowToPost(data);
  } catch (err) {
    console.error('[posts] getPostById error:', err);
    return undefined;
  }
}

export async function createPost(input: PostInput): Promise<Post> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: input.title,
      subtitle: input.subtitle || null,
      slug: input.slug,
      key_idea: input.keyIdea,
      content: input.content,
      cover_image: input.coverImage || null,
      tags: input.tags || [],
      week_number: input.weekNumber ?? 1,
      status: input.status || 'DRAFT',
      published_at: input.publishedAt || null,
    })
    .select()
    .single();
  if (error) throw new Error(`[posts] createPost error: ${error.message}`);
  return rowToPost(data);
}

export async function updatePost(
  id: string,
  input: Partial<PostInput>,
): Promise<Post | null> {
  const supabase = createAdminClient();

  // Build only the fields that were actually supplied
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patch: Record<string, any> = { updated_at: new Date().toISOString() };

  if (input.title      !== undefined) patch.title       = input.title;
  if (input.subtitle   !== undefined) patch.subtitle    = input.subtitle   || null;
  if (input.slug       !== undefined) patch.slug        = input.slug;
  if (input.keyIdea    !== undefined) patch.key_idea    = input.keyIdea;
  if (input.content    !== undefined) patch.content     = input.content;
  if (input.coverImage !== undefined) patch.cover_image = input.coverImage || null;
  if (input.tags       !== undefined) patch.tags        = input.tags;
  if (input.weekNumber !== undefined) patch.week_number = input.weekNumber;
  if (input.status     !== undefined) patch.status      = input.status;
  if (input.publishedAt !== undefined) patch.published_at = input.publishedAt || null;

  const { data, error } = await supabase
    .from('posts')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[posts] updatePost error:', error);
    return null;
  }
  return rowToPost(data);
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[posts] deletePost error:', err);
    return false;
  }
}
