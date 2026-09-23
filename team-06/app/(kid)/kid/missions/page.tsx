import Link from "next/link";
import { KID_MISSIONS } from "@/lib/constants/missions";

export default function KidMissionsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl py-2 sm:py-10">
      <Link href="/kid" className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider text-[#2563EB] underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB] touch-manipulation">
        ← Back to home
      </Link>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Your next moves</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Today&apos;s missions</h1>
          <p className="mt-2 max-w-2xl text-[15px] font-bold leading-relaxed text-[#475569]">Pick one small offline mission. Tap to open it.</p>
        </div>
        <span className="w-fit rounded-xl border-2 border-[#0F172A] bg-[#F59E0B] px-3 py-2 text-xs font-black uppercase shadow-[0_2px_0_#0F172A]">{KID_MISSIONS.length} available</span>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {KID_MISSIONS.map((mission) => (
          <article key={mission.id} className={`${mission.color} rounded-[22px] border-4 border-[#0F172A] p-5 shadow-[0_6px_0_#0F172A] transition active:scale-[0.99]`}>
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#0F172A] bg-white text-xl font-black" aria-hidden="true">{mission.icon}</span>
              <span className="rounded-lg border-2 border-[#0F172A] bg-white px-2 py-1 text-[10px] font-black uppercase">{mission.reward}</span>
            </div>
            <h2 className="mt-4 text-xl font-black leading-tight">{mission.title}</h2>
            <p className="mt-2 text-[15px] font-bold leading-relaxed text-[#0F172A]/70">{mission.detail}</p>
            <div className="mt-4 rounded-xl border-2 border-[#0F172A]/20 bg-white/70 p-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#475569]">Mission steps • {mission.steps.length}</p>
              <ol className="mt-2 flex flex-col gap-1.5">
                {mission.steps.map((step, index) => (
                  <li key={step} className="flex gap-2 text-sm font-bold"><span className="font-black">{index + 1}.</span><span>{step}</span></li>
                ))}
              </ol>
            </div>
            <Link
              href={`/kid/missions/${mission.id}`}
              className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-xl border-2 border-[#0F172A] bg-white px-4 py-3 text-center text-xs font-black uppercase tracking-wider shadow-[0_3px_0_#0F172A] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none focus:outline-none focus:ring-4 focus:ring-[#2563EB]/30 touch-manipulation"
            >
              Open mission →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
