/**
 * lib/posts.ts
 *
 * Uses Supabase JS client table operations directly.
 * The project restart (pause/restore) refreshed PostgREST's schema cache,
 * so direct table access now recognises all columns including key_idea.
 */
import { createAdminClient } from './supabase';
import { Post, PostInput, PostStatus } from './types';

// ─── Row → Post mapper ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPost(row: Record<string, any>): Post {
  return {
    id:          row.id as string,
    title:       row.title as string,
    subtitle:    (row.subtitle as string) || undefined,
    slug:        row.slug as string,
    keyIdea:     row.key_idea as string,
    content:     row.content as string,
    coverImage:  (row.cover_image as string) || undefined,
    tags:        (row.tags as string[]) || [],
    weekNumber:  row.week_number as number,
    status:      row.status as PostStatus,
    publishedAt: (row.published_at as string) || undefined,
    createdAt:   row.created_at as string,
    updatedAt:   row.updated_at as string,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
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
      .order('published_at', { ascending: false });
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
      .single();
    if (error) {
      if (error.code === 'PGRST116') return undefined; // no rows
      throw error;
    }
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
      .single();
    if (error) {
      if (error.code === 'PGRST116') return undefined; // no rows
      throw error;
    }
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
      title:        input.title,
      subtitle:     input.subtitle     || null,
      slug:         input.slug,
      key_idea:     input.keyIdea,
      content:      input.content,
      cover_image:  input.coverImage   || null,
      tags:         input.tags         || [],
      week_number:  input.weekNumber   ?? 1,
      status:       input.status       || 'DRAFT',
      published_at: input.publishedAt  || null,
    })
    .select()
    .single();
  if (error) throw new Error(`[createPost] ${error.message}`);
  return rowToPost(data);
}

export async function updatePost(
  id: string,
  input: Partial<PostInput>,
): Promise<Post | null> {
  try {
    const supabase = createAdminClient();

    // Build update object with only the provided fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {};
    if (input.title        !== undefined) updates.title        = input.title;
    if (input.subtitle     !== undefined) updates.subtitle     = input.subtitle     ?? null;
    if (input.slug         !== undefined) updates.slug         = input.slug;
    if (input.keyIdea      !== undefined) updates.key_idea     = input.keyIdea;
    if (input.content      !== undefined) updates.content      = input.content;
    if (input.coverImage   !== undefined) updates.cover_image  = input.coverImage   ?? null;
    if (input.tags         !== undefined) updates.tags         = input.tags;
    if (input.weekNumber   !== undefined) updates.week_number  = input.weekNumber;
    if (input.status       !== undefined) updates.status       = input.status;
    if (input.publishedAt  !== undefined) updates.published_at = input.publishedAt  ?? null;

    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    if (!data) return null;
    return rowToPost(data);
  } catch (err) {
    console.error('[posts] updatePost error:', err);
    return null;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[posts] deletePost error:', err);
    return false;
  }
}
