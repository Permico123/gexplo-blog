import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'GEXPLO · Laboratorio Editorial';
  const week = searchParams.get('week') || '';
  const subtitle = searchParams.get('subtitle') || 'Bitácora del CEO · De consultora ambiental a empresa tecnológica basada en datos';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1C3A2B',
          padding: '60px 70px',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Background accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(64,145,108,0.2) 0%, transparent 70%)',
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div
            style={{
              fontSize: '14px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#40916C',
              fontWeight: 700,
              padding: '6px 16px',
              border: '1px solid rgba(64,145,108,0.4)',
              borderRadius: '100px',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            {week ? `Semana ${String(week).padStart(2, '0')} · Bitácora del CEO` : 'Laboratorio Editorial · Bitácora del CEO'}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? '40px' : '48px',
            fontWeight: 700,
            color: '#F8F7F4',
            lineHeight: 1.2,
            maxWidth: '900px',
            marginBottom: '24px',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '20px',
            color: '#9BB8A8',
            lineHeight: 1.5,
            maxWidth: '800px',
            marginBottom: 'auto',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          {subtitle}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(45,106,79,0.4)',
            paddingTop: '24px',
            marginTop: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '22px',
                fontWeight: 700,
                color: '#F8F7F4',
              }}
            >
              GEXPLO
            </div>
            <div style={{ color: '#2D4F3A', fontSize: '20px' }}>·</div>
            <div style={{ color: '#6B8F7A', fontSize: '15px', fontFamily: 'Arial, sans-serif' }}>
              blog.gexplo.com
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['Agua', 'Tierra', 'Ambiente', 'IA'].map(tag => (
              <div
                key={tag}
                style={{
                  fontSize: '11px',
                  color: '#40916C',
                  border: '1px solid rgba(64,145,108,0.35)',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontFamily: 'Arial, sans-serif',
                  letterSpacing: '0.06em',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
