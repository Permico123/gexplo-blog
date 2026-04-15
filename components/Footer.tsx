import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#1C3A2B',
        color: '#9BB8A8',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '3rem 2rem',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#F8F7F4',
              marginBottom: '0.5rem',
            }}
          >
            GEXPLO · Laboratorio Editorial
          </div>
          <p style={{ fontSize: '0.82rem', maxWidth: '380px', lineHeight: '1.7', marginBottom: '1.25rem', color: '#9BB8A8' }}>
            Bitácora del CEO. Documentación semanal de la transformación de GEXPLO: de consultora ambiental a empresa tecnológica basada en datos, trazabilidad e inteligencia.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {['Agua', 'Tierra', 'Ambiente', 'IA & Blockchain'].map(tag => (
              <span
                key={tag}
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#40916C',
                  border: '1px solid #2D6A4F',
                  padding: '3px 10px',
                  borderRadius: '100px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
          <FooterLink href="/">Inicio</FooterLink>
          <FooterLink href="/blog">Archivo</FooterLink>
          <FooterLink href="/sobre">Sobre este blog</FooterLink>
        </nav>
      </div>

      <div
        style={{
          borderTop: '1px solid #2D4F3A',
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: '#6B8F7A' }}>
          © {year} GEXPLO. Todos los derechos reservados.
        </span>
        <span style={{ fontSize: '0.75rem', color: '#6B8F7A' }}>
          Geociencia · Ambiente · Datos
        </span>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{ color: '#9BB8A8', textDecoration: 'none', fontSize: '0.84rem' }}
    >
      {children}
    </Link>
  );
}
