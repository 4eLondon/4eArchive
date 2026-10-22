export function normalizeCode(code: string): string {
  return String(code ?? '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
}
