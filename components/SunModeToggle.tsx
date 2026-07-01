"use client";
import { useEffect, useState } from "react";
import { Icon } from "./ui/Icon";

// Modo sol: sube contraste y tamaño de texto para luz directa. Persiste en
// localStorage y se aplica antes de pintar (script en app/layout.tsx).

export function SunModeToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    // Lee el estado aplicado por el script anti-flash (una sola vez).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(document.documentElement.getAttribute("data-sun") === "1");
  }, []);

  function toggle() {
    const next = !on;
    setOn(next);
    if (next) document.documentElement.setAttribute("data-sun", "1");
    else document.documentElement.removeAttribute("data-sun");
    try {
      localStorage.setItem("sunmode", next ? "1" : "0");
    } catch {
      /* no-op */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label="Modo sol (alto contraste)"
      title="Modo sol (alto contraste)"
      className="touch-target flex items-center justify-center rounded-lg text-white"
    >
      <Icon name="sun" size={22} className={on ? "opacity-100" : "opacity-60"} />
    </button>
  );
}
