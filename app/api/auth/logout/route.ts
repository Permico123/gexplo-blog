import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Redirige relativo al host de la request (el admin vive en blog.gexplo.com).
  const res = NextResponse.redirect(new URL('/admin/login', req.url));
  res.cookies.delete(AUTH_COOKIE);
  return res;
}
