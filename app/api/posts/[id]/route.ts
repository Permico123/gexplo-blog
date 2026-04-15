import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPostById, updatePost, deletePost } from '@/lib/posts';
import { validateToken, AUTH_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  return token && validateToken(token);
}

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const updated = await updatePost(id, body);
  if (!updated) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deletePost(id);
  if (!ok) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  return NextResponse.json({ success: true });
}
