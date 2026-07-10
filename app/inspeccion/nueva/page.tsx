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
import { useWakeLock } from "@/lib/useWakeLock";
import type { Inspection } from "@/lib/types";
import { scoreExternal, totalSevereMembers } from "@/lib/funvisis/scoring";
import { validateStep } from "@/lib/funvisis/validation";
import {
  STEP_DECISION,
  STEP_EXTERNAL,
  STEP_SEVERE,
  WIZARD_TOTAL,
  type InspUpdate,
} from "@/components/wizard/types";
import { WizardProgress } from "@/components/wizard/WizardProgress";
import { WizardNav } from "@/components/wizard/WizardNav";
import { StepGeneral } from "@/components/wizard/StepGeneral";
import { StepExternal } from "@/components/wizard/StepExternal";
import { StepSevere } from "@/components/wizard/StepSevere";
import { StepModerate } from "@/components/wizard/StepModerate";
import { StepComponents } from "@/components/wizard/StepComponents";
import { StepDecision } from "@/components/wizard/StepDecision";
import { StepActions } from "@/components/wizard/StepActions";

/** N de miembros con daño Severo/Completo (regla de corte de la Sección 3). */
function severeN(insp: Inspection): number {
  return totalSevereMembers({
    nSevereColumns: insp.nSevereColumns ?? 0,
    nSevereConcreteWalls: insp.nSevereConcreteWalls ?? 0,
    nSevereMasonryWalls: insp.nSevereMasonryWalls ?? 0,
    nSevereBeams: insp.nSevereBeams ?? 0,
  });
}

type Phase = "loading" | "choose" | "active";

export default function NuevaInspeccionPage() {
  const [phase, setPhase] = useState<Phase>("loading");
  useWakeLock(phase === "active"); // pantalla encendida mientras se inspecciona
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

  // Reglas de corte de la planilla: riesgo externo C u N severo ≥ 1 saltan
  // directo al paso 6 (Decisión final); las secciones intermedias se omiten.
  function nextIndex(step: number, cur: Inspection): number {
    if (step === STEP_EXTERNAL && scoreExternal(cur) === "C") return STEP_DECISION;
    if (step === STEP_SEVERE && severeN(cur) >= 1) return STEP_DECISION;
    return Math.min(WIZARD_TOTAL - 1, step + 1);
  }

  function prevIndex(step: number, cur: Inspection): number {
    if (step === STEP_DECISION) {
      if (scoreExternal(cur) === "C") return STEP_EXTERNAL;
      if (severeN(cur) >= 1) return STEP_SEVERE;
    }
    return Math.max(0, step - 1);
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
  // Validación zod por paso: bloquea «Siguiente» y muestra el primer faltante.
  const issues = validateStep(step, insp);
  const canNext = issues.length === 0;
  const externalCut = step === STEP_EXTERNAL && scoreExternal(insp) === "C";
  const severeCut = step === STEP_SEVERE && severeN(insp) >= 1;

  return (
    <AppShell title="Evaluación rápida" back hideNav>
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <WizardProgress step={step} />

        {step === 0 && <StepGeneral insp={insp} update={update} />}
        {step === 1 && <StepExternal insp={insp} update={update} />}
        {step === 2 && <StepSevere insp={insp} update={update} />}
        {step === 3 && <StepModerate insp={insp} update={update} />}
        {step === 4 && <StepComponents insp={insp} update={update} />}
        {step === 5 && <StepDecision insp={insp} update={update} />}
        {step === 6 && <StepActions insp={insp} update={update} finalize={finalize} />}

        <WizardNav
          canBack={step > 0}
          canNext={canNext}
          hideNext={isLast}
          onBack={() => goTo(prevIndex(step, insp))}
          onNext={() => goTo(nextIndex(step, insp))}
          nextLabel={externalCut || severeCut ? "Ir a Decisión final ›" : undefined}
          hint={issues[0]}
        />
      </div>
    </AppShell>
  );
}
