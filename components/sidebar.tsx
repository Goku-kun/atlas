import Link from "next/link";
import { getAssistantsForUser, getConversationsForUser } from "@/lib/queries";
import { SidebarNav } from "@/components/sidebar-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { PlusIcon } from "@/components/icons";

export async function Sidebar({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const [conversations, assistants] = await Promise.all([
    getConversationsForUser(userId),
    getAssistantsForUser(userId),
  ]);

  const initial = userName.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between gap-2 px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-[0.9375rem] font-semibold tracking-tight text-ink"
        >
          <span
            aria-hidden
            className="grid size-6 place-items-center rounded-md bg-primary font-bold text-primary-ink"
          >
            A
          </span>
          Atlas
        </Link>
        <Link
          href="/assistants/new"
          title="New assistant"
          aria-label="New assistant"
          className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <PlusIcon className="size-[1.15rem]" />
        </Link>
      </div>

      <SidebarNav
        assistants={assistants.map((a) => ({ id: a.id, name: a.name }))}
        conversations={conversations.map((c) => ({
          id: c.id,
          title: c.title,
          assistantId: c.assistantId,
        }))}
      />

      <div className="flex items-center gap-2.5 border-t border-border px-3 py-2.5">
        <span
          aria-hidden
          className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-semibold text-muted"
        >
          {initial}
        </span>
        <span className="flex-1 truncate text-sm text-ink">{userName}</span>
        <SignOutButton />
      </div>
    </div>
  );
}
