import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { validateToken, AUTH_COOKIE } from '@/lib/auth';
import { getPostById } from '@/lib/posts';
import PostForm from '../../PostForm';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token || !validateToken(token)) redirect('/admin/login');

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return <PostForm mode="edit" post={post} />;
}
