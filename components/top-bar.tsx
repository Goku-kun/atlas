"use client";

import { useUiStore } from "@/providers/ui-store-provider";
import { PanelIcon, SunIcon, MoonIcon } from "@/components/icons";

export function TopBar() {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const toggleMobileNav = useUiStore((s) => s.toggleMobileNav);
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  function handlePanel() {
    const desktop =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches;
    if (desktop) toggleSidebar();
    else toggleMobileNav();
  }

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border bg-bg px-2.5">
      <button
        onClick={handlePanel}
        aria-label="Toggle navigation"
        className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink"
      >
        <PanelIcon className="size-[1.2rem]" />
      </button>
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink"
      >
        {theme === "light" ? (
          <MoonIcon className="size-[1.15rem]" />
        ) : (
          <SunIcon className="size-[1.15rem]" />
        )}
      </button>
    </header>
  );
}
