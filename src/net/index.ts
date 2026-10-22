import type { Transport } from './transport';
import { createWsTransport } from './wsTransport';
import { createSupabaseTransport } from './supabaseTransport';

/**
 * Backend selection (see README):
 *   VITE_BACKEND=supabase + VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY -> Supabase
 *   otherwise -> the bundled Node realtime server on /ws
 */
export function createTransport(): Transport {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (import.meta.env.VITE_BACKEND === 'supabase') {
    if (!url || !key) throw new Error('VITE_BACKEND=supabase needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    return createSupabaseTransport(url, key);
  }
  return createWsTransport();
}
