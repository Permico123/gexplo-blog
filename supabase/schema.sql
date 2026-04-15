-- ─────────────────────────────────────────────────────────────────────────────
-- GEXPLO · Blog — Supabase Schema
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- Tabla principal de posts
create table if not exists posts (
  id            uuid        primary key default gen_random_uuid(),
  title         text        not null,
  subtitle      text,
  slug          text        unique not null,
  key_idea      text        not null,
  content       text        not null,
  cover_image   text        default '',
  tags          text[]      default '{}',
  week_number   integer     not null default 1,
  status        text        not null default 'DRAFT'
                            check (status in ('DRAFT', 'PUBLISHED')),
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Índices para rendimiento
create index if not exists idx_posts_status
  on posts (status);

create index if not exists idx_posts_slug
  on posts (slug);

create index if not exists idx_posts_week_number
  on posts (week_number desc);

-- Row Level Security
alter table posts enable row level security;

-- Lectura pública de posts publicados (usando anon key)
create policy "Public can read published posts"
  on posts for select
  using (status = 'PUBLISHED');

-- Nota: las operaciones de escritura (INSERT, UPDATE, DELETE) se realizan
-- desde el servidor usando la service_role_key, que bypasea RLS automáticamente.
-- No es necesaria una policy adicional para escritura.
