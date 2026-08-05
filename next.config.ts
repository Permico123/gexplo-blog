import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Assets (_next/static) siempre servidos desde el subdominio en Vercel,
  // para que las páginas proxied bajo gexplo.com/blog carguen JS/CSS.
  assetPrefix:
    process.env.NODE_ENV === 'production' ? 'https://blog.gexplo.com' : undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Prepare for Supabase / external DB migration
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  // El blog vive en gexplo.com/blog (dominio canonico sin www). Las URLs públicas del subdominio
  // redirigen 301; /admin y /api quedan en el subdominio (rutina de publicación).
  // El proxy consume gexplo-blog.vercel.app, así que no le afectan estas reglas.
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'host' as const, value: 'blog.gexplo.com' }],
        destination: 'https://gexplo.com/blog',
        permanent: true,
      },
      {
        source: '/blog',
        has: [{ type: 'host' as const, value: 'blog.gexplo.com' }],
        destination: 'https://gexplo.com/blog',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        has: [{ type: 'host' as const, value: 'blog.gexplo.com' }],
        destination: 'https://gexplo.com/blog/:slug*',
        permanent: true,
      },
      {
        source: '/sobre',
        has: [{ type: 'host' as const, value: 'blog.gexplo.com' }],
        destination: 'https://gexplo.com/sobre',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
