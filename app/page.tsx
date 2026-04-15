import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { getPublishedPosts } from '@/lib/posts';

export const dynamic = 'force-dynamic';

const PILLARS = [
  { label: 'Ambiente', icon: '◎', color: '#40916C' },
  { label: 'Agua', icon: '◈', color: '#4A90A4' },
  { label: 'Tierra', icon: '◉', color: '#8B7355' },
  { label: 'IA & Blockchain', icon: '◇', color: '#2D6A4F' },
];

export default async function HomePage() {
  const posts = await getPublishedPosts();
  const featuredPost = posts[0];
  const restPosts = posts.slice(1, 4);

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>

        {/* ─── Hero ─── */}
        <section
          style={{
            background: 'linear-gradient(135deg, #0F2318 0%, #1C3A2B 45%, #1A3D35 100%)',
            color: '#F8F7F4',
            padding: '5.5rem 2rem 4.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative blobs */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(ellipse at 85% 15%, rgba(64,145,108,0.22) 0%, transparent 55%), radial-gradient(ellipse at 10% 80%, rgba(74,144,164,0.12) 0%, transparent 50%)',
              pointerEvents: 'none',
            }}
          />
          {/* Subtle grid pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
            {/* Eyebrow */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(64,145,108,0.2)',
                border: '1px solid rgba(64,145,108,0.4)',
                borderRadius: '100px',
                padding: '4px 14px',
                marginBottom: '2rem',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#40916C', display: 'inline-block' }} />
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9BB8A8', fontWeight: '600' }}>
                Bitácora del CEO · En tiempo real
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: '700',
                lineHeight: '1.15',
                color: '#F8F7F4',
                maxWidth: '780px',
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              De consultora ambiental a empresa tecnológica basada en datos
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#9BB8A8',
                maxWidth: '620px',
                lineHeight: '1.65',
                marginBottom: '1.5rem',
              }}
            >
              Documentación semanal de decisiones, aprendizajes y evolución real de GEXPLO
            </p>

            <p
              style={{
                fontSize: '0.9rem',
                color: '#6B8F7A',
                maxWidth: '560px',
                lineHeight: '1.7',
                marginBottom: '2.5rem',
              }}
            >
              Una narrativa técnica y humana de transformación: operaciones, método, datos y criterio profesional aplicados semana a semana.
            </p>

            {/* CTA */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
              <Link
                href="/blog"
                style={{
                  backgroundColor: '#40916C',
                  color: '#fff',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '5px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Ver archivo completo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/sobre"
                style={{
                  backgroundColor: 'transparent',
                  color: '#9BB8A8',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '5px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  border: '1px solid rgba(155,184,168,0.3)',
                }}
              >
                Sobre este blog
              </Link>
            </div>

            {/* Pillars */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {PILLARS.map(pillar => (
                <div key={pillar.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1rem', color: pillar.color }}>{pillar.icon}</span>
                  <span style={{ fontSize: '0.78rem', color: '#7FA891', letterSpacing: '0.06em', fontWeight: '500' }}>
                    {pillar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ADN bar ─── */}
        <div
          style={{
            background: 'linear-gradient(90deg, #2D6A4F 0%, #40916C 50%, #4A90A4 100%)',
            padding: '0.75rem 2rem',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Water', 'Earth', 'Environment', 'AI', 'Blockchain'].map((tag, i) => (
              <span key={tag} style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.9)', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{tag}</span>
                {i < 4 && <span style={{ margin: '0 0.75rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem' }}>·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* ─── Recent posts ─── */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                <div style={{ width: '32px', height: '3px', background: 'linear-gradient(90deg, #40916C, #4A90A4)', borderRadius: '2px' }} />
                <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#40916C', fontWeight: '700' }}>
                  Publicaciones
                </span>
              </div>
              <h2
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.65rem',
                  color: '#1C3A2B',
                  marginBottom: '0.3rem',
                  letterSpacing: '-0.01em',
                }}
              >
                Ediciones recientes
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#6B7C74' }}>
                Cada semana, una edición documenta un avance real del proceso.
              </p>
            </div>
            <Link
              href="/blog"
              style={{
                fontSize: '0.8rem',
                color: '#2D6A4F',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                border: '1px solid #C5DDD0',
                padding: '0.4rem 1rem',
                borderRadius: '4px',
                backgroundColor: '#F0F7F3',
              }}
            >
              Ver todas →
            </Link>
          </div>

          {posts.length === 0 ? (
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
                Las primeras ediciones están en camino.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Featured */}
              {featuredPost && <PostCard post={featuredPost} featured />}

              {/* Grid */}
              {restPosts.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.25rem',
                  }}
                >
                  {restPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CTA to archive */}
          {posts.length > 0 && (
            <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
              <Link
                href="/blog"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#2D6A4F',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  border: '1px solid #40916C',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '5px',
                  transition: 'background 0.2s',
                }}
              >
                Ver archivo completo
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </section>

        {/* ─── About strip ─── */}
        <section
          style={{
            backgroundColor: '#F2F0EB',
            borderTop: '1px solid #D8D4CC',
            padding: '3.5rem 2rem',
          }}
        >
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.3rem',
                  color: '#1C3A2B',
                  marginBottom: '0.6rem',
                }}
              >
                ¿Por qué este laboratorio editorial?
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#4A6358', maxWidth: '580px', lineHeight: '1.7' }}>
                Porque el proceso de transformación de GEXPLO merece ser documentado en tiempo real, sin filtros ni edición retroactiva. Acá se registran las decisiones reales, los aprendizajes honestos y la evolución visible semana a semana.
              </p>
            </div>
            <Link
              href="/sobre"
              style={{
                backgroundColor: '#1C3A2B',
                color: '#F8F7F4',
                padding: '0.75rem 1.5rem',
                borderRadius: '5px',
                fontSize: '0.85rem',
                fontWeight: '600',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Leer la historia
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
