import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const TIMEOUT_MS = 25_000;

export function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

function withTimeout<T>(promise: Promise<T>, ms = TIMEOUT_MS): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Gemini request timed out")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/** Plain-text reply from Gemini. Throws on any failure — callers fall back. */
export async function geminiText(systemInstruction: string, userMessage: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
  const model = genAI.getGenerativeModel({ model: MODEL, systemInstruction });
  const result = await withTimeout(model.generateContent(userMessage));
  const text = result.response.text().trim();
  if (!text) throw new Error("Empty Gemini response");
  return text;
}

/** JSON reply from Gemini, parsed and validated loosely. Throws on failure. */
export async function geminiJson<T>(systemInstruction: string, userMessage: string): Promise<T> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction,
    generationConfig: { responseMimeType: "application/json" },
  });
  const result = await withTimeout(model.generateContent(userMessage));
  const text = result.response.text().trim();
  if (!text) throw new Error("Empty Gemini response");
  return JSON.parse(text) as T;
}
