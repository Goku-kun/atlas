import { requireUser } from "@/lib/session";
import { Sidebar } from "@/components/sidebar";
import { SidebarShell } from "./sidebar-shell";
import { TopBar } from "./top-bar";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <SidebarShell>
        <Sidebar userId={user.id} userName={user.name} />
      </SidebarShell>
      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
