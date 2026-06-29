"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ensureProfile, setFlag, setProfile } from "@/lib/db";
import type { InspectorProfile } from "@/lib/types";
import { IntroSlides } from "@/components/onboarding/IntroSlides";
import { Quiz } from "@/components/onboarding/Quiz";
import { Registration } from "@/components/onboarding/Registration";

type Phase = "intro" | "quiz" | "register";

/**
 * Flujo de primera vez: inducción (carrusel) → mini-quiz de habilitación →
 * registro ligero opcional. Al terminar marca `onboarded` y vuelve al inicio.
 * Es un flujo a pantalla completa (sin la navegación inferior).
 */
export default function OnboardingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [busy, setBusy] = useState(false);

  /** Cierra el onboarding tras aprobar: mezcla el perfil sobre el base. */
  async function complete(patch: Partial<InspectorProfile>) {
    if (busy) return;
    setBusy(true);
    const base = await ensureProfile();
    await setProfile({
      ...base,
      ...patch,
      quizPassed: true,
      onboardedAt: new Date().toISOString(),
    });
    await setFlag("onboarded", true);
    router.replace("/");
  }

  /** "Saltar": marca onboarded igual, sin exigir el quiz ni datos. */
  async function skip() {
    if (busy) return;
    setBusy(true);
    await ensureProfile(); // garantiza un perfil (anónimo) válido
    await setFlag("onboarded", true);
    router.replace("/");
  }

  if (phase === "intro") {
    return <IntroSlides onDone={() => setPhase("quiz")} onSkip={skip} />;
  }
  if (phase === "quiz") {
    return <Quiz onPass={() => setPhase("register")} onSkip={skip} />;
  }
  return (
    <Registration
      onSubmit={(patch) => complete(patch)}
      onAnon={() => complete({ isAnonymous: true })}
    />
  );
}
