import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArchiveList from '@/components/ArchiveList';
import { getPublishedPosts } from '@/lib/posts';
import { isGuide } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Archivo de transformación',
  description: 'Todas las ediciones del Laboratorio Editorial de GEXPLO. Cada semana documenta un avance real de la transformación hacia una empresa tecnológica de geociencia basada en datos.',
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const guias = posts.filter(isGuide);
  const bitacoras = posts.filter(p => !isGuide(p));

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>

        {/* Page header */}
        <section
          style={{
            backgroundColor: '#F2F0EB',
            borderBottom: '1px solid #D8D4CC',
            padding: '3rem 2rem 2.5rem',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <span
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#40916C',
                fontWeight: '700',
                display: 'block',
                marginBottom: '0.75rem',
              }}
            >
              Laboratorio Editorial · GEXPLO
            </span>
            <h1
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                color: '#1C3A2B',
                marginBottom: '0.75rem',
                letterSpacing: '-0.02em',
              }}
            >
              Archivo de transformación
            </h1>
            <p style={{ fontSize: '1rem', color: '#4A6358', maxWidth: '580px', lineHeight: '1.7' }}>
              Cada semana deja evidencia de decisiones reales, aprendizajes técnicos y evolución concreta. Este archivo documenta el proceso de transformación de GEXPLO sin filtros retroactivos.
            </p>
          </div>
        </section>

        {/* Posts list */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
          {guias.length > 0 && (
            <div style={{ marginBottom: '3.5rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C3A2B', marginBottom: '0.35rem' }}>
                Guías y recursos
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#4A6358', marginBottom: '1rem' }}>
                Material técnico de referencia: qué exige la normativa, cómo se hace y qué mirar antes de decidir.
              </p>
              <ArchiveList posts={guias} />
            </div>
          )}
          {guias.length > 0 && (
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C3A2B', marginBottom: '1rem' }}>
              Bitácora semanal
            </h2>
          )}
          <ArchiveList posts={bitacoras} />
        </section>

      </main>
      <Footer />
    </>
  );
}
