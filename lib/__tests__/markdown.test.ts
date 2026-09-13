import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown, isSafeHref } from '../markdown';

const JS = 'java' + 'script:';
const DATA = 'da' + 'ta:';
const VBS = 'vb' + 'script:';

test('acepta rutas internas, anclas y esquemas permitidos', () => {
  for (const h of ['/ruta', '/blog/slug', './ruta', '../ruta', '#ancla',
                   'https://gexplo.com/x', 'http://ejemplo.com/x',
                   'mailto:info@gexplo.com', 'tel:+5493434506385']) {
    assert.equal(isSafeHref(h), true, `deberia aceptar ${h}`);
  }
});

test('SEC-01: rechaza URL de protocolo relativo //host', () => {
  for (const h of ['//evil.tld', '//evil.tld/path', '  //evil.tld/path  ', '///evil.tld']) {
    assert.equal(isSafeHref(h), false, `deberia rechazar ${h}`);
  }
});

test('rechaza esquemas peligrosos', () => {
  for (const h of [JS + 'alert(1)', JS.toUpperCase() + 'alert(1)', DATA + 'text/html,x',
                   VBS + 'msgbox', '', '   ']) {
    assert.equal(isSafeHref(h), false, `deberia rechazar ${JSON.stringify(h)}`);
  }
});

test('renderiza enlaces internos sin rel', () => {
  assert.match(renderMarkdown('[guia](/blog/x)'), /<a href="\/blog\/x">guia<\/a>/);
});

test('renderiza enlaces externos sin nofollow, ugc ni noopener', () => {
  const out = renderMarkdown('[norma](https://www.argentina.gob.ar/normativa)');
  assert.match(out, /<a href="https:\/\/www\.argentina\.gob\.ar\/normativa">norma<\/a>/);
  assert.doesNotMatch(out, /nofollow|ugc|noopener/);
});

test('nunca emite target=_blank', () => {
  const out = renderMarkdown('[a](/x) [b](https://ejemplo.com) ![i](/i.png)');
  assert.doesNotMatch(out, /target=/);
});

test('SEC-01: //host se degrada a texto plano, no a enlace', () => {
  const out = renderMarkdown('[x](//evil.tld/a)');
  assert.doesNotMatch(out, /<a /);
  assert.match(out, /x/);
});

test('esquemas peligrosos se degradan a texto plano', () => {
  for (const h of [JS + 'alert(1)', DATA + 'text/html;base64,PHM+', VBS + 'msgbox']) {
    const out = renderMarkdown(`[click](${h})`);
    assert.doesNotMatch(out, /<a /, `no deberia emitir <a> para ${h}`);
  }
});

test('escapa ampersand en el href', () => {
  const out = renderMarkdown('[x](/ruta&a=1)');
  assert.match(out, /href="\/ruta&amp;a=1"/);
});

test('renderiza imagenes con lazy loading', () => {
  const out = renderMarkdown('![Un pozo](https://cdn.ejemplo.com/p.jpg)');
  assert.match(out, /<img src="https:\/\/cdn\.ejemplo\.com\/p\.jpg" alt="Un pozo" loading="lazy" decoding="async">/);
});

test('imagen con esquema peligroso deja solo el alt', () => {
  const out = renderMarkdown(`![texto alt](${JS}alert(1))`);
  assert.doesNotMatch(out, /<img/);
  assert.match(out, /texto alt/);
});

test('la imagen tiene precedencia sobre el enlace', () => {
  const out = renderMarkdown('![alt](/i.png)');
  assert.match(out, /<img/);
  assert.doesNotMatch(out, /<a /);
});

test('elimina etiquetas peligrosas', () => {
  for (const t of ['<script>alert(1)</script>', '<iframe src="//evil.tld"></iframe>',
                   '<object data="x">', '<embed src="x">', '<form action="/x">',
                   '<style>body{display:none}</style>']) {
    const out = renderMarkdown(t);
    assert.doesNotMatch(out, /<(script|iframe|object|embed|form|style)\b/i, `no filtro ${t}`);
  }
});

test('elimina atributos on*', () => {
  assert.doesNotMatch(renderMarkdown('<img src=x onerror=alert(1)>'), /onerror/);
  assert.doesNotMatch(renderMarkdown('<a href="/x" onclick="alert(1)">y</a>'), /onclick/);
});

test('mantiene la sintaxis preexistente', () => {
  assert.equal(renderMarkdown('## Titulo'), '<h2>Titulo</h2>');
  assert.equal(renderMarkdown('### Sub'), '<h3>Sub</h3>');
  assert.equal(renderMarkdown('#### Sub4'), '<h4>Sub4</h4>');
  assert.match(renderMarkdown('**fuerte**'), /<strong>fuerte<\/strong>/);
  assert.match(renderMarkdown('*enfasis*'), /<em>enfasis<\/em>/);
  assert.match(renderMarkdown('> cita'), /<blockquote><p>cita<\/p><\/blockquote>/);
  assert.equal(renderMarkdown('---'), '<hr>');
  assert.match(renderMarkdown('- uno\n- dos'), /<ul><li>uno<\/li>\n<li>dos<\/li><\/ul>/);
  assert.match(renderMarkdown('`codigo`'), /<code>codigo<\/code>/);
});

test('no altera textos sin markdown de enlace', () => {
  for (const t of ['Un parrafo normal sin nada especial.',
                   'La formula es a [1] y b [2] segun la norma.',
                   'Ver figura (3) y tabla [A].',
                   'Precio entre 1.200 y 2.000 (USD) por estudio.',
                   'El 40/70 y el 30/70 son mallas distintas.',
                   'Escribi a info@gexplo.com o entra a https://gexplo.com/model']) {
    assert.equal(renderMarkdown(t), `<p>${t}</p>`, `altero: ${t}`);
  }
});

test('no deja cierre de parrafo huerfano despues de un heading', () => {
  const out = renderMarkdown('## Titulo\n\nParrafo.');
  assert.doesNotMatch(out, /<h2>Titulo<\/h2>\s*<\/p>/);
});
