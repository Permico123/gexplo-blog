/**
 * Conversor Markdown -> HTML del blog.
 *
 * Alcance: contenido editorial propio, escrito desde /admin.
 * NO es un sanitizador completo. La deuda tecnica es migrar a un parser
 * Markdown con sanitizacion formal (por ejemplo remark + rehype-sanitize).
 */

/** Allowlist de destinos. Todo lo demas se degrada a texto plano. */
export function isSafeHref(raw: string): boolean {
  const href = raw.trim();
  if (!href) return false;
  if (/^\/\//.test(href)) return false; // bloquea URLs protocol-relative //host/path
  if (/^(\/|#|\.\/|\.\.\/)/.test(href)) return true;
  return /^(https?:|mailto:|tel:)/i.test(href);
}

export function escapeAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderMarkdown(content: string): string {
  return content
    // Imagenes antes que enlaces porque ![alt](src) contiene [alt](src)
    .replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_m, alt: string, src: string) =>
      isSafeHref(src)
        ? `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async">`
        : escapeAttr(alt)
    )
    // Enlaces Markdown. Sin target="_blank" y sin rel automatico.
    .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_m, text: string, href: string) =>
      isSafeHref(href) ? `<a href="${escapeAttr(href)}">${text}</a>` : text
    )
    // Neutralizacion minima del HTML crudo existente.
    .replace(/<\s*\/?\s*(script|iframe|object|embed|form|style)\b[^>]*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>(\n|$))+/g, m => `<ul>${m}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hbupl]|<hr|<block|<a |<img|<ul)(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Limpieza de markup invalido preexistente alrededor de elementos de bloque.
    .replace(/<p>\s*(<\/?(?:h[234]|ul|ol|li|blockquote|hr)\b)/g, '$1')
    .replace(/(<\/(?:h[234]|ul|ol|blockquote)>|<hr>)\s*<\/p>/g, '$1');
}
