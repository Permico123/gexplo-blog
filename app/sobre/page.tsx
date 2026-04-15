import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre este blog',
  description: 'Este espacio nace en un momento muy particular de la historia de GEXPLO. No es un blog de marketing, ni un canal de noticias corporativas. Es una bitácora real de una transición que está ocurriendo ahora mismo.',
};

export default function SobrePage() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>

        {/* Header */}
        <section
          style={{
            backgroundColor: '#1C3A2B',
            padding: '4rem 2rem 3.5rem',
          }}
        >
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Link href="/" style={{ fontSize: '0.75rem', color: '#6B8F7A', textDecoration: 'none' }}>
                Inicio
              </Link>
              <span style={{ color: '#2D4F3A' }}>/</span>
              <span style={{ fontSize: '0.75rem', color: '#9BB8A8' }}>Sobre este blog</span>
            </div>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#40916C',
                fontWeight: '700',
                marginBottom: '1rem',
              }}
            >
              GEXPLO · Laboratorio Editorial
            </span>
            <h1
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.75rem, 4vw, 2.6rem)',
                color: '#F8F7F4',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
              }}
            >
              Sobre este blog
            </h1>
          </div>
        </section>

        {/* Content */}
        <article style={{ maxWidth: '760px', margin: '0 auto', padding: '3.5rem 2rem 5rem' }}>

          {/* Opening */}
          <p
            style={{
              fontSize: '1.12rem',
              color: '#2C3E35',
              lineHeight: '1.85',
              marginBottom: '2rem',
              fontFamily: 'Georgia, serif',
            }}
          >
            Este espacio nace en un momento muy particular de la historia de GEXPLO.
            No es un blog de marketing, ni un canal de noticias corporativas. Es una bitácora
            real de una transición que está ocurriendo ahora mismo.
          </p>

          <Divider />

          <Section title="El punto de partida">
            <p>
              Durante años, GEXPLO trabajó como una consultora técnica tradicional,
              enfocada en hidrogeología, ambiente y proyectos productivos. Entregábamos
              estudios, informes y evaluaciones con rigor técnico. Pero con el tiempo
              se volvió evidente un problema que no era geológico ni ambiental:
              el problema era estructural.
            </p>
            <p>
              Los datos existían, pero no estaban conectados. Los informes se generaban,
              pero quedaban aislados. Las decisiones se tomaban, pero no había una forma
              de auditarlas ni de sostenerlas en el tiempo. El conocimiento se acumulaba,
              pero no se convertía en sistema.
            </p>
          </Section>

          <Section title="El diagnóstico honesto">
            <Callout>
              Como fundador, entendí que seguir produciendo informes no alcanzaba.
              Que si los datos quedaban encerrados en documentos, expedientes o carpetas,
              no generaban verdadero impacto.
            </Callout>
            <p>
              Ese fue el punto de inflexión. A partir de ahí comenzó una transición deliberada:
              pasar de ser una consultora ambiental a convertirnos en una empresa tecnológica
              de geociencia y ambiente, basada en datos, trazabilidad y automatización.
            </p>
          </Section>

          <Section title="Qué es este espacio">
            <p>
              Este espacio —GEXPLO · Laboratorio Editorial— documenta ese proceso sin filtros.
              Acá se registran decisiones reales, aprendizajes técnicos, errores, avances
              y criterios que van moldeando esta nueva etapa.
            </p>
            <p>
              No es contenido curado para parecer perfecto. Es un registro vivo de cómo
              se construye una empresa distinta desde adentro, combinando criterio técnico,
              tecnología y una forma nueva de pensar el trabajo ambiental.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
                margin: '1.75rem 0',
              }}
            >
              {[
                { n: '01', label: 'Bitácora real', desc: 'Registro semanal del proceso de transformación, sin edición retroactiva.' },
                { n: '02', label: 'Decisiones con criterio', desc: 'Cada entrada documenta una decisión real con sus fundamentos.' },
                { n: '03', label: 'Aprendizajes técnicos', desc: 'Errores, ajustes y avances del proceso de construcción.' },
                { n: '04', label: 'Visión estratégica', desc: 'El marco conceptual que orienta cada movimiento de GEXPLO.' },
              ].map(item => (
                <div
                  key={item.n}
                  style={{
                    backgroundColor: '#F2F0EB',
                    border: '1px solid #D8D4CC',
                    borderRadius: '6px',
                    padding: '1.25rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      color: '#40916C',
                      letterSpacing: '0.1em',
                      display: 'block',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {item.n}
                  </span>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1C3A2B', marginBottom: '0.35rem' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6B7C74', lineHeight: '1.55' }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Una base abierta de proceso">
            <p>
              Con este espacio busco dejar registro del proceso de transición. No solo como
              memoria personal, sino como una base abierta para quienes quieran entender
              cómo se transforma una empresa técnica en una organización basada en datos,
              tecnología y criterio profesional.
            </p>
            <p>
              Este recorrido no está pensado para hacerse en soledad. La intención es que
              quienes lean puedan acompañar el proceso, aportar miradas, cuestionar ideas
              y ver desde adentro cómo se toman decisiones reales en tiempo real.
            </p>
          </Section>

          <Section title="Si estás acá">
            <Callout>
              No estás leyendo una historia terminada. Estás viendo cómo se construye
              una nueva forma de trabajar en ambiente, desde adentro.
            </Callout>
            <p>
              Aprovechá este espacio para conocerme mejor, conocer a GEXPLO desde el fondo
              y ser parte del proceso a medida que avanza.
            </p>
          </Section>

          <Divider />

          {/* Closing conviction */}
          <div
            style={{
              backgroundColor: '#1C3A2B',
              borderRadius: '8px',
              padding: '2.5rem',
              marginTop: '2rem',
            }}
          >
            <p
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.1rem',
                color: '#F8F7F4',
                lineHeight: '1.8',
                margin: 0,
              }}
            >
              La convicción es simple: el futuro del sector no está en producir más informes,
              sino en construir sistemas confiables, auditables y capaces de generar valor
              real en el tiempo.
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['Water', 'Earth', 'Environment', 'AI', 'Blockchain'].map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.68rem',
                    color: '#40916C',
                    border: '1px solid rgba(64,145,108,0.35)',
                    padding: '3px 12px',
                    borderRadius: '100px',
                    letterSpacing: '0.08em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/blog"
              style={{
                backgroundColor: '#2D6A4F',
                color: '#fff',
                padding: '0.7rem 1.5rem',
                borderRadius: '5px',
                fontSize: '0.88rem',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Leer el archivo
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/"
              style={{
                color: '#2D6A4F',
                padding: '0.7rem 1.25rem',
                borderRadius: '5px',
                fontSize: '0.88rem',
                fontWeight: '500',
                textDecoration: 'none',
                border: '1px solid #C5DDD0',
              }}
            >
              Volver al inicio
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.3rem',
          color: '#1C3A2B',
          marginBottom: '1rem',
          paddingBottom: '0.6rem',
          borderBottom: '1px solid #E8E4DC',
        }}
      >
        {title}
      </h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          fontSize: '1rem',
          color: '#2C3E35',
          lineHeight: '1.8',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderLeft: '4px solid #40916C',
        backgroundColor: '#F2F0EB',
        padding: '1rem 1.25rem',
        borderRadius: '0 4px 4px 0',
        margin: '1rem 0',
      }}
    >
      <p
        style={{
          fontStyle: 'italic',
          color: '#2D6A4F',
          fontSize: '0.97rem',
          lineHeight: '1.7',
          margin: 0,
        }}
      >
        {children}
      </p>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        margin: '2.5rem 0',
      }}
    >
      <div style={{ flex: 1, height: '1px', backgroundColor: '#D8D4CC' }} />
      <div style={{ display: 'flex', gap: '4px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#40916C', opacity: 1 - i * 0.3 }} />
        ))}
      </div>
      <div style={{ flex: 1, height: '1px', backgroundColor: '#D8D4CC' }} />
    </div>
  );
}
