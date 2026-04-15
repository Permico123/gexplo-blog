'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('Token incorrecto. Verificá el acceso e intentá de nuevo.');
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1C3A2B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#F8F7F4',
          borderRadius: '10px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '380px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
        }}
      >
        {/* Brand */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1C3A2B',
              marginBottom: '4px',
            }}
          >
            GEXPLO
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7C74', letterSpacing: '0.06em' }}>
            Panel de administración
          </div>
        </div>

        <h1
          style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#1C3A2B',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          Acceso editorial
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="token"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#2C3E35', marginBottom: '6px' }}
            >
              Token de acceso
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="••••••••••••••"
              required
              style={{
                width: '100%',
                padding: '0.65rem 0.875rem',
                border: `1px solid ${error ? '#E53E3E' : '#D8D4CC'}`,
                borderRadius: '5px',
                fontSize: '0.9rem',
                backgroundColor: '#fff',
                outline: 'none',
                color: '#2C3E35',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#FFF5F5',
                border: '1px solid #FC8181',
                borderRadius: '4px',
                padding: '0.6rem 0.875rem',
                fontSize: '0.8rem',
                color: '#C53030',
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#A0C4B3' : '#2D6A4F',
              color: '#fff',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '5px',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Verificando...' : 'Ingresar al panel'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <a href="/" style={{ fontSize: '0.75rem', color: '#6B7C74', textDecoration: 'none' }}>
            ← Volver al blog
          </a>
        </div>
      </div>
    </div>
  );
}
