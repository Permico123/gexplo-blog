import type { NextConfig } from "next";

// Crawlers de IA que el hosting de gexplo.com (Hostinger/LiteSpeed) rechaza con HTTP 429
// en TODAS sus URLs, incluso cuando robots.txt los permite explicitamente.
// Para estos agentes NO aplicamos el 301 hacia gexplo.com: si los redirigieramos caerian
// en el bloqueo y no leerian nada. En cambio les servimos el contenido desde este origen
// (Vercel), que no esta bloqueado. Cada pagina declara <link rel="canonical"> apuntando a
// gexplo.com, asi que para los buscadores la URL principal sigue siendo la misma y no se
// genera contenido duplicado.
// El valor se compila como RegExp anclado (^...$) y distingue mayusculas.
const CRAWLERS_BLOQUEADOS = '.*(GPTBot|gptbot|meta-externalagent).*';

const sinCrawlersBloqueados = [
  { type: 'header' as const, key: 'user-agent', value: CRAWLERS_BLOQUEADOS },
];

const desdeSubdominio = [{ type: 'host' as const, value: 'blog.gexplo.com' }];

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
  // Excepción: los crawlers bloqueados arriba leen acá directamente, sin redirección.
  async redirects() {
    return [
      {
        source: '/',
        has: desdeSubdominio,
        missing: sinCrawlersBloqueados,
        destination: 'https://gexplo.com/blog',
        permanent: true,
      },
      {
        source: '/blog',
        has: desdeSubdominio,
        missing: sinCrawlersBloqueados,
        destination: 'https://gexplo.com/blog',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        has: desdeSubdominio,
        missing: sinCrawlersBloqueados,
        destination: 'https://gexplo.com/blog/:slug*',
        permanent: true,
      },
      {
        source: '/sobre',
        has: desdeSubdominio,
        missing: sinCrawlersBloqueados,
        destination: 'https://gexplo.com/sobre',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
