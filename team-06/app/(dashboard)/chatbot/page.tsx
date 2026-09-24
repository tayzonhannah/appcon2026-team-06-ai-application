"use client";

import { useState, useRef, useEffect } from "react";
import { saveGrowthAction } from "@/lib/growth-store";
import { MOCK_CHILDREN_LIST } from "@/lib/constants/analytics";
import { PROFILE_DATA_KEY } from "@/lib/constants/profile";

/* ─── Types ───────────────────────────────────────────── */
type ResourceType = "book" | "strategy" | "activity" | "article";

interface Resource {
  title: string;
  type: ResourceType;
  description: string;
}

interface ActionSuggestion {
  name: string;
  description: string;
  definitionOfDone: string;
}

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  resources?: Resource[];
  suggestions?: ActionSuggestion[];
  aiPowered?: boolean;
}

/* ─── Pre-built prompt chips ──────────────────────────── */
const SUGGESTED_PROMPTS = [
  "My child has meltdowns when screen time ends",
  "My child struggles to focus on offline tasks",
  "My child gets frustrated easily when failing",
  "My child prefers screens over playing with others",
  "How do I set healthy screen time boundaries?",
  "My child is anxious and doesn't share feelings",
];

/* ─── Static resource responses (keyed by prompt index) ─ */
const RESPONSES: { intro: string; resources: Resource[] }[] = [
  {
    intro:
      "Screen-time transition meltdowns are very common. Here are evidence-based resources to help you navigate them:",
    resources: [
      {
        title: "The Whole-Brain Child",
        type: "book",
        description:
          "Daniel Siegel & Tina Payne Bryson — teaches how to engage your child's rational brain during emotional storms, including screen-off tantrums.",
      },
      {
        title: "Gottman 5-Step Emotion Coaching",
        type: "strategy",
        description:
          "Notice → Treat as opportunity → Listen empathetically → Label the emotion → Set limits while problem-solving. Apply right as you turn off the device.",
      },
      {
        title: "5-Minute Visual Countdown",
        type: "activity",
        description:
          "Use a physical sand timer or a large clock 5 minutes before screen-off. Giving advance notice reduces the emotional shock of the transition.",
      },
    ],
  },
  {
    intro:
      "Difficulty sustaining attention on offline tasks is often linked to dopamine contrast after screen time. These resources can help rebuild focus:",
    resources: [
      {
        title: "Raising a Self-Reliant Child",
        type: "book",
        description:
          "Bettina Llagas — practical strategies to build intrinsic motivation and focus in screen-era kids through structured offline routines.",
      },
      {
        title: "Task Chunking Strategy",
        type: "strategy",
        description:
          "Break offline activities into 5–10 minute segments with a short movement break between each. Gradually increase chunk length over 2–3 weeks.",
      },
      {
        title: "Flow-State Hobby Matching",
        type: "activity",
        description:
          "Identify one offline activity your child voluntarily returns to (drawing, LEGOs, sport). Use that as the anchor activity for building longer focus windows.",
      },
    ],
  },
  {
    intro:
      "Low frustration tolerance in children is closely tied to emotional regulation. Here are resources specifically addressing this:",
    resources: [
      {
        title: "The Yes Brain",
        type: "book",
        description:
          "Daniel Siegel — explains how to shift children from a defensive 'no brain' state to a receptive 'yes brain' that handles failure with resilience.",
      },
      {
        title: "Normalising Failure Script",
        type: "strategy",
        description:
          "When your child fails, say: 'That was hard — your brain just grew a little. Let's try one small piece again.' Avoid praise of talent; praise effort.",
      },
      {
        title: "Mistake Journal",
        type: "activity",
        description:
          "Keep a shared 'Oops & Learned' notebook. Each day, both parent and child write one mistake and one thing learned. Models growth mindset.",
      },
    ],
  },
  {
    intro:
      "Social withdrawal in favour of screens is a key signal. These resources help parents rebuild real-world peer connection:",
    resources: [
      {
        title: "Last Child in the Woods",
        type: "book",
        description:
          "Richard Louv — explores the link between outdoor/unstructured play and healthy social development; offers practical nature-based reconnection strategies.",
      },
      {
        title: "Parallel Play Entry",
        type: "strategy",
        description:
          "Don't force interaction. Invite one peer for a structured side-by-side activity (LEGO, craft) with no pressure to collaborate — let organic connection emerge.",
      },
      {
        title: "Weekly Offline Playdate Challenge",
        type: "activity",
        description:
          "Schedule one 45-minute screen-free playdate per week. Frame it as a 'quest' in the app so your child earns tokens for attending.",
      },
    ],
  },
  {
    intro:
      "Setting healthy screen time limits requires clear structure and buy-in from your child. Here's where to start:",
    resources: [
      {
        title: "American Academy of Pediatrics — Screen Time Guidelines",
        type: "article",
        description:
          "Evidence-based age-specific screen time recommendations. Ages 6+: consistent limits on type and total hours; screen-free zones at mealtimes and bedrooms.",
      },
      {
        title: "Family Media Agreement",
        type: "strategy",
        description:
          "Co-create written rules with your child (not imposed). Include: daily screen budget, approved content types, screen-free times, and earned-time bonuses.",
      },
      {
        title: "Token Economy (This App!)",
        type: "activity",
        description:
          "Use Kith's Challenge system — your child earns screen-time by completing offline actions. This builds intrinsic motivation to limit screens.",
      },
    ],
  },
  {
    intro:
      "Emotional avoidance and anxiety in children often benefit from structured safe-sharing rituals. Here are expert-backed approaches:",
    resources: [
      {
        title: "Raising an Emotionally Intelligent Child",
        type: "book",
        description:
          "John Gottman — the foundational text on emotion coaching. Chapter 3 covers helping anxious children identify and name their internal states.",
      },
      {
        title: "Rose / Thorn / Bud (Daily Check-In)",
        type: "strategy",
        description:
          "Each evening: share one good thing (Rose), one hard thing (Thorn), and one thing you're looking forward to (Bud). Creates a low-pressure feelings ritual.",
      },
      {
        title: "Feelings Wheel Poster",
        type: "activity",
        description:
          "Print a Feelings Wheel and hang it in your child's room. When emotions arise, point to the wheel together — naming reduces the intensity of the feeling.",
      },
    ],
  },
];

