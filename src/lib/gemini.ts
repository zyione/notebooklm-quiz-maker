import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface Flashcard {
  front: string;
  back: string;
}

const MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

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

  let lastError: Error | null = null;

  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const raw = response.text ?? "[]";
      const parsed: Flashcard[] = JSON.parse(raw);
      console.log(`Success with ${model}: ${parsed.length} flashcards`);
      return parsed;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`Model ${model} failed: ${lastError.message}`);
      
      // If it's a rate limit error, wait and try the next model
      if (lastError.message.includes("429") || lastError.message.includes("RESOURCE_EXHAUSTED")) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      // For other errors, still try next model
      continue;
    }
  }

  throw new Error(
    `All models failed. Last error: ${lastError?.message ?? "Unknown"}. ` +
    `Please verify your GEMINI_API_KEY is valid and has free tier access at https://aistudio.google.com/apikey`
  );
}
