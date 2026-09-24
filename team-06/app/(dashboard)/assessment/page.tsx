"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ASSESSMENT_QUESTIONS,
  getProfileTraits,
  PROFILE_COMPLETION_KEY,
  PROFILE_DATA_KEY,
  ProfileTrait,
} from "@/lib/constants/profile";

export default function AssessmentPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [traits, setTraits] = useState<ProfileTrait[] | null>(null);

  const question = ASSESSMENT_QUESTIONS[questionIndex];
  const selectedAnswer = answers[questionIndex];

  const chooseAnswer = (answerIndex: number) => {
    setAnswers((current) => {
      const next = [...current];
      next[questionIndex] = answerIndex;
      return next;
    });
  };

  const finishAssessment = () => {
    const result = getProfileTraits(answers);
    localStorage.setItem(PROFILE_COMPLETION_KEY, "true");
    localStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(result));
    setTraits(result);
  };

  if (traits) {
    return (
      <div className="mx-auto w-full max-w-4xl py-6 sm:py-10">
        <div className="mb-6 max-w-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#162660]/60">Your reflection profile</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-[#162660] sm:text-4xl">A thoughtful starting point</h1>
          <p className="mt-3 text-sm font-bold leading-relaxed text-[#162660]/70">These descriptive insights are a conversation starter, not a test. They highlight the strengths and habits you can keep exploring.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {traits.map((trait) => (
            <article key={trait.name} className="aralkada-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-black text-[#162660]">{trait.name}</p>
                  <span className="mt-1 inline-flex rounded-full border-2 border-[#4A3B2C] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#162660]" style={{ backgroundColor: `${trait.color}35` }}>{trait.label}</span>
                </div>
                <span className="h-5 w-5 rounded-full border-2 border-[#4A3B2C]" style={{ backgroundColor: trait.color }} aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm font-bold leading-relaxed text-[#162660]/70">{trait.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard" className="aralkada-btn-primary flex items-center justify-center px-5 py-3 text-sm">Continue to dashboard</Link>
          <Link href="/profile" className="aralkada-btn-outline flex items-center justify-center px-5 py-3 text-sm">View full profile</Link>
        </div>
      </div>
    );
  }

  const progress = ((questionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  return (
    <div className="mx-auto w-full max-w-3xl py-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#162660]/60">Parent onboarding</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-[#162660]">Let&apos;s get to know your style</h1>
        </div>
        <span className="shrink-0 text-xs font-black uppercase tracking-wider text-[#162660]/60">{questionIndex + 1} / {ASSESSMENT_QUESTIONS.length}</span>
      </div>
      <div className="mb-6 h-3 overflow-hidden rounded-full border-2 border-[#4A3B2C] bg-white" aria-label={`${Math.round(progress)} percent complete`}>
        <div className="h-full rounded-full bg-[#EC4899] transition-all" style={{ width: `${progress}%` }} />
      </div>

      <section className="aralkada-card p-5 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.15em] text-[#2563EB]">A quick reflection</p>
        <h2 className="mt-3 text-2xl font-black leading-tight text-[#162660] sm:text-3xl">{question.prompt}</h2>
        <div className="mt-6 flex flex-col gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            return (
              <button key={option.label} type="button" onClick={() => chooseAnswer(index)} className={`flex items-start gap-3 rounded-2xl border-3 p-4 text-left text-sm font-bold transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/25 ${isSelected ? "border-[#162660] bg-[#D0E6FD] shadow-[0_3px_0_#162660]" : "border-[#4A3B2C]/40 bg-[#F8F1E5] hover:border-[#162660]"}`} aria-pressed={isSelected}>
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#162660] text-xs ${isSelected ? "bg-[#162660] text-white" : "bg-white text-transparent"}`} aria-hidden="true">✓</span>
                <span className="leading-relaxed text-[#162660]">{option.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-7 flex items-center justify-between gap-3">
          <button type="button" onClick={() => setQuestionIndex((current) => Math.max(0, current - 1))} disabled={questionIndex === 0} className="aralkada-btn-outline px-4 py-2.5 text-xs disabled:cursor-not-allowed disabled:opacity-40">Back</button>
          {questionIndex === ASSESSMENT_QUESTIONS.length - 1 ? (
            <button type="button" onClick={finishAssessment} disabled={selectedAnswer === undefined} className="aralkada-btn-primary px-4 py-2.5 text-xs disabled:cursor-not-allowed disabled:opacity-40">See my profile</button>
          ) : (
            <button type="button" onClick={() => setQuestionIndex((current) => current + 1)} disabled={selectedAnswer === undefined} className="aralkada-btn-primary px-4 py-2.5 text-xs disabled:cursor-not-allowed disabled:opacity-40">Next question</button>
          )}
        </div>
      </section>
    </div>
  );
}