/* ─── Helper ──────────────────────────────────────────── */
const RESOURCE_COLORS: Record<ResourceType, string> = {
  book: "bg-[#D0E6FD] border-[#162660] text-[#162660]",
  strategy: "bg-[#E8DAC4] border-[#4A3B2C] text-[#4A3B2C]",
  activity: "bg-[#D4EDDA] border-[#276749] text-[#276749]",
  article: "bg-[#F8F1E5] border-[#4A3B2C] text-[#162660]",
};

const BotIcon = ({ className = "w-5 h-5 text-[#F1E4D1]" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="8" width="18" height="12" rx="3" strokeWidth="2" />
    <circle cx="9" cy="13" r="1.5" fill="currentColor" />
    <circle cx="15" cy="13" r="1.5" fill="currentColor" />
    <path strokeLinecap="round" strokeWidth="2" d="M10 17h4M12 4v4M9 4h6" />
  </svg>
);

const ResourceIcon = ({ type }: { type: ResourceType }) => {
  switch (type) {
    case "book":
      return (
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case "strategy":
      return (
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    case "activity":
      return (
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <circle cx="12" cy="12" r="6" strokeWidth="2" />
          <circle cx="12" cy="12" r="2" strokeWidth="2" />
        </svg>
      );
    case "article":
      return (
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
  }
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ─── Component ───────────────────────────────────────── */
export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [addedSuggestions, setAddedSuggestions] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  function staticFallback(trimmed: string) {
    // Match to a prompt index or fallback to index 0
    const matchIndex = SUGGESTED_PROMPTS.findIndex((p) =>
      p.toLowerCase() === trimmed.toLowerCase()
    );
    const responseData = RESPONSES[matchIndex >= 0 ? matchIndex : 0];
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "bot",
      content: responseData.intro,
      timestamp: new Date(),
      resources: responseData.resources,
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsBotTyping(false);
  }

  function buildAiContext() {
    try {
      const profile = JSON.parse(window.localStorage.getItem(PROFILE_DATA_KEY) ?? "null");
      const actions = JSON.parse(window.localStorage.getItem("conscious-future-growth-actions") ?? "[]");
      const missions = JSON.parse(window.localStorage.getItem("conscious-future-mission-completions") ?? "{}");
      const tokens = JSON.parse(window.localStorage.getItem("conscious-future-growth-tokens") ?? "[]");
      const counts = (Array.isArray(actions) ? actions : []).reduce<Record<string, number>>((acc, a) => {
        acc[a.progress] = (acc[a.progress] ?? 0) + 1;
        return acc;
      }, {});
      return {
        child: MOCK_CHILDREN_LIST[0].childName,
        profile,
        actionsByProgress: counts,
        missionsDone: Object.keys(missions ?? {}).length,
        tokenMinutes: (Array.isArray(tokens) ? tokens : []).reduce((t: number, x) => t + (x.minutes ?? 0), 0),
      };
    } catch {
      return { child: MOCK_CHILDREN_LIST[0].childName };
    }
  }

  async function handleSend(text: string = inputValue) {
    const trimmed = text.trim();
    if (!trimmed || isBotTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsBotTyping(true);

    // Try live Gemini coach first; fall back to static resources on any failure.
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, ...buildAiContext() }),
      });
      const data = await res.json();
      if (data && !data.fallback && data.reply) {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: data.reply,
          timestamp: new Date(),
          suggestions: Array.isArray(data.suggestedActions) ? data.suggestedActions : [],
          aiPowered: true,
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsBotTyping(false);
        return;
      }
    } catch {
      // fall through to static resources
    }
    setTimeout(() => staticFallback(trimmed), 600);
  }

  function acceptSuggestion(msgId: string, suggestion: ActionSuggestion) {
    saveGrowthAction({
      id: `action-${Date.now()}`,
      childId: MOCK_CHILDREN_LIST[0].childId,
      name: suggestion.name,
      description: suggestion.description,
      definitionOfDone: suggestion.definitionOfDone,
      status: "active",
      progress: "assigned",
      createdAt: new Date().toISOString(),
    });
    setAddedSuggestions((prev) => ({ ...prev, [`${msgId}-${suggestion.name}`]: true }));
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="h-full flex flex-col min-h-[520px]">

      {/* ── Page Header ── */}
      <div className="shrink-0 flex items-center justify-between pb-3 border-b-2 border-[#4A3B2C]/20 mb-0">
        <div className="flex items-center gap-3">
          {/* Bot avatar */}
          <div className="w-10 h-10 rounded-2xl bg-[#162660] border-2 border-[#4A3B2C] shadow-[0_3px_0_#4A3B2C] flex items-center justify-center">
            <BotIcon className="w-5 h-5 text-[#F1E4D1]" />
          </div>
          <div>
            <h1 className="text-lg font-black text-[#162660] leading-none">Parent Coaching Mascot</h1>
            <p className="text-[10px] font-bold text-[#162660]/60 uppercase tracking-wider mt-0.5">
              AI coach · Suggests actions · Falls back offline
            </p>
          </div>
        </div>

        {/* Parent info */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-black text-[#162660]">Parent</span>
          <span className="text-[10px] font-bold text-[#162660]/60">
            {formatTime(new Date())}, today
          </span>
        </div>
      </div>

      {/* ── Messages area — distinct sunken background ── */}
      <div className="flex-1 min-h-[350px] overflow-y-auto py-6 flex flex-col gap-4 px-4 mx-[-4px] rounded-2xl bg-[#E8DAC4]/60 border border-[#4A3B2C]/10">

        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center px-4">
            <div className="w-16 h-16 rounded-3xl bg-[#162660] border-2 border-[#4A3B2C] shadow-[0_4px_0_#4A3B2C] flex items-center justify-center">
              <BotIcon className="w-8 h-8 text-[#F1E4D1]" />
            </div>
            <div>
              <p className="font-black text-[#162660] text-base">Hi, Parent!</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm font-black border-2 shadow-[0_2px_0] ${msg.role === "user"
                ? "bg-[#162660] text-[#F1E4D1] border-[#0D1638] shadow-[#0D1638]"
                : "bg-[#E8DAC4] text-[#162660] border-[#4A3B2C] shadow-[#4A3B2C]"
              }`}>
              {msg.role === "user" ? "P" : <BotIcon className="w-4 h-4 text-[#162660]" />}
            </div>

            {/* Bubble + resources */}
            <div className={`flex flex-col gap-2 max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              {/* Text bubble */}
              <div className={`px-4 py-2.5 rounded-2xl border-2 text-sm font-bold leading-relaxed ${msg.role === "user"
                  ? "bg-[#162660] text-[#F1E4D1] border-[#0D1638] shadow-[0_3px_0_#0D1638] rounded-tr-sm"
                  : "bg-white text-[#162660] border-[#4A3B2C] shadow-[0_3px_0_#4A3B2C] rounded-tl-sm"
                }`}>
                {msg.content}
                {msg.role === "bot" && msg.aiPowered ? (
                  <span className="mt-1.5 inline-block rounded-full bg-[#D0E6FD] border border-[#162660]/30 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#162660]">
                    ✦ AI coach
                  </span>
                ) : null}
              </div>

              {/* Resource cards (bot only) */}
              {msg.resources && (
                <div className="flex flex-col gap-2 w-full">
                  {msg.resources.map((res, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border-2 p-3 ${RESOURCE_COLORS[res.type]}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <ResourceIcon type={res.type} />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          {res.type}
                        </span>
                      </div>
                      <p className="text-xs font-black leading-none mb-0.5">{res.title}</p>
                      <p className="text-[11px] font-bold opacity-80 leading-relaxed">
                        {res.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested offline actions (AI, bot only) */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-col gap-2 w-full">
                  {msg.suggestions.map((sug) => {
                    const key = `${msg.id}-${sug.name}`;
                    const added = addedSuggestions[key];
                    return (
                      <div key={key} className="rounded-xl border-2 border-[#162660] bg-[#D0E6FD] p-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-[#162660]/70">
                          Suggested action for {MOCK_CHILDREN_LIST[0].childName}
                        </p>
                        <p className="mt-1 text-xs font-black leading-tight">{sug.name}</p>
                        <p className="mt-1 text-[11px] font-bold opacity-80 leading-relaxed">{sug.description}</p>
                        <p className="mt-1 text-[11px] font-bold leading-relaxed">Done when: {sug.definitionOfDone}</p>
                        <button
                          type="button"
                          disabled={added}
                          onClick={() => acceptSuggestion(msg.id, sug)}
                          className="mt-2 w-full rounded-lg border-2 border-[#162660] bg-[#B7E4C7] px-3 py-2 text-[10px] font-black uppercase text-[#162660] shadow-[0_2px_0_#162660] transition hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                        >
                          {added ? "Added ✓ — see Actions" : "Add this action"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Timestamp */}
              <span className="text-[9px] font-bold text-[#162660]/40 px-1">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isBotTyping && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8DAC4] border-2 border-[#4A3B2C] shadow-[0_2px_0_#4A3B2C] flex items-center justify-center">
              <BotIcon className="w-4 h-4 text-[#162660]" />
            </div>
            <div className="bg-white border-2 border-[#4A3B2C] shadow-[0_3px_0_#4A3B2C] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#162660]/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-[#162660]/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-[#162660]/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Suggested Prompts (shown when empty) ── */}
      {isEmpty && (
        <div className="shrink-0 pb-3 pt-1">
          <p className="text-[10px] font-black text-[#162660]/50 uppercase tracking-widest mb-2">
            Suggested prompts
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="px-3 py-1.5 rounded-xl bg-white border-2 border-[#4A3B2C]/30 hover:border-[#162660] hover:bg-[#D0E6FD] text-xs font-bold text-[#162660] transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="shrink-0 pt-3 border-t-2 border-[#4A3B2C]/20">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Share a concern about your child…"
            disabled={isBotTyping}
            className="flex-1 px-4 py-3 aralkada-input text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isBotTyping}
            className="w-11 h-11 rounded-xl bg-[#162660] border-2 border-[#0D1638] shadow-[0_3px_0_#0D1638] flex items-center justify-center text-[#F1E4D1] hover:bg-[#121F50] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:translate-y-[3px] active:shadow-[0_0px_0_#0D1638] shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p className="text-[9px] font-bold text-[#162660]/40 text-center mt-1.5">
          AI coach — review suggestions before assigning · Not a substitute for professional advice
        </p>
      </div>

    </div>
  );
}
