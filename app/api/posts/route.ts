import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllPosts, createPost } from '@/lib/posts';
import { validateToken, AUTH_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const posts = await getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json();

  if (!body.title || !body.slug || !body.content || !body.keyIdea) {
    return NextResponse.json({ error: 'Campos requeridos faltantes: title, slug, content, keyIdea' }, { status: 400 });
  }

  const post = await createPost({
    title: body.title,
    subtitle: body.subtitle || '',
    slug: body.slug,
    keyIdea: body.keyIdea,
    content: body.content,
    coverImage: body.coverImage || '',
    tags: Array.isArray(body.tags) ? body.tags : [],
    weekNumber: Number(body.weekNumber) || 1,
    status: body.status || 'DRAFT',
    publishedAt: body.publishedAt || undefined,
  });

  return NextResponse.json(post, { status: 201 });
}
