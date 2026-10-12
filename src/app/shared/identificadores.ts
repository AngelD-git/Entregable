/** IDs del catálogo y noticias locales; rechaza objetos y coerciones arbitrarias. */
export function idValido(id: unknown): boolean {
  return (typeof id === 'string' || typeof id === 'number') && /^(?:[1-9]\d{0,8}|u[\w-]{1,80})$/.test(String(id));
}
