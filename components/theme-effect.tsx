"use client";

import { useEffect } from "react";
import { useUiStore } from "@/providers/ui-store-provider";

export function ThemeEffect() {
  const theme = useUiStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return null;
}
