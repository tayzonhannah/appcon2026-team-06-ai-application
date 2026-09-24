import { NextResponse } from "next/server";
import { geminiJson, isGeminiConfigured } from "@/lib/ai/gemini";

export interface CoachActionSuggestion {
  name: string;
  description: string;
  definitionOfDone: string;
}

const SYSTEM = `You are a warm, practical parenting coach inside "The Conscious Future", an app that helps families build offline growth through small missions and screen-time tokens.

You receive: the parent's message, the child's profile traits/keywords, and recent analytics (missions done, tokens earned).

Rules:
- Reply in 3-6 sentences, concrete and encouraging. No clinical diagnoses.
- Ground advice in the supplied profile and analytics when relevant.
- Then suggest 1-2 offline actions as JSON. Each action: small, offline, doable in under 20 minutes, with a clear definition of done a child can understand.
- Always respond with a single JSON object: { "reply": string, "suggestedActions": [{ "name": string, "description": string, "definitionOfDone": string }] }.
- If the message is off-topic or unsafe, reply gently redirecting to family growth and return an empty suggestedActions array.`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      message?: string;
      profile?: unknown;
      analytics?: unknown;
    };
    const message = (body.message ?? "").toString().trim().slice(0, 2000);
    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (!isGeminiConfigured()) {
      return NextResponse.json({ fallback: true }, { status: 200 });
    }

    const context = JSON.stringify({ profile: body.profile ?? null, analytics: body.analytics ?? null });
    const data = await geminiJson<{ reply: string; suggestedActions: CoachActionSuggestion[] }>(
      SYSTEM,
      `Child context: ${context}\n\nParent message: ${message}`,
    );
    const suggestions = Array.isArray(data.suggestedActions)
      ? data.suggestedActions
          .filter((a) => a && a.name && a.description && a.definitionOfDone)
          .map((a) => ({
            name: String(a.name).slice(0, 120),
            description: String(a.description).slice(0, 500),
            definitionOfDone: String(a.definitionOfDone).slice(0, 300),
          }))
          .slice(0, 2)
      : [];

    return NextResponse.json({
      reply: String(data.reply ?? "").slice(0, 2000),
      suggestedActions: suggestions,
    });
  } catch {
    return NextResponse.json({ fallback: true }, { status: 200 });
  }
}
