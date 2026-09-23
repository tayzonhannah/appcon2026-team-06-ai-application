import { TopNav } from "@/components/dashboard/top-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F1E4D1] text-[#162660] flex flex-col font-sans">
      <TopNav />
      <main className="max-w-6xl w-full mx-auto px-6 py-4 h-[calc(100vh-4rem)] overflow-hidden">{children}</main>
    </div>
  );
}
