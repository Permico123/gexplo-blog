import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPostBySlug } from '@/lib/posts';

// Render dinámico: cada request consulta Supabase en tiempo real.
// Evita el 404 cuando un post se publica después del último build.
export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.gexplo.com';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== 'PUBLISHED') {
    return { title: 'Edición no encontrada' };
  }

  const description = post.subtitle || post.keyIdea;
  const ogImageUrl = post.coverImage
    ? post.coverImage
    : `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}&week=${post.weekNumber}&subtitle=${encodeURIComponent(post.subtitle || post.keyIdea)}`;
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description,
    openGraph: {
      type: 'article',
      url,
      title: `${post.title} · GEXPLO`,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} · GEXPLO`,
      description,
      images: [ogImageUrl],
    },
    alternates: { canonical: url },
  };
}

function renderMarkdown(content: string): string {
  // Simple markdown to HTML — production: use next-mdx-remote or remark
  return content
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>(\n|$))+/g, m => `<ul>${m}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hbupl]|<hr|<block)(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== 'PUBLISHED') notFound();

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('es-AR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

  const htmlContent = renderMarkdown(post.content);

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>

        {/* Article header */}
        <section
          style={{
            backgroundColor: '#1C3A2B',
            padding: '3.5rem 2rem 3rem',
          }}
        >
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
              <Link href="/" style={{ fontSize: '0.75rem', color: '#6B8F7A', textDecoration: 'none' }}>
                Inicio
              </Link>
              <span style={{ color: '#2D4F3A' }}>/</span>
              <Link href="/blog" style={{ fontSize: '0.75rem', color: '#6B8F7A', textDecoration: 'none' }}>
                Archivo
              </Link>
              <span style={{ color: '#2D4F3A' }}>/</span>
              <span style={{ fontSize: '0.75rem', color: '#9BB8A8' }}>
                Semana {String(post.weekNumber).padStart(2, '0')}
              </span>
            </div>

            {/* Week badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span
                style={{
                  backgroundColor: 'rgba(64,145,108,0.2)',
                  border: '1px solid rgba(64,145,108,0.4)',
                  color: '#7DC8A0',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '4px 14px',
                  borderRadius: '100px',
                }}
              >
                Semana {String(post.weekNumber).padStart(2, '0')}
              </span>
              {date && <span style={{ fontSize: '0.78rem', color: '#6B8F7A' }}>{date}</span>}
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: '700',
                color: '#F8F7F4',
                lineHeight: '1.2',
                marginBottom: '1rem',
                letterSpacing: '-0.02em',
              }}
            >
              {post.title}
            </h1>

            {/* Subtitle */}
            {post.subtitle && (
              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#9BB8A8',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem',
                }}
              >
                {post.subtitle}
              </p>
            )}

            {/* Tags */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {post.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.68rem',
                    color: '#7DC8A0',
                    border: '1px solid rgba(64,145,108,0.35)',
                    padding: '3px 11px',
                    borderRadius: '100px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Key idea callout */}
        <div style={{ backgroundColor: '#F2F0EB', borderBottom: '1px solid #D8D4CC' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto', padding: '1.5rem 2rem' }}>
            <div
              style={{
                borderLeft: '4px solid #40916C',
                paddingLeft: '1.25rem',
              }}
            >
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#40916C', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                Idea clave
              </span>
              <p style={{ fontSize: '0.97rem', color: '#2D6A4F', fontStyle: 'italic', lineHeight: '1.65', margin: 0 }}>
                &ldquo;{post.keyIdea}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Article content */}
        <article style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 2rem 4rem' }}>
          {post.coverImage && (
            <div style={{ marginBottom: '2.5rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #D8D4CC' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                style={{ width: '100%', display: 'block', maxHeight: '420px', objectFit: 'cover' }}
              />
            </div>
          )}

          <div
            className="prose"
            style={{
              fontSize: '1.02rem',
              lineHeight: '1.8',
              color: '#2C3E35',
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Author / footer of article */}
          <div
            style={{
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid #D8D4CC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: '#6B7C74', marginBottom: '2px' }}>Publicado en</div>
              <div style={{ fontSize: '0.85rem', color: '#1C3A2B', fontWeight: '600' }}>
                GEXPLO · Laboratorio Editorial
              </div>
            </div>
            <Link
              href="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#2D6A4F',
                fontSize: '0.84rem',
                fontWeight: '600',
                textDecoration: 'none',
                border: '1px solid #40916C',
                padding: '0.5rem 1.25rem',
                borderRadius: '4px',
              }}
            >
              ← Volver al archivo
            </Link>
          </div>
        </article>

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.subtitle || post.keyIdea,
              datePublished: post.publishedAt,
              dateModified: post.updatedAt,
              author: { '@type': 'Organization', name: 'GEXPLO', url: SITE_URL },
              publisher: {
                '@type': 'Organization',
                name: 'GEXPLO',
                url: SITE_URL,
              },
              url: `${SITE_URL}/blog/${post.slug}`,
              keywords: post.tags.join(', '),
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
