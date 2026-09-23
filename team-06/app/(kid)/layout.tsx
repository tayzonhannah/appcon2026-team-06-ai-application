import Link from "next/link";

export default function KidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#EFF6FF] text-[#0F172A]">
      <header className="sticky top-0 z-50 border-b-2 border-[#0F172A]/10 bg-[#EFF6FF]/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-6">
          <Link href="/kid" className="flex items-center gap-3 cursor-pointer">
            <span className="flex h-10 w-10 -rotate-3 items-center justify-center rounded-2xl border-2 border-[#0F172A] bg-[#2563EB] text-xl font-black text-white shadow-[0_3px_0_#0F172A] transition-transform hover:rotate-0">
              C
            </span>
            <span className="hidden text-sm font-black uppercase tracking-[0.14em] text-[#0F172A] sm:block">
              My Adventure
            </span>
          </Link>

          <nav className="flex items-center gap-2" aria-label="Kid navigation">
            <Link
              href="/kid"
              className="rounded-xl border-2 border-[#0F172A] bg-white px-3 py-2 text-xs font-black uppercase tracking-wider shadow-[0_2px_0_#0F172A] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/30"
            >
              Home
            </Link>
            <Link
              href="/challenge"
              className="rounded-xl border-2 border-[#0F172A] bg-[#F59E0B] px-3 py-2 text-xs font-black uppercase tracking-wider shadow-[0_2px_0_#0F172A] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#F59E0B]/40"
            >
              Play
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-xl border-2 border-[#0F172A] bg-white px-3 py-2 text-xs font-black sm:block">
              7 day streak
            </span>
            <Link
              href="/login"
              aria-label="Log out"
              className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#0F172A] bg-[#EC4899] text-sm font-black text-white shadow-[0_2px_0_#0F172A] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#EC4899]/30"
            >
              K
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col px-5 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}