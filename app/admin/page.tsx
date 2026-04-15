import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { validateToken } from '@/lib/auth';
import { AUTH_COOKIE } from '@/lib/auth';
import { getAllPosts } from '@/lib/posts';
import AdminPostList from './AdminPostList';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token || !validateToken(token)) {
    redirect('/admin/login');
  }

  const posts = (await getAllPosts()).sort((a, b) => b.weekNumber - a.weekNumber);
  const published = posts.filter(p => p.status === 'PUBLISHED').length;
  const drafts = posts.filter(p => p.status === 'DRAFT').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4' }}>
      {/* Admin header */}
      <header style={{ backgroundColor: '#1C3A2B', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontWeight: '700', color: '#F8F7F4', fontSize: '1rem' }}>
            GEXPLO · Admin
          </span>
          <span style={{ color: '#2D4F3A', fontSize: '0.8rem' }}>|</span>
          <span style={{ color: '#6B8F7A', fontSize: '0.78rem' }}>Laboratorio Editorial</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/" target="_blank" style={{ color: '#6B8F7A', fontSize: '0.78rem', textDecoration: 'none' }}>
            Ver blog →
          </Link>
          <form action="/api/auth" method="POST">
            <input type="hidden" name="_method" value="DELETE" />
            <button
              type="submit"
              style={{ backgroundColor: 'transparent', border: '1px solid #2D4F3A', color: '#9BB8A8', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
              formAction="/api/auth/logout"
            >
              Salir
            </button>
          </form>
        </div>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        {/* Page title + CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1C3A2B', marginBottom: '0.25rem' }}>
              Publicaciones
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#6B7C74' }}>Gestioná el contenido del Laboratorio Editorial</p>
          </div>
          <Link
            href="/admin/posts/new"
            style={{
              backgroundColor: '#2D6A4F',
              color: '#fff',
              padding: '0.65rem 1.4rem',
              borderRadius: '5px',
              fontSize: '0.88rem',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            + Nueva edición
          </Link>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <MetricCard label="Total" value={posts.length} color="#1C3A2B" />
          <MetricCard label="Publicados" value={published} color="#2D6A4F" />
          <MetricCard label="Borradores" value={drafts} color="#8B7355" />
        </div>

        {/* Post list */}
        <AdminPostList posts={posts} />
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #D8D4CC',
        borderRadius: '8px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <span style={{ fontSize: '0.75rem', color: '#6B7C74', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: '600' }}>
        {label}
      </span>
      <span style={{ fontSize: '2rem', fontWeight: '700', color }}>{value}</span>
    </div>
  );
}
