"use client";

import { useState } from "react";

export default function Home() {
  const [authMode, setAuthMode] = useState<"login" | "signup_parent" | "signup_kid">("login");

  return (
    <div className="min-h-screen bg-[#F1E4D1] text-[#162660] flex flex-col font-sans selection:bg-[#D0E6FD] selection:text-[#162660]">
      {/* Top Header Bar - Bordered bottom like Aralkada */}
      <header className="w-full border-b-2 border-[#4A3B2C]/30 bg-[#F1E4D1]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-2xl bg-[#162660] flex items-center justify-center text-[#F1E4D1] font-black text-2xl border-2 border-[#4A3B2C] shadow-[0_3px_0_#4A3B2C] transform -rotate-2 group-hover:rotate-0 transition-transform">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-[#162660] leading-none">
                THE CONSCIOUS FUTURE
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#162660]/70 uppercase mt-1">
                AI-POWERED OFFLINE GROWTH
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container - Auth Card aligned to the right side */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 flex items-center justify-end py-8 sm:py-5">
        {/* Auth Form Card - Aralkada Claymorphism Style */}
        <div className="w-full max-w-md aralkada-card p-6 sm:p-8 flex flex-col my-4">


          {/* Card Title */}
          <h2 className="text-2xl sm:text-3xl font-black text-center text-[#162660] mb-6 tracking-tight">
            {authMode === "login" && "Log in"}
            {authMode === "signup_parent" && "Sign up as Parent"}
            {authMode === "signup_kid" && "Sign up Kid Account"}
          </h2>


          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
            {/* Username / Email */}
            <div>
              <label htmlFor="auth-username" className="block text-xs font-black text-[#162660] uppercase tracking-wider mb-1.5">
                {authMode === "signup_kid" ? "Kid Username" : "Email or username"}
              </label>
              <input
                id="auth-username"
                type="text"
                placeholder={authMode === "signup_kid" ? "Choose a fun username" : "Email or username"}
                className="w-full px-4 py-3.5 aralkada-input text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="auth-password" className="block text-xs font-black text-[#162660] uppercase tracking-wider">
                  Password
                </label>
                {authMode === "login" && (
                  <button
                    type="button"
                    className="text-xs font-black text-[#162660]/75 hover:text-[#162660] uppercase tracking-wider underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#162660]/40 rounded"
                  >
                    FORGOT?
                  </button>
                )}
              </div>
              <input
                id="auth-password"
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3.5 aralkada-input text-sm"
              />
            </div>

            {/* Parent Link Code for Kid Sign up */}
            {authMode === "signup_kid" && (
              <div>
                <label htmlFor="parent-code" className="block text-xs font-black text-[#162660] uppercase tracking-wider mb-1.5">
                  Parent Link Code
                </label>
                <input
                  id="parent-code"
                  type="text"
                  placeholder="Enter 6-digit code from parent"
                  className="w-full px-4 py-3.5 aralkada-input text-sm"
                />
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full mt-2 py-4 aralkada-btn-primary text-base cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#162660]/30"
            >
              {authMode === "login" && "LOG IN"}
              {authMode === "signup_parent" && "CREATE PARENT ACCOUNT"}
              {authMode === "signup_kid" && "CREATE KID ACCOUNT"}
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative my-7 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#4A3B2C]/20"></div>
            </div>
            <span className="relative px-3 bg-white text-xs font-black uppercase tracking-widest text-[#162660]/60">
              OR
            </span>
          </div>

          {/* Dual Sign Up Section */}
          {authMode === "login" ? (
            <div className="flex flex-col gap-3">
              <span className="text-center text-xs font-black text-[#162660]/80 uppercase tracking-wider mb-0.5">
                Don't have an account? Sign up:
              </span>

              <button
                type="button"
                onClick={() => setAuthMode("signup_parent")}
                className="w-full py-3.5 px-4 aralkada-btn-secondary text-sm cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#D0E6FD]"
              >
                <span>SIGN UP AS PARENT</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMode("signup_kid")}
                className="w-full py-3.5 px-4 aralkada-btn-outline text-sm cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#F1E4D1]"
              >
                <span>SIGN UP KID ACCOUNT</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="text-xs font-black text-[#162660] uppercase tracking-wider hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#162660]/40 rounded p-1"
              >
                Already have an account? Log in
              </button>
            </div>
          )}



          {/* Footer Terms */}
          <p className="mt-8 text-center text-[11px] font-extrabold text-[#162660]/70 leading-relaxed">
            By signing up or logging in, you agree to our{" "}
            <a href="#" className="underline font-black text-[#162660] focus:outline-none focus:ring-1 focus:ring-[#162660]">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline font-black text-[#162660] focus:outline-none focus:ring-1 focus:ring-[#162660]">
              Privacy Policy
            </a>
            .
          </p>
        </div>

      </main>
    </div>
  );
}


