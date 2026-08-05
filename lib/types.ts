export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface Post {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  keyIdea: string;
  content: string;
  coverImage?: string;
  tags: string[];
  weekNumber: number;
  status: PostStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;

// ─── Tipo de contenido ─────────────────────────────────────────────
// Derivado por tag para no requerir migración de esquema: una
// publicación con el tag "guía" (o "guia") pertenece a la sección
// Guías; el resto son entradas de la Bitácora semanal.
export const GUIDE_TAG = 'guía';

export function isGuide(post: Pick<Post, 'tags'>): boolean {
  return post.tags.some(t => {
    const n = t.trim().toLowerCase();
    return n === 'guía' || n === 'guia';
  });
}

// ─── Publicacion programada ────────────────────────────────────────
// Un post con status PUBLISHED y publishedAt en el futuro queda
// agendado: no se lista ni es accesible hasta que llega su fecha.
export function isVisible(post: Pick<Post, 'status' | 'publishedAt'>, now: Date = new Date()): boolean {
  if (post.status !== 'PUBLISHED') return false;
  if (!post.publishedAt) return true;
  return new Date(post.publishedAt).getTime() <= now.getTime();
}

export function isScheduled(post: Pick<Post, 'status' | 'publishedAt'>, now: Date = new Date()): boolean {
  return post.status === 'PUBLISHED' && !!post.publishedAt && new Date(post.publishedAt).getTime() > now.getTime();
}
