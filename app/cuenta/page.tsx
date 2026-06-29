"use client";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { AppShell } from "@/components/AppShell";
import { Button, Card, CardTitle, Field, Icon, Spinner, TextInput } from "@/components/ui";
import { getProfile, setProfile } from "@/lib/db";
import {
  isSupabaseConfigured,
  sendEmailOtp,
  signOutAccount,
  verifyEmailOtp,
} from "@/lib/supabase";
import { triggerSync } from "@/lib/sync";

export default function CuentaPage() {
  const profile = useLiveQuery(getProfile, []);
  const signedIn = !!profile && !profile.isAnonymous && !!profile.email;

  const [step, setStep] = useState<"idle" | "sent">("idle");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSend() {
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Escribe un correo válido.");
      return;
    }
    setBusy(true);
    const r = await sendEmailOtp(email);
    setBusy(false);
    if (r.ok) setStep("sent");
    else setError(r.error ?? "No se pudo enviar el código.");
  }

  async function onVerify() {
    setError(null);
    if (code.trim().length < 6) {
      setError("Ingresa el código de 6 dígitos.");
      return;
    }
    setBusy(true);
    const r = await verifyEmailOtp(email, code);
    setBusy(false);
    if (!r.ok) setError(r.error ?? "Código incorrecto o vencido.");
    // Si es correcto, onAuthStateChange (Providers) actualiza el perfil y la UI.
  }

  async function onSignOut() {
    setBusy(true);
    await signOutAccount();
    const p = await getProfile();
    if (p) await setProfile({ ...p, email: undefined, isAnonymous: true });
    triggerSync();
    setStep("idle");
    setEmail("");
    setCode("");
    setBusy(false);
  }

  return (
    <AppShell title="Cuenta" back>
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        {!isSupabaseConfigured ? (
          <Card>
            <CardTitle>Modo local</CardTitle>
            <p className="mt-1 text-sm text-slate-600">
              La sincronización en la nube no está configurada en esta instalación. La app
              funciona de todos modos: tus inspecciones se guardan en este dispositivo.
            </p>
          </Card>
        ) : signedIn ? (
          <Card className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-brand">
                <Icon name="user" size={22} />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-slate-500">Sesión iniciada</p>
                <p className="truncate font-semibold text-ink">{profile!.email}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Tu identidad se mantiene en todos tus dispositivos. Útil para coordinadores
              que gestionan zonas o editan desde varios equipos.
            </p>
            <Button variant="secondary" onClick={onSignOut} disabled={busy}>
              {busy ? <Spinner /> : <Icon name="logout" size={18} />} Cerrar sesión
            </Button>
          </Card>
        ) : (
          <Card className="flex flex-col gap-3">
            <CardTitle>Iniciar sesión (opcional)</CardTitle>
            <p className="text-sm text-slate-600">
              No necesitas cuenta para inspeccionar. Inicia sesión solo si eres
              <strong> coordinador</strong> o quieres usar tu misma identidad en varios
              dispositivos. Te enviamos un código por correo (sin contraseña).
            </p>

            {step === "idle" ? (
              <>
                <Field label="Correo electrónico" htmlFor="email">
                  <TextInput
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <Button onClick={onSend} disabled={busy}>
                  {busy ? <Spinner /> : <Icon name="mail" size={18} />} Enviarme un código
                </Button>
              </>
            ) : (
              <>
                <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-brand-ink">
                  Enviamos un código a <strong>{email}</strong>. Revisa tu correo (y la
                  carpeta de spam). Ingresa el código de 6 dígitos, o toca el enlace del
                  correo para entrar directo.
                </p>
                <Field label="Código de 6 dígitos" htmlFor="code">
                  <TextInput
                    id="code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="••••••"
                    className="font-data tracking-[0.5em]"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  />
                </Field>
                <Button onClick={onVerify} disabled={busy}>
                  {busy ? <Spinner /> : <Icon name="check" size={18} />} Verificar e iniciar sesión
                </Button>
                <button
                  type="button"
                  className="touch-target text-sm font-semibold text-brand"
                  onClick={() => {
                    setStep("idle");
                    setCode("");
                    setError(null);
                  }}
                >
                  Usar otro correo
                </button>
              </>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-rojo-ink">{error}</p>
            )}
          </Card>
        )}

        <p className="px-1 text-center text-xs text-slate-400">
          El acceso anónimo siempre está disponible: puedes inspeccionar sin iniciar sesión.
        </p>
      </div>
    </AppShell>
  );
}
