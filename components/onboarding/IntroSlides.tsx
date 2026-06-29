"use client";
import { useState, type ReactNode } from "react";
import { PLACARD_META } from "@/lib/placard";
import type { Placard } from "@/lib/types";
import { Button, Card, PlacardBadge } from "@/components/ui";
import { OnboardingShell } from "./OnboardingShell";

/** Línea de viñeta con punto de marca (mínima lectura, alto contraste). */
function CheckLine({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span aria-hidden className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand" />
      <span className="text-lg leading-snug text-ink">{children}</span>
    </li>
  );
}

/** Tarjeta de principio numerada. */
function PrincipleCard({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <Card className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-base font-extrabold text-white">
        {n}
      </span>
      <div>
        <p className="text-lg font-bold text-ink">{title}</p>
        <p className="mt-0.5 text-base text-slate-600">{body}</p>
      </div>
    </Card>
  );
}

/** Una fila por cartel reutilizando <PlacardBadge> + su texto oficial. */
function PlacardRow({ placard }: { placard: Exclude<Placard, "none"> }) {
  const meta = PLACARD_META[placard];
  return (
    <Card className="flex items-center gap-4">
      <PlacardBadge placard={placard} size="sm" showSub={false} />
      <div>
        <p className="text-base font-extrabold text-ink">{meta.label}</p>
        <p className="text-sm text-slate-600">{meta.sublabel}</p>
      </div>
    </Card>
  );
}

interface Slide {
  key: string;
  title: string;
  lead: string;
  content: ReactNode;
}

const SLIDES: Slide[] = [
  {
    key: "que-es",
    title: "¿Qué es reestructuramos?",
    lead: "Una herramienta de campo para evaluar la seguridad de las edificaciones después de un sismo, como los terremotos M7.2 y M7.5 del 24 de junio de 2026 en Venezuela.",
    content: (
      <ul className="mt-5 space-y-3">
        <CheckLine>Realiza evaluaciones rápidas siguiendo ATC-20 y la norma COVENIN 1756.</CheckLine>
        <CheckLine>Registra los daños con fotos, ubicación GPS y fecha/hora.</CheckLine>
        <CheckLine>Te sugiere un cartel de seguridad para cada edificio inspeccionado.</CheckLine>
        <CheckLine>Funciona aunque no tengas señal: todo se guarda en tu teléfono.</CheckLine>
      </ul>
    ),
  },
  {
    key: "carteles",
    title: "El sistema de carteles",
    lead: "Cada inspección termina con un cartel de color que indica si el edificio puede usarse.",
    content: (
      <div className="mt-5 space-y-3">
        <PlacardRow placard="verde" />
        <PlacardRow placard="amarillo" />
        <PlacardRow placard="rojo" />
        <p className="px-1 pt-1 text-sm text-slate-500">
          Ante la duda entre dos carteles, usa siempre el criterio más conservador para proteger vidas.
        </p>
      </div>
    ),
  },
  {
    key: "principios",
    title: "Cómo trabajamos",
    lead: "Cuatro principios que hacen que cada inspección sea confiable y auditable.",
    content: (
      <div className="mt-5 space-y-3">
        <PrincipleCard
          n={1}
          title="Evidencia ligada al hallazgo"
          body="Cada foto se asocia al daño que documenta. Nada de álbumes sueltos."
        />
        <PrincipleCard
          n={2}
          title="Nunca se sobrescribe el historial"
          body="Una re-inspección (por ejemplo, tras una réplica) es un registro NUEVO, no una edición del anterior."
        />
        <PrincipleCard
          n={3}
          title="GPS y fecha/hora siempre"
          body="Cada inspección y cada foto guardan dónde y cuándo se tomaron."
        />
        <PrincipleCard
          n={4}
          title="La app sugiere; tú decides"
          body="El cartel sugerido es una guía. El criterio final lo pone el inspector."
        />
      </div>
    ),
  },
  {
    key: "offline",
    title: "Trabaja sin conexión",
    lead: "Diseñada para zonas sin internet, donde más se necesita.",
    content: (
      <ul className="mt-5 space-y-3">
        <CheckLine>Todo se guarda primero en tu teléfono. No pierdes datos.</CheckLine>
        <CheckLine>Puedes inspeccionar sin señal durante toda la jornada.</CheckLine>
        <CheckLine>Cuando vuelva el internet, tus inspecciones se sincronizan solas.</CheckLine>
        <CheckLine>Antes de salir a una zona, descarga el mapa del área desde el inicio.</CheckLine>
      </ul>
    ),
  },
];

/** Carrusel de inducción (3–5 pantallas) con barra de progreso. */
export function IntroSlides({ onDone, onSkip }: { onDone: () => void; onSkip: () => void }) {
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;
  const slide = SLIDES[index];
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => (isLast ? onDone() : setIndex((i) => Math.min(total - 1, i + 1)));

  return (
    <OnboardingShell
      progress={(index + 1) / total}
      onSkip={onSkip}
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={prev} disabled={isFirst}>
            Atrás
          </Button>
          <Button variant="primary" fullWidth onClick={next}>
            {isLast ? "Comenzar quiz" : "Siguiente"}
          </Button>
        </div>
      }
    >
      <p className="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Paso {index + 1} de {total}
      </p>
      <h1 className="mt-1 text-2xl font-extrabold text-ink">{slide.title}</h1>
      <p className="mt-2 text-lg text-slate-600">{slide.lead}</p>
      {slide.content}
    </OnboardingShell>
  );
}
