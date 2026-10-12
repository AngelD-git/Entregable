import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const noticias = JSON.parse(readFileSync(new URL('../public/data/noticias.json', import.meta.url), 'utf8'));
const ids = new Set();
for (const n of noticias) {
  assert(!ids.has(String(n.id)), `ID duplicado: ${n.id}`);
  ids.add(String(n.id));
  assert(['Tecnología', 'Educación'].includes(n.categoria), `Categoría inválida: ${n.id}`);
  for (const [campo, limite] of Object.entries({ titulo: 220, resumen: 600, contenido: 12000, autor: 100 })) {
    assert(typeof n[campo] === 'string' && n[campo].trim() && n[campo].length <= limite, `${n.id}: ${campo}`);
  }
  assert(new Date(n.fecha + 'T00:00:00Z').toISOString().slice(0, 10) === n.fecha, `Fecha: ${n.id}`);
  assert(/^img\/[\w-]+\.(jpg|png|svg|webp|jpeg)$/.test(n.imagen), `Ruta de imagen: ${n.id}`);
  assert(existsSync(new URL('../public/' + n.imagen, import.meta.url)), `Imagen ausente: ${n.id}`);
  assert(n.referencias?.length > 0 && /\([^)]*(?:\d{4}|s\. f\.)[^)]*\)/.test(n.contenido), `Cita/referencias ausentes: ${n.id}`);
  for (const r of n.referencias) {
    assert(r.autor && r.fecha && r.titulo && new URL(r.url).protocol === 'https:', `Referencia: ${n.id}`);
  }
}
assert.equal(noticias.filter((n) => n.cienciaIA === true).length, 5, 'Se esperan cinco avances de ciencia con IA');
console.log(`${noticias.length} noticias: IDs, fechas, límites, imágenes locales y citas/referencias correctos.`);
