"use client";
// Glosario (GLOSSARY) con buscador simple que filtra por término o definición.
// Búsqueda insensible a mayúsculas y acentos. 100% offline.
import { useId, useMemo, useState } from "react";
import { GLOSSARY } from "@/lib/catalog";
import { Card, Field, TextInput } from "@/components/ui";

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export function Glossary() {
  const [query, setQuery] = useState("");
  const inputId = useId();

  const results = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return GLOSSARY;
    return GLOSSARY.filter(
      (t) => norm(t.term).includes(q) || norm(t.definition).includes(q),
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-3">
      <Field label="Buscar término" htmlFor={inputId}>
        <TextInput
          id={inputId}
          type="search"
          inputMode="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej.: piso blando, cortante, ATC-20…"
        />
      </Field>

      {results.length === 0 ? (
        <Card>
          <p className="text-base text-slate-500">
            Sin resultados para “{query.trim()}”.
          </p>
        </Card>
      ) : (
        <dl className="flex flex-col gap-3">
          {results.map((t) => (
            <Card key={t.term} className="flex flex-col gap-1">
              <dt className="text-lg font-bold text-ink">{t.term}</dt>
              <dd className="text-base leading-snug text-ink">{t.definition}</dd>
            </Card>
          ))}
        </dl>
      )}
    </div>
  );
}
