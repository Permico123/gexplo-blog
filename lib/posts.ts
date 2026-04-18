/**
 * lib/posts.ts
 *
 * Reads use Supabase JS client (direct table ops).
 * Writes (createPost, updatePost) use pg_graphql (/graphql/v1) —
 * completely bypasses PostgREST schema-cache (immune to PGRST204).
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

// ─── GraphQL writes (bypass PostgREST schema-cache entirely) ─────────────────
// pg_graphql has its own schema handler — immune to the PostgREST stale-cache issue.

const GRAPHQL_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/graphql/v1`;
const GQL_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function gqlHeaders() {
  return {
    'apikey':        GQL_SERVICE_KEY,
    'Authorization': `Bearer ${GQL_SERVICE_KEY}`,
    'Content-Type':  'application/json',
  };
}

// pg_graphql exposes columns in camelCase — use camelCase for both input and output fields.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function gqlRowToPost(row: Record<string, any>): Post {
  return {
    id:          row.id          as string,
    title:       row.title       as string,
    subtitle:    (row.subtitle   as string) || undefined,
    slug:        row.slug        as string,
    keyIdea:     row.keyIdea     as string,
    content:     row.content     as string,
    coverImage:  (row.coverImage as string) || undefined,
    tags:        (row.tags       as string[]) || [],
    weekNumber:  row.weekNumber  as number,
    status:      row.status      as PostStatus,
    publishedAt: (row.publishedAt as string) || undefined,
    createdAt:   row.createdAt   as string,
    updatedAt:   row.updatedAt   as string,
  };
}

const POST_GQL_FIELDS = `
  id title subtitle slug keyIdea content coverImage tags
  weekNumber status publishedAt createdAt updatedAt
`;

export async function createPost(input: PostInput): Promise<Post> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: gqlHeaders(),
    body: JSON.stringify({
      query: `mutation CreatePost(
        $title: String!, $subtitle: String, $slug: String!, $keyIdea: String!,
        $content: String!, $coverImage: String, $tags: [String!],
        $weekNumber: Int!, $status: String!, $publishedAt: Datetime
      ) {
        insertIntopostsCollection(objects: [{
          title: $title, subtitle: $subtitle, slug: $slug, keyIdea: $keyIdea,
          content: $content, coverImage: $coverImage, tags: $tags,
          weekNumber: $weekNumber, status: $status, publishedAt: $publishedAt
        }]) {
          records { ${POST_GQL_FIELDS} }
        }
      }`,
      variables: {
        title:       input.title,
        subtitle:    input.subtitle    || null,
        slug:        input.slug,
        keyIdea:     input.keyIdea,
        content:     input.content,
        coverImage:  input.coverImage  || null,
        tags:        input.tags        || [],
        weekNumber:  input.weekNumber  ?? 1,
        status:      input.status      || 'DRAFT',
        publishedAt: input.publishedAt || null,
      },
    }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(`[createPost] ${JSON.stringify(json.errors)}`);
  const records = json.data?.insertIntopostsCollection?.records;
  if (!records?.length) throw new Error('[createPost] No records returned');
  return gqlRowToPost(records[0] as Record<string, unknown>);
}

export async function updatePost(
  id: string,
  input: Partial<PostInput>,
): Promise<Post | null> {
  try {
    const current = await getPostById(id);
    if (!current) return null;

    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: gqlHeaders(),
      body: JSON.stringify({
        query: `mutation UpdatePost(
          $id: UUID!, $title: String!, $subtitle: String, $slug: String!, $keyIdea: String!,
          $content: String!, $coverImage: String, $tags: [String!],
          $weekNumber: Int!, $status: String!, $publishedAt: Datetime
        ) {
          updatepostsCollection(
            filter: { id: { eq: $id } }
            set: {
              title: $title, subtitle: $subtitle, slug: $slug, keyIdea: $keyIdea,
              content: $content, coverImage: $coverImage, tags: $tags,
              weekNumber: $weekNumber, status: $status, publishedAt: $publishedAt
            }
          ) {
            records { ${POST_GQL_FIELDS} }
          }
        }`,
        variables: {
          id,
          title:       input.title       ?? current.title,
          subtitle:    input.subtitle    ?? current.subtitle    ?? null,
          slug:        input.slug        ?? current.slug,
          keyIdea:     input.keyIdea     ?? current.keyIdea,
          content:     input.content     ?? current.content,
          coverImage:  input.coverImage  ?? current.coverImage  ?? null,
          tags:        input.tags        ?? current.tags        ?? [],
          weekNumber:  input.weekNumber  ?? current.weekNumber,
          status:      input.status      ?? current.status,
          publishedAt: input.publishedAt ?? current.publishedAt ?? null,
        },
      }),
    });
    const json = await res.json();
    if (json.errors) { console.error('[posts] updatePost error:', json.errors); return null; }
    const records = json.data?.updatepostsCollection?.records;
    if (!records?.length) return null;
    return gqlRowToPost(records[0] as Record<string, unknown>);
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
