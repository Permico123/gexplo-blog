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
