import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** ¿Hay credenciales de Supabase? Si no, la app corre 100% local/offline. */
export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/** Cliente Supabase (singleton) o null si no está configurado. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (client) return client;
  client = createClient(url!, anonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // soporta el enlace mágico (vuelve a la app con sesión)
    },
  });
  return client;
}

// --- Login OPCIONAL por correo (OTP de 6 dígitos o enlace mágico) -----------
// Pensado para coordinadores / usar la misma identidad en varios dispositivos.
// El uso anónimo sigue siendo el camino por defecto, sin barreras.

export async function sendEmailOtp(email: string): Promise<{ ok: boolean; error?: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "La sincronización no está configurada." };
  const emailRedirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/cuenta` : undefined;
  const { error } = await sb.auth.signInWithOtp({
    email: email.trim(),
    options: { shouldCreateUser: true, emailRedirectTo },
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function verifyEmailOtp(email: string, token: string): Promise<{ ok: boolean; error?: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "La sincronización no está configurada." };
  const { error } = await sb.auth.verifyOtp({ email: email.trim(), token: token.trim(), type: "email" });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function signOutAccount(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
}

/**
 * Garantiza una sesión (anónima si hace falta) y devuelve el uid del inspector.
 * Devuelve null si no hay Supabase configurado o no hay red.
 */
export async function ensureAuth(): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data } = await sb.auth.getSession();
    if (data.session?.user) return data.session.user.id;
    const { data: anon, error } = await sb.auth.signInAnonymously();
    if (error) return null;
    return anon.user?.id ?? null;
  } catch {
    return null;
  }
}

export const STORAGE_BUCKET = "inspection-photos";
