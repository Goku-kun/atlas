import type { CSSProperties } from "react";

/**
 * Persona identity is derived, not stored. Each assistant's `id` deterministically
 * maps to a stable hue on the OKLCH wheel — so a persona wears the same color in the
 * sidebar, the conversation header, its messages, and the public share page, with no
 * schema column and no migration. The hue feeds CSS via the `--persona-h` custom
 * property; all luminance/chroma (and therefore all contrast) is fixed in globals.css
 * and verified ≥ WCAG AA, so the derived color can never fall below the bar.
 */
function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Stable hue in [0, 360) for a persona id. */
export function personaHue(id: string): number {
  return hashString(id) % 360;
}

/** Inline style carrying the persona hue; spread onto any element that uses the
 *  `.persona-*` helper classes. */
export function personaStyle(id: string): CSSProperties {
  return { "--persona-h": String(personaHue(id)) } as CSSProperties;
}

/** 1–2 character initials for an avatar, derived from the persona name. */
export function personaInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
