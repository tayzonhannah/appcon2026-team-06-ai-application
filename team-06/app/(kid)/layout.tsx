"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import KidBackground from "@/components/kid-background";
import CompassMascot from "@/components/compass-mascot";

const NAV_ITEMS = [
  { href: "/kid", label: "Home", exact: true, idle: "bg-white", icon: "⌂" },
  { href: "/kid/missions", label: "Missions", exact: false, idle: "bg-[#F59E0B]", icon: "★" },
  { href: "/kid/chatbot", label: "Compass", exact: false, idle: "bg-[#EC4899] text-white", icon: "◉" },
] as const;

const MOBILE_NAV_ITEMS = [
  ...NAV_ITEMS,
  { href: "/login", label: "Profile", exact: true, idle: "bg-white", icon: "K", avatar: true },
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
    <div className="relative min-h-screen text-[#0F172A]">
      <KidBackground />
      <CompassMascot />
      <header className="sticky top-0 z-20 border-b-2 border-[#0F172A]/10 bg-[#EFF6FF]/95 backdrop-blur">
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

          {/* Streak chip — same size language as the nav buttons */}
          <div className="flex items-center gap-2">
            <span className="rounded-xl border-2 border-[#0F172A] bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[0_2px_0_#0F172A]" aria-label="7 day streak">
              🔥 7 days
            </span>
            {/* Desktop profile icon (mobile uses the bottom bar instead) */}
            <Link
              href="/login"
              aria-label="Open profile"
              className="hidden h-[42px] w-[42px] items-center justify-center rounded-xl border-2 border-[#0F172A] bg-[#EC4899] text-sm font-black text-white shadow-[0_2px_0_#0F172A] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none focus:outline-none focus:ring-4 focus:ring-[#EC4899]/30 touch-manipulation sm:flex"
            >
              K
            </Link>
          </div>
        </div>
      </header>
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col px-4 pb-28 pt-6 sm:px-6 sm:py-10 sm:pb-10">
        {children}
      </main>

      {/* Mobile bottom tab bar — Home / Missions / Compass / Profile */}
      <nav
        aria-label="Kid navigation mobile"
        className="fixed inset-x-0 bottom-0 z-50 border-t-4 border-[#0F172A] bg-white/95 backdrop-blur sm:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-4 gap-2 px-3 pb-3 pt-2">
          {MOBILE_NAV_ITEMS.map((item) => {
            const isActive = isNavActive(item.href, pathname, item.exact);
            const isAvatar = "avatar" in item && item.avatar;
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label === "Profile" ? "Open profile" : undefined}
                className={`flex min-h-[60px] flex-col items-center justify-center gap-0.5 rounded-2xl border-2 border-[#0F172A] text-[10px] font-black uppercase tracking-wider shadow-[0_3px_0_#0F172A] transition active:translate-y-0.5 active:shadow-none touch-manipulation ${isActive ? "bg-[#0F172A] text-white" : item.idle}`}
              >
                {isAvatar ? (
                  <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-current text-[11px] font-black">K</span>
                ) : (
                  <span aria-hidden="true" className="text-lg leading-none">{item.icon}</span>
                )}
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}