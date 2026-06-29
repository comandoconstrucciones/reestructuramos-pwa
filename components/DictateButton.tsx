"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./ui/Icon";

// Dictado por voz para llenar notas con guantes / a manos libres.
// Usa Web Speech API (motor en la nube → requiere conexión; Chrome y Safari
// recientes). Se OCULTA si el navegador no lo soporta.

interface SRResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
interface SRInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: SRResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type SRCtor = new () => SRInstance;

function getSR(): SRCtor | undefined {
  const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function DictateButton({ onText, lang = "es-VE" }: { onText: (t: string) => void; lang?: string }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<SRInstance | null>(null);

  useEffect(() => {
    // Detección de capacidad una sola vez al montar.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(typeof window !== "undefined" && !!getSR());
  }, []);

  function toggle() {
    const SR = getSR();
    if (!SR) return;
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      const t = Array.from(e.results)
        .map((r) => r[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (t) onText(t);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  }

  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dictar por voz"
      className={cn(
        "touch-target inline-flex items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold",
        listening ? "animate-pulse border-rojo bg-red-50 text-rojo" : "border-slate-300 bg-white text-brand",
      )}
    >
      <Icon name="mic" size={18} /> {listening ? "Escuchando…" : "Dictar"}
    </button>
  );
}
