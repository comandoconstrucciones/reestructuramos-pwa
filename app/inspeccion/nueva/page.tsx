"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button, Card, CardTitle, PlacardDot, Spinner } from "@/components/ui";
import {
  createDraftInspection,
  createReinspection,
  finalizeInspection,
  getInspection,
  listDrafts,
  patchInspection,
} from "@/lib/db";
import { useSyncStore } from "@/lib/store";
import type { Inspection } from "@/lib/types";
import { WIZARD_TOTAL, type InspUpdate } from "@/components/wizard/types";
import { WizardProgress } from "@/components/wizard/WizardProgress";
import { WizardNav } from "@/components/wizard/WizardNav";
import { StepLocation } from "@/components/wizard/StepLocation";
import { StepBuilding } from "@/components/wizard/StepBuilding";
import { StepHazards } from "@/components/wizard/StepHazards";
import { StepDamage } from "@/components/wizard/StepDamage";
import { StepResult } from "@/components/wizard/StepResult";

type Phase = "loading" | "choose" | "active";

export default function NuevaInspeccionPage() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [recentDraft, setRecentDraft] = useState<Inspection | null>(null);
  const [insp, setInsp] = useState<Inspection | null>(null);

  // Refs para autosave seguro fuera del ciclo de render.
  const inspRef = useRef<Inspection | null>(null);
  useEffect(() => {
    inspRef.current = insp;
  }, [insp]);
  // Cola que serializa las escrituras -> sin condiciones de carrera.
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  // Al montar: reanudar un borrador concreto (?draft=), re-inspeccionar un
  // edificio (?building=), elegir entre borradores, o crear uno nuevo.
  const createdRef = useRef(false);
  useEffect(() => {
    let active = true;
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const draftId = params.get("draft");
      const buildingId = params.get("building");

      if (draftId) {
        const d = await getInspection(draftId);
        if (!active) return;
        if (d && d.status === "draft") {
          inspRef.current = d;
          setInsp(d);
          setPhase("active");
          return;
        }
      }
      if (buildingId) {
        const fresh = await createReinspection(buildingId);
        if (!active) return;
        inspRef.current = fresh;
        setInsp(fresh);
        setPhase("active");
        return;
      }
      const drafts = await listDrafts();
      if (!active) return;
      if (drafts.length > 0) {
        setRecentDraft(drafts[0]);
        setPhase("choose");
        return;
      }
      if (createdRef.current) return; // guarda contra doble-montaje (StrictMode)
      createdRef.current = true;
      const created = await createDraftInspection();
      if (!active) return;
      inspRef.current = created;
      setInsp(created);
      setPhase("active");
    })();
    return () => {
      active = false;
    };
  }, []);

  // Autosave: feedback optimista + persistencia serializada. Escritura PARCIAL
  // (patchInspection) que jamás reescribe el registro completo -> no puede
  // revertir un finalize ya aplicado.
  const update = useCallback<InspUpdate>((u) => {
    setInsp((prev) => {
      if (!prev) return prev;
      return typeof u === "function" ? prev : { ...prev, ...u };
    });
    writeQueue.current = writeQueue.current
      .then(async () => {
        const uuid = inspRef.current?.clientUuid;
        if (!uuid) return;
        // Lee fresco (incluye photoIds que PhotoCapture pudo añadir) para
        // calcular el parche, pero escribe SOLO las claves del parche.
        const fresh = (await getInspection(uuid)) ?? inspRef.current;
        if (!fresh) return;
        const patch = typeof u === "function" ? u(fresh) : u;
        await patchInspection(uuid, patch);
        const merged = { ...fresh, ...patch, updatedAt: new Date().toISOString() };
        inspRef.current = merged;
        setInsp(merged);
      })
      .catch(() => {
        // Fallo de persistencia local (p.ej. cuota llena): avisar, no silenciar.
        useSyncStore
          .getState()
          .setError("No se pudo guardar localmente. Revisa el almacenamiento del dispositivo.");
      });
  }, []);

  // Finaliza atómicamente: drena la cola de autosave ANTES de marcar completo,
  // para no perder el último cambio (cartel, motivo, firma) ni dejar carreras.
  const finalize = useCallback(async () => {
    await writeQueue.current;
    const uuid = inspRef.current?.clientUuid;
    if (uuid) await finalizeInspection(uuid);
  }, []);

  function continueDraft() {
    if (!recentDraft) return;
    inspRef.current = recentDraft;
    setInsp(recentDraft);
    setPhase("active");
  }

  async function startNew() {
    const fresh = await createDraftInspection();
    inspRef.current = fresh;
    setInsp(fresh);
    setPhase("active");
  }

  function goTo(step: number) {
    const clamped = Math.max(0, Math.min(WIZARD_TOTAL - 1, step));
    update({ step: clamped });
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  // --- Render ---------------------------------------------------------------

  if (phase === "loading") {
    return (
      <AppShell title="Evaluación rápida" back hideNav>
        <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
          <Spinner /> Preparando…
        </div>
      </AppShell>
    );
  }

  if (phase === "choose") {
    return (
      <AppShell title="Evaluación rápida" back hideNav>
        <div className="mx-auto flex max-w-lg flex-col gap-4">
          <Card className="flex flex-col gap-3">
            <CardTitle>Tienes un borrador sin terminar</CardTitle>
            {recentDraft && (
              <div className="rounded-xl bg-slate-50 p-3 text-sm">
                <div className="flex items-center gap-2 font-semibold text-ink">
                  <PlacardDot placard={recentDraft.placardSuggested} />
                  {recentDraft.building.address || "Edificio sin dirección"}
                </div>
                <div className="mt-1 text-slate-500">
                  Paso {Math.min(WIZARD_TOTAL, recentDraft.step + 1)} de {WIZARD_TOTAL} ·{" "}
                  {new Date(recentDraft.updatedAt).toLocaleString("es-VE")}
                </div>
              </div>
            )}
            <Button variant="primary" size="lg" fullWidth onClick={continueDraft}>
              Continuar borrador
            </Button>
            <Button variant="secondary" size="lg" fullWidth onClick={startNew}>
              Nueva inspección
            </Button>
          </Card>
        </div>
      </AppShell>
    );
  }

  // phase === "active"
  if (!insp) {
    return (
      <AppShell title="Evaluación rápida" back hideNav>
        <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
          <Spinner /> Cargando…
        </div>
      </AppShell>
    );
  }

  const step = Math.max(0, Math.min(WIZARD_TOTAL - 1, insp.step));
  const isLast = step === WIZARD_TOTAL - 1;
  const locationOk = insp.lat != null && insp.lng != null;
  const canNext = step === 0 ? locationOk : true;

  return (
    <AppShell title="Evaluación rápida" back hideNav>
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <WizardProgress step={step} />

        {step === 0 && <StepLocation insp={insp} update={update} />}
        {step === 1 && <StepBuilding insp={insp} update={update} />}
        {step === 2 && <StepHazards insp={insp} update={update} />}
        {step === 3 && <StepDamage insp={insp} update={update} />}
        {step === 4 && <StepResult insp={insp} update={update} finalize={finalize} />}

        <WizardNav
          canBack={step > 0}
          canNext={canNext}
          hideNext={isLast}
          onBack={() => goTo(step - 1)}
          onNext={() => goTo(step + 1)}
          hint={
            step === 0
              ? "Obtén tu ubicación o toca el mapa para continuar."
              : undefined
          }
        />
      </div>
    </AppShell>
  );
}
