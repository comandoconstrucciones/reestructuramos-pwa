"use client";
import { useState } from "react";
import { QUIZ_QUESTIONS, QUIZ_PASS_THRESHOLD } from "@/lib/catalog";
import { Button, Card, Icon, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";
import { OnboardingShell } from "./OnboardingShell";

type Phase = "asking" | "result";

/**
 * Mini-quiz de habilitación: una pregunta por pantalla, opciones como botones
 * grandes y feedback con explicación al responder. Aprobado si
 * aciertos/total >= QUIZ_PASS_THRESHOLD; si reprueba, puede reintentar.
 */
export function Quiz({ onPass, onSkip }: { onPass: () => void; onSkip: () => void }) {
  const total = QUIZ_QUESTIONS.length;
  const [phase, setPhase] = useState<Phase>("asking");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const q = QUIZ_QUESTIONS[index];
  const selected = answers[q.id];
  const revealed = selected !== undefined;
  const isLast = index === total - 1;

  const correctCount = QUIZ_QUESTIONS.filter((x) => answers[x.id] === x.correct).length;
  const score = total > 0 ? correctCount / total : 0;
  const passed = score >= QUIZ_PASS_THRESHOLD;
  const scorePct = Math.round(score * 100);

  const choose = (optId: string) => {
    if (revealed) return; // respuesta bloqueada tras revelar
    setAnswers((a) => ({ ...a, [q.id]: optId }));
  };

  const advance = () => (isLast ? setPhase("result") : setIndex((i) => i + 1));

  const retry = () => {
    setAnswers({});
    setIndex(0);
    setPhase("asking");
  };

  // --- Pantalla de resultado ------------------------------------------------
  if (phase === "result") {
    const missed = QUIZ_QUESTIONS.filter((x) => answers[x.id] !== x.correct);
    return (
      <OnboardingShell
        progress={1}
        onSkip={onSkip}
        footer={
          passed ? (
            <Button variant="success" fullWidth onClick={onPass}>
              Continuar
            </Button>
          ) : (
            <Button variant="primary" fullWidth onClick={retry}>
              Reintentar
            </Button>
          )
        }
      >
        <div className="pt-4 text-center">
          <div
            className={cn(
              "mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl font-black text-white",
              passed ? "bg-verde" : "bg-amarillo",
            )}
            aria-hidden
          >
            {passed ? <Icon name="check" size={40} /> : <Icon name="alert" size={36} />}
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-ink">
            {passed ? "¡Quedaste habilitado!" : "Aún no apruebas"}
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Acertaste <span className="font-bold text-ink">{correctCount}</span> de {total} ({scorePct}%).
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Se requiere al menos {Math.round(QUIZ_PASS_THRESHOLD * 100)}% para habilitarte.
          </p>
        </div>

        {!passed && missed.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-base font-bold text-ink">Repasa esto antes de reintentar:</p>
            {missed.map((m) => (
              <Card key={m.id} className="border-l-4 border-l-amarillo">
                <p className="text-base font-semibold text-ink">{m.question}</p>
                <p className="mt-1 text-sm text-slate-600">{m.explanation}</p>
              </Card>
            ))}
          </div>
        )}
      </OnboardingShell>
    );
  }

  // --- Pantalla de pregunta -------------------------------------------------
  return (
    <OnboardingShell
      progress={(index + 1) / total}
      onSkip={onSkip}
      footer={
        <Button variant="primary" fullWidth onClick={advance} disabled={!revealed}>
          {isLast ? "Ver resultado" : "Siguiente"}
        </Button>
      }
    >
      <p className="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Pregunta {index + 1} de {total}
      </p>
      <h1 className="mt-1 text-xl font-extrabold leading-snug text-ink">{q.question}</h1>

      <div className="mt-5 space-y-3">
        {q.options.map((opt) => {
          const isChosen = selected === opt.id;
          const isCorrect = opt.id === q.correct;
          let stateCls = "border-slate-200 bg-white active:bg-slate-50";
          let marker: IconName | null = null;
          if (revealed) {
            if (isCorrect) {
              stateCls = "border-verde bg-green-50";
              marker = "check";
            } else if (isChosen) {
              stateCls = "border-rojo bg-red-50";
              marker = "x";
            } else {
              stateCls = "border-slate-200 bg-white opacity-60";
            }
          }
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => choose(opt.id)}
              disabled={revealed}
              aria-pressed={isChosen}
              className={cn(
                "touch-target flex w-full items-center justify-between gap-3 rounded-xl border-2 p-4 text-left transition-colors disabled:pointer-events-none",
                stateCls,
              )}
            >
              <span className="text-lg font-semibold text-ink">{opt.text}</span>
              {marker && (
                <span aria-hidden className={cn(isCorrect ? "text-verde" : "text-rojo")}>
                  <Icon name={marker} size={24} strokeWidth={2.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {revealed && (
        <Card
          className={cn(
            "mt-5 border-l-4",
            selected === q.correct ? "border-l-verde" : "border-l-amarillo",
          )}
        >
          <p className="text-base font-bold text-ink">
            {selected === q.correct ? "Correcto" : "Respuesta correcta"}
          </p>
          <p className="mt-1 text-base text-slate-600">{q.explanation}</p>
        </Card>
      )}
    </OnboardingShell>
  );
}
