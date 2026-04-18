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
  const { data, error } = await supabase.rpc('fn_create_post', {
    p_title:        input.title,
    p_subtitle:     input.subtitle     || null,
    p_slug:         input.slug,
    p_key_idea:     input.keyIdea,
    p_content:      input.content,
    p_cover_image:  input.coverImage   || null,
    p_tags:         input.tags         || [],
    p_week_number:  input.weekNumber   ?? 1,
    p_status:       input.status       || 'DRAFT',
    p_published_at: input.publishedAt  || null,
  });
  if (error) throw new Error(`[createPost] ${error.message}`);
  return rowToPost((data as Record<string, unknown>[])[0]);
}

export async function updatePost(
  id: string,
  input: Partial<PostInput>,
): Promise<Post | null> {
  try {
    // First fetch current post to fill any missing fields
    const current = await getPostById(id);
    if (!current) return null;
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc('fn_update_post', {
      p_id:           id,
      p_title:        input.title        ?? current.title,
      p_subtitle:     input.subtitle     ?? current.subtitle     ?? null,
      p_slug:         input.slug         ?? current.slug,
      p_key_idea:     input.keyIdea      ?? current.keyIdea,
      p_content:      input.content      ?? current.content,
      p_cover_image:  input.coverImage   ?? current.coverImage   ?? null,
      p_tags:         input.tags         ?? current.tags         ?? [],
      p_week_number:  input.weekNumber   ?? current.weekNumber,
      p_status:       input.status       ?? current.status,
      p_published_at: input.publishedAt  ?? current.publishedAt  ?? null,
    });
    if (error) { console.error('[posts] updatePost error:', error); return null; }
    if (!data || !(data as Record<string, unknown>[]).length) return null;
    return rowToPost((data as Record<string, unknown>[])[0]);
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
