import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateToken, AUTH_COOKIE } from '@/lib/auth';
import PostForm from '../../PostForm';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token || !validateToken(token)) redirect('/admin/login');

  return <PostForm mode="create" />;
}
