const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'gexplo-admin-2024';

export function validateToken(token: string): boolean {
  return token === ADMIN_TOKEN;
}

export const AUTH_COOKIE = 'gexplo_admin_token';
