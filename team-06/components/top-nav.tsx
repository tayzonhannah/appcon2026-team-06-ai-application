"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      label: "Challenge",
      href: "/challenge",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2.2" />
          <circle cx="12" cy="12" r="6" strokeWidth="2.2" />
          <circle cx="12" cy="12" r="2" strokeWidth="2.2" />
        </svg>
      ),
    },
    {
      label: "Chatbot",
      href: "/chatbot",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="3" strokeWidth="2.2" />
          <path strokeLinecap="round" strokeWidth="2.2" d="M5 20a7 7 0 0114 0" />
        </svg>
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <header className="w-full bg-[#F1E4D1] border-b-2 border-[#4A3B2C]/25 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-0">

        {/* Brand Logo — shrink-0 so it never squishes */}
        <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer group shrink-0 mr-14">
          <div className="w-9 h-9 rounded-2xl bg-[#162660] flex items-center justify-center text-[#F1E4D1] font-black text-xl border-2 border-[#4A3B2C] shadow-[0_3px_0_#4A3B2C] transform -rotate-2 group-hover:rotate-0 transition-transform">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[#162660] leading-none">
              KITH
            </span>
            <span className="text-[9px] font-bold tracking-widest text-[#162660]/60 uppercase mt-0.5">
              Parent Dashboard
            </span>
          </div>
        </Link>

        {/* Nav items — underline style, no box border */}
        <nav className="flex items-stretch h-full gap-2 flex-1 justify-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex items-end pb-3 gap-2 px-4 h-full font-black text-xs uppercase tracking-wider transition-colors ${isActive
                    ? "text-[#162660]"
                    : "text-[#162660]/50 hover:text-[#162660]/80"
                  }`}
              >
                {/* Active underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-[#162660] rounded-t-full" />
                )}
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side — Parent badge + Logout, uniform sizing */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#D0E6FD] border-2 border-[#4A3B2C] shadow-[0_2px_0_#4A3B2C] h-9">
            <div className="w-5 h-5 rounded-md bg-[#162660] text-[#F1E4D1] text-[10px] font-black flex items-center justify-center">
              P
            </div>
            <span className="text-xs font-black text-[#162660] hidden sm:inline">Parent</span>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center px-3 py-2 rounded-xl bg-white text-[#162660] border-2 border-[#4A3B2C] shadow-[0_2px_0_#4A3B2C] hover:bg-[#F1E4D1] text-xs font-black uppercase tracking-wider transition-all h-9"
          >
            Logout
          </Link>
        </div>
      </div>
    </header>
  );
}
