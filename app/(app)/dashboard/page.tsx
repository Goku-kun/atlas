import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getAssistantsForUser } from "@/lib/queries";
import { createConversation } from "@/lib/actions/conversations";
import { deleteAssistant } from "@/lib/actions/assistants";
import { personaInitials, personaStyle } from "@/lib/persona";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { PlusIcon, ArrowUpIcon } from "@/components/icons";

export default async function DashboardPage() {
  const user = await requireUser();
  const assistants = await getAssistantsForUser(user.id);
  const firstName = user.name.trim().split(/\s+/)[0] || "there";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Your assistants
          </h1>
          <p className="mt-1 text-sm text-muted">
            Welcome back, {firstName}. Pick a persona to start a conversation —
            or make a new one.
          </p>
        </div>
        <Link
          href="/assistants/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-ink transition hover:bg-primary-hover"
        >
          <PlusIcon className="size-4" />
          New assistant
        </Link>
      </div>

      {assistants.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border-strong px-6 py-16 text-center">
          <span
            aria-hidden
            className="grid size-14 place-items-center rounded-2xl bg-surface-2 text-muted"
          >
            <PlusIcon className="size-6" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-ink">
            No assistants yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Create your first persona — give it a system prompt and a model — and
            start a conversation in seconds.
          </p>
          <Link
            href="/assistants/new"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-ink transition hover:bg-primary-hover"
          >
            <PlusIcon className="size-4" />
            Create an assistant
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,17rem),1fr))]">
          {assistants.map((a) => (
            <li
              key={a.id}
              style={personaStyle(a.id)}
              className="flex flex-col rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-border-strong"
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="persona-avatar grid size-10 shrink-0 place-items-center rounded-xl text-sm font-semibold"
                >
                  {personaInitials(a.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-ink">{a.name}</div>
                  <div className="mt-0.5 truncate font-mono text-xs text-muted">
                    {a.model}
                  </div>
                </div>
              </div>

              <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-muted">
                {a.systemPrompt}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <form action={createConversation} className="flex-1">
                  <input type="hidden" name="assistantId" value={a.id} />
                  <button
                    type="submit"
                    className="persona-soft flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium text-ink transition-[filter] hover:brightness-110"
                  >
                    Start chat
                    <ArrowUpIcon className="size-4 rotate-90" />
                  </button>
                </form>
                <ConfirmDeleteButton
                  action={deleteAssistant}
                  fieldName="assistantId"
                  fieldValue={a.id}
                  srLabel={`Delete ${a.name}`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
