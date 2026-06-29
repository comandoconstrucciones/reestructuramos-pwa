"use client";
import { useState } from "react";
import Link from "next/link";
import { ROLE_OPTIONS } from "@/lib/catalog";
import type { InspectorProfile, Role } from "@/lib/types";
import { Button, Card, Field, OptionGrid, TextInput } from "@/components/ui";
import { OnboardingShell } from "./OnboardingShell";

/** Nivel de credencial según el rol declarado. */
function credentialFor(role: Role): number {
  if (role === "coordinador") return 3;
  if (role === "ingeniero" || role === "arquitecto") return 2;
  return 1; // voluntario
}

/**
 * Registro ligero OPCIONAL al final del onboarding. El inspector puede
 * identificarse (nombre, cédula, rol) o continuar de forma anónima.
 */
export function Registration({
  onSubmit,
  onAnon,
}: {
  onSubmit: (patch: Partial<InspectorProfile>) => void;
  onAnon: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [role, setRole] = useState<Role | undefined>(undefined);

  const hasData = fullName.trim() !== "" || nationalId.trim() !== "" || role !== undefined;

  const save = () => {
    const effectiveRole: Role = role ?? "voluntario";
    onSubmit({
      fullName: fullName.trim() || undefined,
      nationalId: nationalId.trim() || undefined,
      role: effectiveRole,
      credentialLevel: credentialFor(effectiveRole),
      isAnonymous: false,
    });
  };

  return (
    <OnboardingShell
      progress={1}
      footer={
        <div className="space-y-3">
          <Button variant="primary" fullWidth onClick={save} disabled={!hasData}>
            Guardar y comenzar
          </Button>
          <Button variant="ghost" fullWidth onClick={onAnon}>
            Continuar como anónimo
          </Button>
        </div>
      }
    >
      <h1 className="pt-2 text-2xl font-extrabold text-ink">Identifícate (opcional)</h1>
      <p className="mt-2 text-lg text-slate-600">
        Tus datos aparecen en los reportes y firman tus inspecciones. Puedes omitir este paso y
        trabajar de forma anónima.
      </p>
      <Link href="/cuenta" className="mt-3 inline-block text-sm font-semibold text-brand">
        ¿Eres coordinador y ya tienes cuenta? Inicia sesión con tu correo →
      </Link>

      <div className="mt-6 space-y-5">
        <Field label="Nombre completo" htmlFor="reg-name">
          <TextInput
            id="reg-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ej. Ana Pérez"
            autoComplete="name"
          />
        </Field>

        <Field label="Cédula" htmlFor="reg-id" help="Documento de identidad (solo números).">
          <TextInput
            id="reg-id"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            placeholder="Ej. V-12345678"
            inputMode="text"
            autoComplete="off"
          />
        </Field>

        <Field label="Rol" help="Define tu nivel de credencial para las evaluaciones.">
          <OptionGrid
            options={ROLE_OPTIONS}
            value={role}
            onChange={(v) => setRole(v as Role)}
            columns={2}
          />
        </Field>

        <Card className="bg-sky-50">
          <p className="text-sm text-slate-600">
            Puedes cambiar estos datos más tarde desde tu perfil. La inspección siempre registra
            ubicación GPS y fecha/hora, identifíquate o no.
          </p>
        </Card>
      </div>
    </OnboardingShell>
  );
}
