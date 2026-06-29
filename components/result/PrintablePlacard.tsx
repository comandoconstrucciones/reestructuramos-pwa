"use client";
import { useEffect, useState } from "react";
import { Button, Icon } from "@/components/ui";
import { PLACARD_META } from "@/lib/placard";
import { qrDataUrl } from "@/lib/qr";
import type { Inspection } from "@/lib/types";

function fmtDateTime(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return d.toLocaleString("es-VE", { dateStyle: "long", timeStyle: "short" });
  } catch {
    return d.toISOString();
  }
}

// Aísla la impresión: solo se imprime el cartel (no el resto de la app).
const PRINT_CSS = `
@media print {
  body { background: #fff !important; }
  body * { visibility: hidden !important; }
  #printable-placard, #printable-placard * { visibility: visible !important; }
  #printable-placard {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
  }
  @page { margin: 12mm; }
}
`;

/** Vista a pantalla completa del cartel, lista para imprimir, con QR al historial. */
export function PrintablePlacard({
  inspection,
  onClose,
}: {
  inspection: Inspection;
  onClose: () => void;
}) {
  const meta = PLACARD_META[inspection.placardFinal] ?? PLACARD_META.none;
  const [{ qr, historyUrl }, setData] = useState<{ qr: string | null; historyUrl: string }>({
    qr: null,
    historyUrl: "",
  });

  useEffect(() => {
    const url = `${window.location.origin}/edificio/${inspection.buildingId}`;
    // setState solo dentro del callback async (evita render en cascada en el efecto).
    qrDataUrl(url)
      .then((q) => setData({ qr: q, historyUrl: url }))
      .catch(() => setData({ qr: null, historyUrl: url }));
  }, [inspection.buildingId]);

  const restrictions = inspection.entryRestrictions || meta.defaultRestrictions;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-slate-100">
      <style>{PRINT_CSS}</style>
      <div className="mx-auto max-w-2xl p-4">
        <div className="mb-4 flex gap-2 print:hidden">
          <Button type="button" onClick={() => window.print()} fullWidth>
            <Icon name="printer" size={18} /> Imprimir
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Cerrar
          </Button>
        </div>

        <div
          id="printable-placard"
          className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm"
        >
          {/* Franja del cartel */}
          <div
            className="px-6 py-8 text-center"
            style={{ backgroundColor: meta.color, color: meta.textOn }}
          >
            <p className="text-5xl font-extrabold leading-none tracking-tight">{meta.label}</p>
            <p className="mt-2 text-xl font-semibold">{meta.sublabel}</p>
          </div>

          <div className="space-y-5 p-6">
            <p className="text-center text-lg font-semibold text-ink">{meta.instruction}</p>

            <div className="grid gap-3 text-base text-ink sm:grid-cols-2">
              <Datum label="Edificio">
                {inspection.building.name || "Sin nombre"}
                {inspection.building.address ? ` — ${inspection.building.address}` : ""}
              </Datum>
              <Datum label="Fecha de inspección">{fmtDateTime(inspection.inspectedAt)}</Datum>
              <Datum label="Restricciones de entrada">{restrictions || "—"}</Datum>
              <Datum label="Barricadas">{inspection.barricadesNeeded ? "Sí" : "No"}</Datum>
            </div>

            {/* QR al historial del edificio */}
            <div className="flex flex-col items-center gap-2 border-t border-slate-200 pt-5">
              {qr ? (
                <img src={qr} alt="Código QR del historial del edificio" className="h-44 w-44" />
              ) : (
                <div className="flex h-44 w-44 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400">
                  Generando QR…
                </div>
              )}
              <p className="text-center text-sm font-semibold text-ink">
                Escanee para ver el historial del edificio
              </p>
              <p className="break-all text-center text-xs text-slate-400">{historyUrl}</p>
            </div>

            <p className="border-t border-slate-200 pt-4 text-center text-[11px] leading-relaxed text-slate-500">
              Metodología ATC-20 adaptada / COVENIN 1756. Documento NO oficial: sin aval de
              autoridad competente. Solo orientativo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Datum({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 print:bg-white print:p-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 font-semibold text-ink">{children}</p>
    </div>
  );
}
