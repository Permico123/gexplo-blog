/**
 * lib/posts.ts
 *
 * All database operations go through PostgreSQL stored functions called via
 * PostgREST RPC (/rest/v1/rpc/<fn>).  This bypasses PostgREST's table-schema
 * cache entirely, so the persistent "Could not find 'key_idea' in schema cache"
 * error can never surface here.
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Call an RPC function and return typed data or throw. */
async function rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw new Error(`[rpc:${fn}] ${error.message}`);
  return data as T;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  try {
    const rows = await rpc<Record<string, unknown>[]>('fn_get_all_posts');
    return (rows ?? []).map(rowToPost);
  } catch (err) {
    console.error('[posts] getAllPosts error:', err);
    return [];
  }
}

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const rows = await rpc<Record<string, unknown>[]>('fn_get_published_posts');
    return (rows ?? []).map(rowToPost);
  } catch (err) {
    console.error('[posts] getPublishedPosts error:', err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const row = await rpc<Record<string, unknown> | null>('fn_get_post_by_slug', { p_slug: slug });
    if (!row) return undefined;
    return rowToPost(row);
  } catch (err) {
    console.error('[posts] getPostBySlug error:', err);
    return undefined;
  }
}

export async function getPostById(id: string): Promise<Post | undefined> {
  try {
    const row = await rpc<Record<string, unknown> | null>('fn_get_post_by_id', { p_id: id });
    if (!row) return undefined;
    return rowToPost(row);
  } catch (err) {
    console.error('[posts] getPostById error:', err);
    return undefined;
  }
}

export async function createPost(input: PostInput): Promise<Post> {
  const row = await rpc<Record<string, unknown>>('fn_create_post', {
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
  return rowToPost(row);
}

export async function updatePost(
  id: string,
  input: Partial<PostInput>,
): Promise<Post | null> {
  try {
    const row = await rpc<Record<string, unknown> | null>('fn_update_post', {
      p_id:           id,
      p_title:        input.title        ?? null,
      p_subtitle:     input.subtitle     ?? null,
      p_slug:         input.slug         ?? null,
      p_key_idea:     input.keyIdea      ?? null,
      p_content:      input.content      ?? null,
      p_cover_image:  input.coverImage   ?? null,
      p_tags:         input.tags         ?? null,
      p_week_number:  input.weekNumber   ?? null,
      p_status:       input.status       ?? null,
      p_published_at: input.publishedAt  ?? null,
    });
    if (!row) return null;
    return rowToPost(row);
  } catch (err) {
    console.error('[posts] updatePost error:', err);
    return null;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    const ok = await rpc<boolean>('fn_delete_post', { p_id: id });
    return ok ?? false;
  } catch (err) {
    console.error('[posts] deletePost error:', err);
    return false;
  }
}
