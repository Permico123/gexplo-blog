'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/lib/types';

interface Props {
  mode: 'create' | 'edit';
  post?: Post;
}

export default function PostForm({ mode, post }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  const [form, setForm] = useState({
    title: post?.title || '',
    subtitle: post?.subtitle || '',
    slug: post?.slug || '',
    keyIdea: post?.keyIdea || '',
    content: post?.content || '',
    coverImage: post?.coverImage || '',
    tags: post?.tags?.join(', ') || '',
    weekNumber: post?.weekNumber?.toString() || '',
    status: post?.status || 'DRAFT',
  });

  function autoSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'title' && mode === 'create' && !prev.slug) {
        updated.slug = autoSlug(value);
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      slug: form.slug,
      keyIdea: form.keyIdea,
      content: form.content,
      coverImage: form.coverImage,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      weekNumber: parseInt(form.weekNumber) || 1,
      status: form.status,
      publishedAt: form.status === 'PUBLISHED' && !post?.publishedAt ? new Date().toISOString() : post?.publishedAt,
    };

    let res: Response;
    if (mode === 'create') {
      res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch(`/api/posts/${post!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Error al guardar la publicación.');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4' }}>
      {/* Admin header */}
      <header style={{ backgroundColor: '#1C3A2B', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin" style={{ color: '#6B8F7A', fontSize: '0.82rem', textDecoration: 'none' }}>
            ← Volver al panel
          </Link>
        </div>
        <span style={{ fontFamily: 'Georgia, serif', fontWeight: '700', color: '#F8F7F4', fontSize: '0.95rem' }}>
          {mode === 'create' ? 'Nueva edición' : 'Editar publicación'}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setPreview(!preview)}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #2D4F3A',
              color: '#9BB8A8',
              padding: '5px 14px',
              borderRadius: '4px',
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            {preview ? 'Editar' : 'Preview'}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1C3A2B', marginBottom: '0.25rem' }}>
          {mode === 'create' ? 'Nueva edición semanal' : `Editar: ${post?.title}`}
        </h1>
        <p style={{ fontSize: '0.82rem', color: '#6B7C74', marginBottom: '2rem' }}>
          {mode === 'create'
            ? 'Completá los campos para crear una nueva entrada del laboratorio editorial.'
            : 'Modificá los campos y guardá los cambios.'}
        </p>

        {error && (
          <div
            style={{
              backgroundColor: '#FFF5F5',
              border: '1px solid #FC8181',
              borderRadius: '5px',
              padding: '0.75rem 1rem',
              fontSize: '0.85rem',
              color: '#C53030',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        {preview ? (
          <div
            style={{
              backgroundColor: '#fff',
              border: '1px solid #D8D4CC',
              borderRadius: '8px',
              padding: '2.5rem',
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <span
                style={{
                  backgroundColor: '#E8F3EC',
                  color: '#2D6A4F',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '4px 12px',
                  borderRadius: '100px',
                }}
              >
                Semana {String(form.weekNumber).padStart(2, '0')}
              </span>
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#1C3A2B', marginBottom: '0.75rem' }}>
              {form.title || 'Sin título'}
            </h2>
            {form.subtitle && <p style={{ color: '#4A6358', fontSize: '1rem', marginBottom: '1rem' }}>{form.subtitle}</p>}
            {form.keyIdea && (
              <div style={{ borderLeft: '4px solid #40916C', paddingLeft: '1rem', marginBottom: '1.5rem', color: '#2D6A4F', fontStyle: 'italic', fontSize: '0.95rem' }}>
                &ldquo;{form.keyIdea}&rdquo;
              </div>
            )}
            <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: '#2C3E35', whiteSpace: 'pre-wrap' }}>
              {form.content}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <Field label="Número de semana" name="weekNumber" type="number" value={form.weekNumber} onChange={handleChange} placeholder="1" required />
              <Field label="Estado" name="status" type="select" value={form.status} onChange={handleChange} required options={[{ value: 'DRAFT', label: 'Borrador' }, { value: 'PUBLISHED', label: 'Publicado' }]} />
            </div>

            <Field label="Título" name="title" value={form.title} onChange={handleChange} placeholder="De informes aislados a un sistema técnico auditable" required full />
            <Field label="Subtítulo (opcional)" name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="El primer paso de la transformación..." full />
            <Field label="Slug (URL)" name="slug" value={form.slug} onChange={handleChange} placeholder="de-informes-aislados-a-sistema-tecnico-auditable" required full />
            <Field label="Idea clave (extracto)" name="keyIdea" type="textarea" rows={2} value={form.keyIdea} onChange={handleChange} placeholder="Cada dato de campo y laboratorio debe ser auditable..." required full />

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#2C3E35', marginBottom: '6px' }}>
                Contenido <span style={{ color: '#6B7C74', fontWeight: '400' }}>(Markdown soportado)</span>
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={18}
                required
                placeholder="## El punto de partida&#10;&#10;Escribí el contenido en Markdown..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #D8D4CC',
                  borderRadius: '5px',
                  fontSize: '0.88rem',
                  backgroundColor: '#fff',
                  fontFamily: 'monospace',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  outline: 'none',
                  color: '#2C3E35',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <Field label="URL imagen destacada" name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="https://..." />
              <Field label="Tags (separados por coma)" name="tags" value={form.tags} onChange={handleChange} placeholder="trazabilidad, datos, ambiente" />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #E8E4DC' }}>
              <Link
                href="/admin"
                style={{
                  color: '#6B7C74',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '5px',
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  border: '1px solid #D8D4CC',
                }}
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#A0C4B3' : '#2D6A4F',
                  color: '#fff',
                  border: 'none',
                  padding: '0.65rem 1.75rem',
                  borderRadius: '5px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Guardando...' : mode === 'create' ? 'Crear publicación' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  full?: boolean;
  options?: { value: string; label: string }[];
}

function Field({ label, name, value, onChange, type = 'text', placeholder, required, rows, full, options }: FieldProps) {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.65rem 0.875rem',
    border: '1px solid #D8D4CC',
    borderRadius: '5px',
    fontSize: '0.88rem',
    backgroundColor: '#fff',
    outline: 'none',
    color: '#2C3E35',
  };

  return (
    <div style={{ marginBottom: full ? '1.25rem' : 0 }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#2C3E35', marginBottom: '6px' }}>
        {label}
      </label>
      {type === 'select' ? (
        <select name={name} value={value} onChange={onChange} required={required} style={inputStyle}>
          {options?.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows || 3}
          required={required}
          placeholder={placeholder}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          style={inputStyle}
        />
      )}
    </div>
  );
}
