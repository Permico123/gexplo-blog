'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        backgroundColor: '#fff',
        borderBottom: '2px solid #1C3A2B',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 12px rgba(28,58,43,0.08)',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 2rem',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Image
            src="/logo-gexplo.png"
            alt="GEXPLO"
            width={130}
            height={28}
            style={{ objectFit: 'contain', objectPosition: 'left' }}
            priority
          />
          <div
            style={{
              width: '1px',
              height: '28px',
              backgroundColor: '#C5DDD0',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                color: '#2D6A4F',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              Laboratorio Editorial
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                color: '#8B7355',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              Bitácora del CEO
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
          <NavLink href="/blog">Archivo</NavLink>
          <NavLink href="/sobre">Sobre este blog</NavLink>
          <Link
            href="/blog"
            style={{
              background: 'linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)',
              color: '#fff',
              padding: '0.48rem 1.2rem',
              borderRadius: '5px',
              fontSize: '0.82rem',
              fontWeight: '700',
              letterSpacing: '0.02em',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(45,106,79,0.25)',
            }}
          >
            Leer ediciones
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
          }}
          className="mobile-menu-btn"
          aria-label="Menú"
        >
          <div style={{ width: '22px', height: '2px', background: '#1C3A2B', marginBottom: '5px' }} />
          <div style={{ width: '22px', height: '2px', background: '#1C3A2B', marginBottom: '5px' }} />
          <div style={{ width: '22px', height: '2px', background: '#1C3A2B' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: '#F2F0EB',
            borderTop: '1px solid #D8D4CC',
            padding: '1rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link href="/blog" style={{ color: '#2C3E35', textDecoration: 'none', fontSize: '0.95rem' }} onClick={() => setMenuOpen(false)}>
            Archivo
          </Link>
          <Link href="/sobre" style={{ color: '#2C3E35', textDecoration: 'none', fontSize: '0.95rem' }} onClick={() => setMenuOpen(false)}>
            Sobre este blog
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .mobile-menu-btn { display: block !important; }
          nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        color: '#2C3E35',
        textDecoration: 'none',
        fontSize: '0.88rem',
        fontWeight: '600',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => ((e.target as HTMLElement).style.color = '#2D6A4F')}
      onMouseLeave={e => ((e.target as HTMLElement).style.color = '#2C3E35')}
    >
      {children}
    </Link>
  );
}
