export default function SettingsPage() {
  return (
    <div className="py-6 flex flex-col gap-6">
      <div className="aralkada-card p-8 text-center min-h-[360px] flex flex-col items-center justify-center">
        <h1 className="text-2xl sm:text-3xl font-black text-[#162660] mb-2">
          Settings & Token Rules
        </h1>
        <p className="text-sm font-bold text-[#162660]/70 max-w-md">
          Configure screen-time conversion rates, daily max hours, and linked accounts.
        </p>
      </div>
    </div>
  );
}
