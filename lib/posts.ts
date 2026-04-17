import { getDb } from './db';
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
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM posts
      ORDER BY week_number DESC
    `;
    return rows.map(rowToPost);
  } catch (err) {
    console.error('[posts] getAllPosts error:', err);
    return [];
  }
}

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM posts
      WHERE status = 'PUBLISHED'
      ORDER BY week_number DESC
    `;
    return rows.map(rowToPost);
  } catch (err) {
    console.error('[posts] getPublishedPosts error:', err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM posts
      WHERE slug = ${slug}
      LIMIT 1
    `;
    if (!rows.length) return undefined;
    return rowToPost(rows[0]);
  } catch (err) {
    console.error('[posts] getPostBySlug error:', err);
    return undefined;
  }
}

export async function getPostById(id: string): Promise<Post | undefined> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM posts
      WHERE id = ${id}::uuid
      LIMIT 1
    `;
    if (!rows.length) return undefined;
    return rowToPost(rows[0]);
  } catch (err) {
    console.error('[posts] getPostById error:', err);
    return undefined;
  }
}

export async function createPost(input: PostInput): Promise<Post> {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO posts (
      title, subtitle, slug, key_idea, content,
      cover_image, tags, week_number, status, published_at
    )
    VALUES (
      ${input.title},
      ${input.subtitle || null},
      ${input.slug},
      ${input.keyIdea},
      ${input.content},
      ${input.coverImage || null},
      ${input.tags || []},
      ${input.weekNumber ?? 1},
      ${input.status || 'DRAFT'},
      ${input.publishedAt || null}
    )
    RETURNING *
  `;
  if (!rows.length) {
    throw new Error('[posts] createPost error: no data returned');
  }
  return rowToPost(rows[0]);
}

export async function updatePost(
  id: string,
  input: Partial<PostInput>,
): Promise<Post | null> {
  const sql = getDb();

  // Build a plain object with only the columns that were actually supplied.
  // postgres.js's sql(obj) helper turns this into a safe "col = $n, …" clause.
  const patch: Record<string, unknown> = { updated_at: new Date() };

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

  const rows = await sql`
    UPDATE posts
    SET    ${sql(patch)}
    WHERE  id = ${id}::uuid
    RETURNING *
  `;

  if (!rows.length) return null;
  return rowToPost(rows[0]);
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    const sql = getDb();
    await sql`
      DELETE FROM posts WHERE id = ${id}::uuid
    `;
    return true;
  } catch (err) {
    console.error('[posts] deletePost error:', err);
    return false;
  }
}
