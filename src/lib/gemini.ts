import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface Flashcard {
  front: string;
  back: string;
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

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const raw = response.text ?? "[]";
  
  // Parse the JSON response
  const parsed: Flashcard[] = JSON.parse(raw);
  return parsed;
}
