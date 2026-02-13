import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { TopbarActions } from "@/components/layout/topbar-actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="relative min-h-screen bg-neutral-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 md:flex-row md:py-6">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-4 py-3 backdrop-blur-md md:px-6">
            <div>
              <p className="text-sm text-neutral-400">Welcome back</p>
              <h1 className="text-lg font-semibold tracking-tight text-zinc-100">{session.user?.name ?? "Engineer"}</h1>
            </div>
            <TopbarActions />
          </header>
          <div className="page-enter p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
