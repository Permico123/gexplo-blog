/**
 * GEXPLO · Seed Supabase desde data/posts.json
 *
 * Uso (una vez que tengas las env vars en .env.local):
 *   npx tsx scripts/seed-supabase.ts
 *
 * Requiere: npm install -D tsx (o usa ts-node)
 * Las variables NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 * deben estar en .env.local antes de ejecutar.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';

// Cargar .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

interface JsonPost {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  keyIdea: string;
  content: string;
  coverImage?: string;
  tags: string[];
  weekNumber: number;
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

async function seed() {
  const raw = readFileSync(resolve(__dirname, '../data/posts.json'), 'utf-8');
  const posts: JsonPost[] = JSON.parse(raw);

  console.log(`📦 Migrando ${posts.length} post(s) a Supabase...`);

  for (const post of posts) {
    const row = {
      id: post.id,
      title: post.title,
      subtitle: post.subtitle ?? null,
      slug: post.slug,
      key_idea: post.keyIdea,
      content: post.content,
      cover_image: post.coverImage ?? '',
      tags: post.tags,
      week_number: post.weekNumber,
      status: post.status,
      published_at: post.publishedAt ?? null,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
    };

    const { error } = await supabase
      .from('posts')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Error en post "${post.title}":`, error.message);
    } else {
      console.log(`✅ Semana ${String(post.weekNumber).padStart(2, '0')} — ${post.title}`);
    }
  }

  console.log('\n🎉 Migración completada. Verificá en Supabase Dashboard → Table Editor → posts');
}

seed().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
