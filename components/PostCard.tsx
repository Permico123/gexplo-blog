'use client';

import Link from 'next/link';
import { Post } from '@/lib/types';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <article
          style={{
            background: 'linear-gradient(135deg, #fff 0%, #F5FAF7 100%)',
            border: '1.5px solid #C5DDD0',
            borderRadius: '10px',
            padding: '2.5rem',
            transition: 'box-shadow 0.25s, border-color 0.25s, transform 0.2s',
            cursor: 'pointer',
            borderTop: '4px solid #40916C',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(28,58,43,0.12)';
            (e.currentTarget as HTMLElement).style.borderColor = '#2D6A4F';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            (e.currentTarget as HTMLElement).style.borderColor = '#C5DDD0';
          }}
        >
          {/* Week badge */}
          <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: '700',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: '100px',
              }}
            >
              Semana {String(post.weekNumber).padStart(2, '0')}
            </span>
            {date && (
              <span style={{ fontSize: '0.78rem', color: '#6B7C74' }}>{date}</span>
            )}
          </div>

          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.55rem',
              fontWeight: '700',
              color: '#1C3A2B',
              lineHeight: '1.3',
              marginBottom: '0.75rem',
            }}
          >
            {post.title}
          </h2>

          {post.subtitle && (
            <p style={{ fontSize: '0.95rem', color: '#4A6358', marginBottom: '1rem', lineHeight: '1.55' }}>
              {post.subtitle}
            </p>
          )}

          {/* Key idea callout */}
          <div
            style={{
              background: 'linear-gradient(135deg, #E8F3EC 0%, #D4EBF1 100%)',
              borderLeft: '4px solid #40916C',
              padding: '0.875rem 1rem',
              borderRadius: '0 6px 6px 0',
              marginBottom: '1.25rem',
            }}
          >
            <p style={{ fontSize: '0.85rem', color: '#1C4A38', fontStyle: 'italic', lineHeight: '1.55', margin: 0 }}>
              &ldquo;{post.keyIdea}&rdquo;
            </p>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {post.tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                style={{
                  fontSize: '0.7rem',
                  color: '#6B7C74',
                  border: '1px solid #D8D4CC',
                  padding: '2px 10px',
                  borderRadius: '100px',
                  letterSpacing: '0.04em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: '700',
              padding: '0.45rem 1.1rem',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(45,106,79,0.2)',
            }}
          >
            Leer edición
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <article
        style={{
          backgroundColor: '#fff',
          border: '1.5px solid #D8D4CC',
          borderRadius: '8px',
          padding: '1.75rem',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          height: '100%',
          borderTop: '3px solid #4A90A4',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(28,58,43,0.1)';
          (e.currentTarget as HTMLElement).style.borderColor = '#40916C';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLElement).style.borderColor = '#D8D4CC';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <span
            style={{
              background: 'linear-gradient(135deg, #4A90A4 0%, #2D6A4F 100%)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '3px 10px',
              borderRadius: '100px',
            }}
          >
            Sem. {String(post.weekNumber).padStart(2, '0')}
          </span>
          {date && <span style={{ fontSize: '0.73rem', color: '#6B7C74' }}>{date}</span>}
        </div>

        <h3
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.15rem',
            fontWeight: '700',
            color: '#1C3A2B',
            lineHeight: '1.35',
            marginBottom: '0.6rem',
          }}
        >
          {post.title}
        </h3>

        <p
          style={{
            fontSize: '0.82rem',
            color: '#4A6358',
            lineHeight: '1.6',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.keyIdea}
        </p>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {post.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              style={{
                fontSize: '0.65rem',
                color: '#6B7C74',
                border: '1px solid #D8D4CC',
                padding: '2px 8px',
                borderRadius: '100px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
