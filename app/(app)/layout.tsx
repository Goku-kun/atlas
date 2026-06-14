import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth is enforced inside <AppShell>, which renders under the Suspense
  // boundary below. Reading the session (cookies/headers) there — not in this
  // layout body — keeps the route's static shell prerenderable with
  // cacheComponents enabled. Awaiting requireUser() here would access dynamic
  // data outside <Suspense> and block the whole route from rendering.
  return (
    <Suspense fallback={<AppShellSkeleton />}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}

function AppShellSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-bg" aria-hidden>
      <div className="hidden w-[17rem] shrink-0 flex-col gap-2 border-r border-border bg-surface p-4 md:flex">
        <div className="h-6 w-24 animate-pulse rounded-md bg-surface-2" />
        <div className="mt-4 h-3 w-20 animate-pulse rounded bg-surface-2" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 animate-pulse rounded-lg bg-surface-2" />
        ))}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="h-12 shrink-0 border-b border-border" />
        <div className="flex-1 p-6">
          <div className="h-7 w-48 animate-pulse rounded-md bg-surface" />
        </div>
      </div>
    </div>
  );
}
