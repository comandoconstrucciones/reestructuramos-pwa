"use client";
// Guía de campo offline: referencia rápida durante la inspección.
// Tres secciones por pestañas (patrones de daño, árbol de decisión, glosario).
// Todo se sirve desde catálogos locales (@/lib/catalog) — funciona sin red.
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/cn";
import { DAMAGE_PATTERNS } from "@/lib/catalog";
import { DamagePatternCard } from "@/components/guide/DamagePatternCard";
import { DecisionTree } from "@/components/guide/DecisionTree";
import { Glossary } from "@/components/guide/Glossary";

const TABS = [
  { id: "patrones", label: "Patrones de daño" },
  { id: "arbol", label: "Árbol de decisión" },
  { id: "glosario", label: "Glosario" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function GuiaPage() {
  const [tab, setTab] = useState<TabId>("patrones");

  return (
    <AppShell title="Guía de campo">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <p className="text-sm text-slate-500">
          Referencia rápida para la inspección. Disponible sin conexión.
        </p>

        <div
          role="tablist"
          aria-label="Secciones de la guía"
          className="sticky top-14 z-10 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1"
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={cn(
                  "touch-target rounded-lg px-2 text-sm font-semibold leading-tight transition-colors",
                  active ? "bg-white text-brand shadow-sm" : "text-slate-600 active:bg-slate-200",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "patrones" && (
          <section aria-label="Patrones de daño" className="flex flex-col gap-3">
            {DAMAGE_PATTERNS.map((pattern) => (
              <DamagePatternCard key={pattern.id} pattern={pattern} />
            ))}
          </section>
        )}

        {tab === "arbol" && (
          <section aria-label="Árbol de decisión" className="flex flex-col gap-3">
            <p className="text-sm text-slate-500">
              Recorre los pasos en orden. Ante la duda, usa el criterio más conservador.
            </p>
            <DecisionTree />
          </section>
        )}

        {tab === "glosario" && (
          <section aria-label="Glosario">
            <Glossary />
          </section>
        )}
      </div>
    </AppShell>
  );
}
