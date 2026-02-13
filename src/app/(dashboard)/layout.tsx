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
    <div className="relative min-h-screen">
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-4 md:flex-row md:px-6 md:py-6">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-hidden rounded-2xl border bg-card/80 backdrop-blur-xl">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-card/90 px-4 py-3 backdrop-blur-xl md:px-6">
            <div>
              <p className="text-sm text-muted-foreground">Welcome back</p>
              <h1 className="text-lg font-semibold">{session.user?.name ?? "Engineer"}</h1>
            </div>
            <TopbarActions />
          </header>
          <div className="page-enter p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
