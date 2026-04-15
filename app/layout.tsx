import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.gexplo.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'GEXPLO · Laboratorio Editorial',
    template: '%s · GEXPLO',
  },
  description:
    'Bitácora del CEO de GEXPLO. Documentación semanal de la transformación de una consultora ambiental a empresa tecnológica basada en datos, trazabilidad e inteligencia.',
  keywords: ['geociencia', 'ambiente', 'hidrogeología', 'datos', 'trazabilidad', 'monitoreo', 'IA', 'blockchain', 'GEXPLO'],
  authors: [{ name: 'GEXPLO', url: SITE_URL }],
  creator: 'GEXPLO',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: SITE_URL,
    siteName: 'GEXPLO · Laboratorio Editorial',
    title: 'GEXPLO · Laboratorio Editorial',
    description:
      'Bitácora del CEO. Documentación semanal de decisiones, aprendizajes y evolución real de GEXPLO.',
    images: [
      {
        url: `${SITE_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: 'GEXPLO · Laboratorio Editorial',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GEXPLO · Laboratorio Editorial',
    description: 'Bitácora del CEO de GEXPLO. De consultora ambiental a empresa tecnológica basada en datos.',
    images: [`${SITE_URL}/api/og`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" style={{ height: '100%' }}>
      <body style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </body>
    </html>
  );
}
