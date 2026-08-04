import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Assets (_next/static) siempre servidos desde el subdominio en Vercel,
  // para que las páginas proxied bajo www.gexplo.com/blog carguen JS/CSS.
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
};

export default nextConfig;
