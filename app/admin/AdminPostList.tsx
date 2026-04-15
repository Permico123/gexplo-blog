'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/types';

export default function AdminPostList({ posts }: { posts: Post[] }) {
  const router = useRouter();

  async function handleDelete(id: string, title: string) {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  async function toggleStatus(id: string, current: 'DRAFT' | 'PUBLISHED') {
    const newStatus = current === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const body: Record<string, unknown> = { status: newStatus };
    if (newStatus === 'PUBLISHED') {
      body.publishedAt = new Date().toISOString();
    }
    await fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    router.refresh();
  }

  if (posts.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #D8D4CC',
          borderRadius: '8px',
          padding: '3rem',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#6B7C74', fontSize: '0.95rem' }}>
          No hay publicaciones aún.{' '}
          <Link href="/admin/posts/new" style={{ color: '#2D6A4F', fontWeight: '600' }}>
            Crear la primera edición
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #D8D4CC', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Table header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '70px 1fr 120px 120px 160px',
          gap: '1rem',
          padding: '0.75rem 1.25rem',
          backgroundColor: '#F2F0EB',
          borderBottom: '1px solid #D8D4CC',
          fontSize: '0.72rem',
          fontWeight: '700',
          color: '#6B7C74',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
        }}
      >
        <span>Semana</span>
        <span>Título</span>
        <span>Estado</span>
        <span>Fecha</span>
        <span style={{ textAlign: 'right' }}>Acciones</span>
      </div>

      {/* Rows */}
      {posts.map((post, idx) => {
        const date = post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
          : post.createdAt
          ? new Date(post.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
          : '—';

        return (
          <div
            key={post.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '70px 1fr 120px 120px 160px',
              gap: '1rem',
              padding: '1rem 1.25rem',
              borderBottom: idx < posts.length - 1 ? '1px solid #F0EDE8' : 'none',
              alignItems: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#FAFAF8')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            {/* Week */}
            <div>
              <span
                style={{
                  backgroundColor: '#E8F3EC',
                  color: '#2D6A4F',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '100px',
                }}
              >
                {String(post.weekNumber).padStart(2, '0')}
              </span>
            </div>

            {/* Title */}
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#1C3A2B', marginBottom: '2px' }}>
                {post.title}
              </div>
              <div style={{ fontSize: '0.73rem', color: '#6B7C74' }}>/{post.slug}</div>
            </div>

            {/* Status */}
            <div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  letterSpacing: '0.06em',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  backgroundColor: post.status === 'PUBLISHED' ? '#E8F3EC' : '#F5F0E8',
                  color: post.status === 'PUBLISHED' ? '#2D6A4F' : '#8B7355',
                  border: `1px solid ${post.status === 'PUBLISHED' ? '#C5DDD0' : '#D4C9B0'}`,
                }}
              >
                {post.status === 'PUBLISHED' ? 'Publicado' : 'Borrador'}
              </span>
            </div>

            {/* Date */}
            <div style={{ fontSize: '0.78rem', color: '#6B7C74' }}>{date}</div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Link
                href={`/admin/posts/${post.id}`}
                style={{
                  fontSize: '0.75rem',
                  color: '#2D6A4F',
                  border: '1px solid #C5DDD0',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                Editar
              </Link>
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                style={{
                  fontSize: '0.75rem',
                  color: '#4A90A4',
                  border: '1px solid #C5D8E0',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                Ver
              </Link>
              <button
                onClick={() => toggleStatus(post.id, post.status)}
                style={{
                  fontSize: '0.75rem',
                  color: post.status === 'PUBLISHED' ? '#8B7355' : '#2D6A4F',
                  border: `1px solid ${post.status === 'PUBLISHED' ? '#D4C9B0' : '#C5DDD0'}`,
                  padding: '4px 10px',
                  borderRadius: '4px',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                {post.status === 'PUBLISHED' ? 'Despublicar' : 'Publicar'}
              </button>
              <button
                onClick={() => handleDelete(post.id, post.title)}
                style={{
                  fontSize: '0.75rem',
                  color: '#C53030',
                  border: '1px solid #FC8181',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
