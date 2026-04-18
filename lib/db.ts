import postgres from 'postgres';

// Lazy singleton — one connection pool per cold-start in serverless
let _sql: ReturnType<typeof postgres> | null = null;

/**
 * Returns a postgres.js SQL client connected directly to Supabase's
 * PostgreSQL instance, bypassing PostgREST entirely.
 *
 * Requires DATABASE_URL to be set in the environment:
 *   Format: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
 *   (copy from Supabase Dashboard → Settings → Database → Connection string → URI, mode: Transaction)
 */
export function getDb(): ReturnType<typeof postgres> {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        'DATABASE_URL is not set. ' +
        'Add the Supabase direct connection string to your Vercel environment variables. ' +
        'Find it at: Supabase Dashboard → Settings → Database → Connection string → URI (Transaction mode, port 6543).'
      );
    }
    _sql = postgres(url, {
      ssl:             'require',
      max:             1,     // Serverless: one connection per function instance
      idle_timeout:    20,    // Release idle connections quickly
      connect_timeout: 10,
      prepare:         false, // Required for PgBouncer transaction-mode pooler
    });
  }
  return _sql;
}
