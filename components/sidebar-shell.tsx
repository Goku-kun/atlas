"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/providers/ui-store-provider";

/**
 * The sidebar's responsive container. On md+ it's an in-flow column toggled by
 * `sidebarCollapsed`; below md it's an overlay drawer driven by `mobileNavOpen`
 * with a dimmed backdrop. The drawer closes itself after any navigation.
 */
export function SidebarShell({ children }: { children: React.ReactNode }) {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const mobileOpen = useUiStore((s) => s.mobileNavOpen);
  const closeMobileNav = useUiStore((s) => s.closeMobileNav);
  const pathname = usePathname();

  useEffect(() => {
    closeMobileNav();
  }, [pathname, closeMobileNav]);

  return (
    <>
      <div
        aria-hidden
        onClick={closeMobileNav}
        data-open={mobileOpen}
        className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-black/55 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none data-[open=true]:pointer-events-auto data-[open=true]:opacity-100 md:hidden"
      />
      <aside
        data-collapsed={collapsed}
        data-open={mobileOpen}
        className="fixed inset-y-0 left-0 z-[var(--z-modal)] flex w-[17rem] shrink-0 -translate-x-full flex-col border-r border-border bg-surface transition-transform duration-300 ease-[var(--ease-out-expo)] data-[open=true]:translate-x-0 md:static md:z-auto md:translate-x-0 md:transition-none md:data-[collapsed=true]:hidden"
      >
        {children}
      </aside>
    </>
  );
}
