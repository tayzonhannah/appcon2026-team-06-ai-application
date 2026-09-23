"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { COMPASS_FLOW, nextNode } from "@/lib/constants/compass-flow";
import { detectEmotionNudge } from "@/lib/constants/emotions";
import EmotionNudge from "@/components/emotion-nudge";

interface HistoryEntry {
  compassPrompt: string;
  userChoice?: string;
}

export default function KidChatbotPage() {
  const router = useRouter();
  const [nodeId, setNodeId] = useState("start");
  const [history, setHistory] = useState<HistoryEntry[]>([
    { compassPrompt: COMPASS_FLOW.start.prompt },
  ]);
  const [feeling, setFeeling] = useState("");
  const [nudge, setNudge] = useState<{ emotion: string; message: string } | null>(null);
  const [thinking, setThinking] = useState(false);

  const node = COMPASS_FLOW[nodeId] ?? COMPASS_FLOW.start;

  const choose = (choiceId: string, choiceLabel: string) => {
    if (thinking) return;

    // Navigate away for special choices
    if (choiceId === "go-missions") {
      router.push("/kid/missions");
      return;
    }

    // Inline emotion detection on choice text
    const emotionHit = detectEmotionNudge(choiceLabel);
    if (emotionHit) setNudge(emotionHit);

    const next = nextNode(nodeId, choiceId);

    // Mark the user's choice on the current last history entry, then show
    // Compass "thinking" before adding the next prompt
    setHistory((prev) =>
      prev.map((entry, i) =>
        i === prev.length - 1 ? { ...entry, userChoice: choiceLabel } : entry,
      ),
    );

    setThinking(true);
    setTimeout(() => {
      setNodeId(next.id);
      setHistory((prev) => [...prev, { compassPrompt: next.prompt }]);
      setThinking(false);
    }, 600);
  };

  const restart = () => {
    setNodeId("start");
    setHistory([{ compassPrompt: COMPASS_FLOW.start.prompt }]);
    setNudge(null);
    setThinking(false);
  };

  const goBack = () => {
    if (history.length <= 1) return;
    const prev = history.slice(0, -1);
    const parentEntry = prev[prev.length - 1];
    // Find the node id from the last prompt
    const prevNodeId =
      Object.values(COMPASS_FLOW).find((n) => n.prompt === parentEntry.compassPrompt)?.id ??
      "start";
    setHistory(prev.map((e, i) => (i === prev.length - 1 ? { compassPrompt: e.compassPrompt } : e)));
    setNodeId(prevNodeId);
    setNudge(null);
  };

  return (
    <div className="mx-auto w-full max-w-3xl py-2 sm:py-10">
      <Link
        href="/kid"
        className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB] touch-manipulation"
      >
        ← Back to home
      </Link>

      {/* Push-notification demo banner */}
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-[#2563EB]/30 bg-[#EFF6FF] px-4 py-3">
        <span className="text-xl" aria-hidden="true">🔔</span>
        <p className="flex-1 text-xs font-bold leading-relaxed text-[#2563EB]">
          <span className="font-black">Demo feature:</span> Compass detects negative emotions in your words and fires a push notification.{" "}
        </p>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined" && "Notification" in window) {
              Notification.requestPermission().catch(() => {});
            }
          }}
          className="shrink-0 inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border-2 border-[#2563EB] bg-[#2563EB] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-[0_2px_0_#1d4ed8] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none touch-manipulation"
        >
          🔔 Enable notifications
        </button>
      </div>

      {/* Chat card */}
      <section className="mt-4 rounded-[24px] border-4 border-[#0F172A] bg-white shadow-[0_7px_0_#0F172A]">
        {/* Header */}
        <div className="flex items-start gap-4 border-b-2 border-[#0F172A]/10 p-5 sm:p-7">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[#0F172A] bg-[#2563EB] text-2xl font-black text-white shadow-[0_3px_0_#0F172A]">
            C
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Your AI companion</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Compass</h1>
            <p className="mt-1 text-sm font-bold leading-relaxed text-[#475569]">
              Compass asks — you decide. No wrong answers here.
            </p>
          </div>
        </div>

        {/* Chat history */}
        <div className="flex flex-col gap-4 px-5 py-5 sm:px-7">
          {history.map((entry, i) => {
            const isLast = i === history.length - 1;
            const nodeForPrompt = Object.values(COMPASS_FLOW).find(
              (n) => n.prompt === entry.compassPrompt,
            );
            return (
              <div key={i} className="flex flex-col gap-3">
                {/* Compass bubble */}
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-[#0F172A] bg-[#2563EB] text-xs font-black text-white">
                    C
                  </div>
                  <div className="flex flex-col gap-1">
                    <div
                      className="max-w-[85%] rounded-2xl rounded-tl-sm border-2 border-[#0F172A]/20 bg-[#EFF6FF] px-4 py-3"
                      aria-live={isLast ? "polite" : undefined}
                    >
                      <p className="text-[15px] font-black leading-relaxed text-[#0F172A]">
                        {entry.compassPrompt}
                      </p>
                      {isLast && nodeForPrompt?.support ? (
                        <p className="mt-1.5 text-xs font-bold text-[#475569]">
                          {nodeForPrompt.support}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* User reply bubble (past entries) */}
                {entry.userChoice && (
                  <div className="flex items-start justify-end gap-3">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-sm border-2 border-[#0F172A] bg-[#0F172A] px-4 py-3">
                      <p className="text-sm font-black text-white">{entry.userChoice}</p>
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-[#0F172A] bg-[#EC4899] text-xs font-black text-white">
                      K
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Thinking indicator */}
          {thinking && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-[#0F172A] bg-[#2563EB] text-xs font-black text-white">
                C
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border-2 border-[#0F172A]/20 bg-[#EFF6FF] px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#2563EB]" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#2563EB]" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#2563EB]" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        {/* Choice buttons (only for the current node, hidden while thinking) */}
        {!thinking && node.choices.length > 0 && (
          <div className="border-t-2 border-[#0F172A]/10 px-5 py-5 sm:px-7">
            <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-[#475569]">
              Choose your answer
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {node.choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => choose(choice.id, choice.label)}
                  className="min-h-[60px] rounded-2xl border-2 border-[#0F172A]/20 bg-[#F8F1E5] p-4 text-left text-[15px] font-black transition hover:border-[#2563EB] hover:bg-[#EFF6FF] active:scale-[0.98] active:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/25 touch-manipulation"
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nav controls */}
        <div className="flex items-center justify-between gap-3 border-t-2 border-[#0F172A]/10 px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={goBack}
            disabled={history.length <= 1 || thinking}
            className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 disabled:opacity-40 touch-manipulation"
          >
            ← Back one step
          </button>
          <button
            type="button"
            onClick={restart}
            className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#475569] underline underline-offset-4 touch-manipulation"
          >
            Restart
          </button>
        </div>
      </section>

      {/* Emotion nudge banner */}
      {nudge ? (
        <div className="mt-4" aria-live="polite">
          <EmotionNudge
            title={`Noticing: ${nudge.emotion}`}
            message={nudge.message}
            onDismiss={() => setNudge(null)}
          />
        </div>
      ) : null}

      {/* Feelings check — now clearly separated and labelled for demo */}
      <section className="mt-4 rounded-[24px] border-4 border-[#0F172A] bg-white p-5 shadow-[0_5px_0_#0F172A] sm:p-7">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#0F172A] bg-[#FDE68A] text-lg" aria-hidden="true">
            💛
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#475569]">Early feelings check</p>
            <h2 className="mt-0.5 text-base font-black">How are you really feeling?</h2>
            <p className="mt-1 text-xs font-bold text-[#475569]">
              Type how you feel — Compass listens and responds with a gentle nudge if it notices something.
            </p>
          </div>
        </div>
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            const found = detectEmotionNudge(feeling);
            setNudge(found);
            if (
              found &&
              typeof window !== "undefined" &&
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              try {
                new Notification("Compass nudge 💛", { body: found.message });
              } catch {
                /* demo-safe */
              }
            }
          }}
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="feeling-input"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              placeholder='e.g. "I feel sad about my mission"'
              className="min-h-[48px] flex-1 rounded-xl border-2 border-[#0F172A]/25 bg-[#F8F1E5] px-4 py-2.5 text-base font-bold outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15"
              style={{ fontSize: "16px" }}
            />
            <button
              type="submit"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#0F172A] bg-[#2563EB] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_3px_0_#0F172A] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none touch-manipulation"
            >
              Check in
            </button>
          </div>
        </form>
      </section>

      {/* Escalation note */}
      <div className="mt-4 rounded-2xl border-2 border-[#0F172A] bg-[#FDE68A] p-4 text-sm font-bold leading-relaxed">
        Need help from a grown-up? Tell your parent or another trusted adult what is going on.
      </div>
    </div>
  );
}
