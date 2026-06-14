"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createConversation } from "@/lib/actions/conversations";
import { personaInitials, personaStyle } from "@/lib/persona";
import { PlusIcon } from "@/components/icons";

type RosterAssistant = { id: string; name: string };
type NavConversation = { id: string; title: string; assistantId: string };

export function SidebarNav({
  assistants,
  conversations,
}: {
  assistants: RosterAssistant[];
  conversations: NavConversation[];
}) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto px-2.5 py-3">
      <SectionLabel>Assistants</SectionLabel>
      {assistants.length === 0 ? (
        <Link
          href="/assistants/new"
          className="mt-1 mb-5 flex items-center gap-2 rounded-lg border border-dashed border-border-strong px-3 py-2.5 text-sm text-muted transition-colors hover:border-primary hover:text-ink"
        >
          <PlusIcon className="size-4 text-primary-text" />
          Create your first assistant
        </Link>
      ) : (
        <ul className="mt-1 mb-5 flex flex-col gap-0.5">
          {assistants.map((a) => (
            <li key={a.id}>
              <form action={createConversation}>
                <input type="hidden" name="assistantId" value={a.id} />
                <button
                  type="submit"
                  aria-label={`Start a new chat with ${a.name}`}
                  className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm text-ink transition-colors hover:bg-surface-2"
                >
                  <span
                    style={personaStyle(a.id)}
                    className="persona-avatar grid size-7 shrink-0 place-items-center rounded-full text-[0.6875rem] font-semibold"
                  >
                    {personaInitials(a.name)}
                  </span>
                  <span className="flex-1 truncate">{a.name}</span>
                  <PlusIcon className="size-4 shrink-0 text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <SectionLabel>Conversations</SectionLabel>
      {conversations.length === 0 ? (
        <p className="mt-1 px-2 py-1.5 text-sm text-faint">No conversations yet.</p>
      ) : (
        <ul className="mt-1 flex flex-col gap-0.5">
          {conversations.map((c) => {
            const active = pathname === `/chat/${c.id}`;
            return (
              <li key={c.id}>
                <Link
                  href={`/chat/${c.id}`}
                  style={personaStyle(c.assistantId)}
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  className={
                    "group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors " +
                    (active
                      ? "persona-soft font-medium text-ink"
                      : "text-muted hover:bg-surface-2 hover:text-ink")
                  }
                >
                  <span className="persona-dot size-2 shrink-0 rounded-full" />
                  <span className="flex-1 truncate">{c.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="px-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted">
      {children}
    </h2>
  );
}
