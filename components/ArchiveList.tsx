'use client';

import Link from 'next/link';
import { Post } from '@/lib/types';

export default function ArchiveList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #D8D4CC',
          borderRadius: '8px',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#6B7C74' }}>Las primeras ediciones están en camino.</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post, index) => {
        const date = post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString('es-AR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })
          : '';

        return (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <article
              style={{
                display: 'grid',
                gridTemplateColumns: '90px 1fr',
                gap: '2rem',
                padding: '1.75rem 0.5rem',
                borderBottom: '1px solid #E8E4DC',
                borderRadius: '4px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9F8F5')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              {/* Week column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingTop: '0.2rem',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#E8F3EC',
                    border: '1px solid #C5DDD0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.6rem', color: '#40916C', fontWeight: '700', letterSpacing: '0.06em', lineHeight: 1 }}>
                    SEM
                  </span>
                  <span style={{ fontSize: '1.1rem', color: '#1C3A2B', fontWeight: '700', lineHeight: 1 }}>
                    {String(post.weekNumber).padStart(2, '0')}
                  </span>
                </div>
                {index < posts.length - 1 && (
                  <div style={{ width: '1px', flex: 1, backgroundColor: '#D8D4CC', marginTop: '0.75rem', minHeight: '20px' }} />
                )}
              </div>

              {/* Content column */}
              <div style={{ paddingBottom: '0.5rem' }}>
                {date && (
                  <span style={{ fontSize: '0.73rem', color: '#6B7C74', display: 'block', marginBottom: '0.5rem' }}>
                    {date}
                  </span>
                )}

                <h2
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#1C3A2B',
                    lineHeight: '1.35',
                    marginBottom: '0.4rem',
                  }}
                >
                  {post.title}
                </h2>

                <p
                  style={{
                    fontSize: '0.85rem',
                    color: '#4A6358',
                    fontStyle: 'italic',
                    lineHeight: '1.6',
                    marginBottom: '0.75rem',
                  }}
                >
                  &ldquo;{post.keyIdea}&rdquo;
                </p>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {post.tags.slice(0, 4).map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.65rem',
                        color: '#6B7C74',
                        border: '1px solid #D8D4CC',
                        padding: '2px 9px',
                        borderRadius: '100px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: '#2D6A4F',
                      fontWeight: '600',
                      marginLeft: '0.25rem',
                    }}
                  >
                    Leer →
                  </span>
                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
