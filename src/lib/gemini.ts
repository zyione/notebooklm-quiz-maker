import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface Flashcard {
  front: string;
  back: string;
}

// Models to try in order (only v1beta-compatible models)
const MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
];

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function generateFlashcards(text: string): Promise<Flashcard[]> {
  const prompt = `You are an expert educator. Given the following text extracted from a PDF document, generate a comprehensive set of Anki-style flashcards.

Rules:
- Each flashcard must have a "front" (question) and a "back" (answer).
- Cover all key concepts, definitions, facts, and relationships in the text.
- Keep questions clear and specific.
- Keep answers concise but complete.
- Generate between 5 and 30 flashcards depending on the text length and density.
- Return ONLY a valid JSON array of objects with "front" and "back" keys. No markdown, no explanation.

Text:
"""
${text}
"""`;

  // Try each model, with up to 3 retries per model for rate limits
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[Gemini] Trying ${model} (attempt ${attempt}/3)`);
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const raw = response.text ?? "[]";
        const parsed: Flashcard[] = JSON.parse(raw);
        console.log(`[Gemini] Success with ${model}: ${parsed.length} flashcards`);
        return parsed;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[Gemini] ${model} attempt ${attempt} failed: ${msg}`);

        // Rate limit — wait and retry same model
        if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
          const waitSec = attempt * 10; // 10s, 20s, 30s
          console.log(`[Gemini] Rate limited. Waiting ${waitSec}s before retry...`);
          await sleep(waitSec * 1000);
          continue;
        }
        // Other error — skip to next model
        break;
      }
    }
  }

  throw new Error(
    "All Gemini models failed. This is likely because your API key is still activating. " +
    "Please wait 5-10 minutes and try again. If it persists, visit https://aistudio.google.com/apikey " +
    "and make sure the 'Generative Language API' is enabled on your Google Cloud project."
  );
}
