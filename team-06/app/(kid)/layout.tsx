"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/kid", label: "Home", exact: true, idle: "bg-white", icon: "⌂" },
  { href: "/kid/missions", label: "Missions", exact: false, idle: "bg-[#F59E0B]", icon: "★" },
  { href: "/kid/chatbot", label: "Compass", exact: false, idle: "bg-[#EC4899] text-white", icon: "◉" },
] as const;

function isNavActive(href: string, pathname: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function KidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#EFF6FF] text-[#0F172A]">
      <header className="sticky top-0 z-50 border-b-2 border-[#0F172A]/10 bg-[#EFF6FF]/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/kid" className="flex min-h-[44px] items-center gap-2 cursor-pointer touch-manipulation">
            <span className="flex h-10 w-10 -rotate-3 items-center justify-center rounded-2xl border-2 border-[#0F172A] bg-[#2563EB] text-xl font-black text-white shadow-[0_3px_0_#0F172A] transition-transform hover:rotate-0 active:scale-95">
              C
            </span>
            <span className="hidden text-sm font-black uppercase tracking-[0.14em] text-[#0F172A] sm:block">
              My Adventure
            </span>
          </Link>

          {/* Desktop / tablet top nav */}
          <nav className="hidden items-center gap-2 sm:flex" aria-label="Kid navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = isNavActive(item.href, pathname, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-xl border-2 border-[#0F172A] px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[0_2px_0_#0F172A] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none focus:outline-none focus:ring-4 focus:ring-[#2563EB]/30 ${isActive ? "bg-[#0F172A] text-white" : item.idle}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-xl border-2 border-[#0F172A] bg-white px-3 py-2 text-xs font-black md:block">
              7 day streak
            </span>
            {/* Compact streak pill for mobile */}
            <span className="rounded-xl border-2 border-[#0F172A] bg-white px-2.5 py-2 text-xs font-black md:hidden" aria-label="7 day streak">
              🔥 7
            </span>
            <Link
              href="/login"
              aria-label="Log out"
              className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#0F172A] bg-[#EC4899] text-sm font-black text-white shadow-[0_2px_0_#0F172A] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none focus:outline-none focus:ring-4 focus:ring-[#EC4899]/30 touch-manipulation"
            >
              K
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col px-4 pb-28 pt-6 sm:px-6 sm:py-10 sm:pb-10">
        {children}
      </main>

      {/* Mobile bottom tab bar — big thumb-friendly targets */}
      <nav
        aria-label="Kid navigation mobile"
        className="fixed inset-x-0 bottom-0 z-50 border-t-4 border-[#0F172A] bg-white/95 backdrop-blur sm:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-3 gap-2 px-4 pb-3 pt-2">
          {NAV_ITEMS.map((item) => {
            const isActive = isNavActive(item.href, pathname, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-[60px] flex-col items-center justify-center gap-0.5 rounded-2xl border-2 border-[#0F172A] text-[11px] font-black uppercase tracking-wider shadow-[0_3px_0_#0F172A] transition active:translate-y-0.5 active:shadow-none touch-manipulation ${isActive ? "bg-[#0F172A] text-white" : item.idle}`}
              >
                <span aria-hidden="true" className="text-lg leading-none">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}