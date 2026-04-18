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

const POST_GQL_FIELDS = `
  id title subtitle slug key_idea content cover_image tags
  week_number status published_at created_at updated_at
`;

export async function createPost(input: PostInput): Promise<Post> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: gqlHeaders(),
    body: JSON.stringify({
      query: `mutation CreatePost(
        $title: String!, $subtitle: String, $slug: String!, $key_idea: String!,
        $content: String!, $cover_image: String, $tags: [String!],
        $week_number: Int!, $status: String!, $published_at: Datetime
      ) {
        insertIntopostsCollection(objects: [{
          title: $title, subtitle: $subtitle, slug: $slug, key_idea: $key_idea,
          content: $content, cover_image: $cover_image, tags: $tags,
          week_number: $week_number, status: $status, published_at: $published_at
        }]) {
          records { ${POST_GQL_FIELDS} }
        }
      }`,
      variables: {
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
      },
    }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(`[createPost] ${JSON.stringify(json.errors)}`);
  const records = json.data?.insertIntopostsCollection?.records;
  if (!records?.length) throw new Error('[createPost] No records returned');
  return rowToPost(records[0] as Record<string, unknown>);
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
          $id: UUID!, $title: String!, $subtitle: String, $slug: String!, $key_idea: String!,
          $content: String!, $cover_image: String, $tags: [String!],
          $week_number: Int!, $status: String!, $published_at: Datetime
        ) {
          updatepostsCollection(
            filter: { id: { eq: $id } }
            set: {
              title: $title, subtitle: $subtitle, slug: $slug, key_idea: $key_idea,
              content: $content, cover_image: $cover_image, tags: $tags,
              week_number: $week_number, status: $status, published_at: $published_at
            }
          ) {
            records { ${POST_GQL_FIELDS} }
          }
        }`,
        variables: {
          id,
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
        },
      }),
    });
    const json = await res.json();
    if (json.errors) { console.error('[posts] updatePost error:', json.errors); return null; }
    const records = json.data?.updatepostsCollection?.records;
    if (!records?.length) return null;
    return rowToPost(records[0] as Record<string, unknown>);
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
