"use client";
import { useEffect, useState } from "react";
import { Icon } from "./ui/Icon";

// Invita a instalar la PWA (Agregar a pantalla de inicio) para uso offline real.
// Android/Chrome: usa beforeinstallprompt. iOS: muestra la instrucción manual.
// Se oculta si ya está instalada o si el usuario la descartó.

type BIPEvent = Event & { prompt: () => Promise<void> };

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;
    try {
      if (localStorage.getItem("install_dismissed") === "1") return;
    } catch {
      /* sin localStorage */
    }
    const ua = navigator.userAgent;
    const isIOS =
      /iphone|ipad|ipod/i.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
    if (isIOS) {
      // Detección de plataforma al montar (una sola vez).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIosHint(true);
      setShow(true);
      return;
    }
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  if (!show) return null;

  function close() {
    setShow(false);
    try {
      localStorage.setItem("install_dismissed", "1");
    } catch {
      /* no-op */
    }
  }
  async function install() {
    if (!deferred) return;
    try {
      await deferred.prompt();
    } catch {
      /* no-op */
    }
    close();
  }

  return (
    <div className="flex items-center gap-2 border-b border-sky-200 bg-sky-50 px-4 py-2 text-sm">
      <Icon name="download" size={18} className="shrink-0 text-brand" />
      {iosHint ? (
        <span className="flex-1 text-brand-ink">
          Instala la app: toca <strong>Compartir</strong> y luego <strong>Agregar a inicio</strong>.
        </span>
      ) : (
        <>
          <span className="flex-1 text-brand-ink">Instálala para usarla sin conexión.</span>
          <button
            type="button"
            onClick={install}
            className="rounded-lg bg-brand px-3 py-1 font-semibold text-white"
          >
            Instalar
          </button>
        </>
      )}
      <button type="button" onClick={close} aria-label="Cerrar" className="text-slate-400">
        <Icon name="x" size={18} />
      </button>
    </div>
  );
}
