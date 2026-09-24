import { NextResponse } from "next/server";
import { geminiText, isGeminiConfigured } from "@/lib/ai/gemini";

const SYSTEM = `You are Compass, a gentle guide for a child (around 6-10 years old) inside "The Conscious Future" adventure app. The child tells you how they feel about their offline mission.

Strict rules:
- Reply in at most 3 short sentences, warm and simple words.
- Give exactly ONE tiny next step (e.g. three slow breaths, pick the easiest part, ask what is missing).
- Never judge, grade, diagnose, or mention being an AI.
- If the message is about harm, danger, or anything unsafe, reply: "Thank you for telling me. Please tell your parent or another trusted grown-up right away — you did the right thing telling someone." and nothing else.
- If the message is off-topic or unclear, gently steer back: "Let's think about your mission. What is one small part you could try?"
- End every other reply with: "You can also tell a grown-up how you feel."`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { message?: string; missionTitle?: string };
    const message = (body.message ?? "").toString().trim().slice(0, 500);
    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (!isGeminiConfigured()) {
      return NextResponse.json({ fallback: true }, { status: 200 });
    }

    const mission = (body.missionTitle ?? "").toString().slice(0, 120);
    const reply = await geminiText(
      SYSTEM,
      mission ? `The child's current mission is: "${mission}".\nChild says: ${message}` : `Child says: ${message}`,
    );
    return NextResponse.json({ reply: reply.slice(0, 600) });
  } catch {
    return NextResponse.json({ fallback: true }, { status: 200 });
  }
}
