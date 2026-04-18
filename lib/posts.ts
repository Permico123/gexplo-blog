/**
 * lib/posts.ts
 *
 * Reads use Supabase JS client (direct table ops).
 * Writes use raw fetch() to /rest/v1/posts directly — bypasses
 * supabase-js and PostgREST function-schema-cache entirely.
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

// ─── Direct REST helpers (bypass PostgREST function schema cache) ─────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function restHeaders() {
  return {
    'apikey':        SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type':  'application/json',
    'Prefer':        'return=representation',
  };
}

export async function createPost(input: PostInput): Promise<Post> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
    method: 'POST',
    headers: restHeaders(),
    body: JSON.stringify({
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
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`[createPost] ${JSON.stringify(data)}`);
  return rowToPost((data as Record<string, unknown>[])[0]);
}

export async function updatePost(
  id: string,
  input: Partial<PostInput>,
): Promise<Post | null> {
  try {
    const current = await getPostById(id);
    if (!current) return null;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
      method: 'PATCH',
      headers: restHeaders(),
      body: JSON.stringify({
        title:        input.title        ?? current.title,
        subtitle:     input.subtitle     ?? current.subtitle     ?? null,
        slug:         input.slug         ?? current.slug,
        key_idea:     input.keyIdea      ?? current.keyIdea,
        content:      input.content      ?? current.content,
        cover_image:  input.coverImage   ?? current.coverImage   ?? null,
        tags:         input.tags         ?? current.tags         ?? [],
        week_number:  input.weekNumber   ?? current.weekNumber,
        status:       input.status       ?? current.status,
        published_at: input.publishedAt  ?? current.publishedAt  ?? null,
      }),
    });
    const data = await res.json();
    if (!res.ok) { console.error('[posts] updatePost error:', data); return null; }
    const rows = data as Record<string, unknown>[];
    if (!rows.length) return null;
    return rowToPost(rows[0]);
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
