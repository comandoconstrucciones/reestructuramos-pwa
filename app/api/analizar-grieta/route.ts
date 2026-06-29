// Clasificación asistida por IA de daños/grietas. Server-side (la API key NUNCA
// va al cliente). Usa Gemini Vision. Es una AYUDA al criterio, no un dictamen.
export const runtime = "nodejs";
export const maxDuration = 30;

const PROMPT = `Eres un ingeniero estructural evaluando daño sísmico (metodología ATC-20 / COVENIN 1756).
Analiza la foto de un posible daño en un edificio y responde SOLO con JSON válido, sin texto extra, con esta forma:
{
  "patron": "string — p.ej. grieta cosmética, grieta por cortante (en X), grieta por flexión, aplastamiento de concreto, falla de columna corta, asentamiento, desprendimiento/peligro de caída, sin daño aparente",
  "severidad": "ninguno | leve | moderado | severo",
  "ancho_mm_estimado": number o null,
  "resumen": "1-2 frases en español, claras y técnicas",
  "recomendacion": "qué debería verificar o hacer el inspector"
}
Sé CONSERVADOR (ante la duda, sube la severidad). Si la imagen no muestra un edificio o no permite evaluar, dilo en 'resumen' y usa severidad 'ninguno'.`;

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return Response.json({ error: "El análisis con IA no está configurado en este despliegue." }, { status: 503 });
  }
  let imageBase64: string | undefined;
  let mime = "image/jpeg";
  try {
    const body = (await req.json()) as { imageBase64?: string; mime?: string };
    imageBase64 = body.imageBase64;
    if (body.mime) mime = body.mime;
  } catch {
    return Response.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  if (!imageBase64) return Response.json({ error: "Falta la imagen." }, { status: 400 });

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: PROMPT }, { inline_data: { mime_type: mime, data: imageBase64 } }] },
          ],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
        }),
      },
    );
    if (!res.ok) {
      return Response.json({ error: "El modelo no respondió correctamente." }, { status: 502 });
    }
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { resumen: text };
    }
    return Response.json(parsed);
  } catch {
    return Response.json({ error: "No se pudo contactar el servicio de IA." }, { status: 502 });
  }
}
