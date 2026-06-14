import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSharedConversation } from "@/lib/share";
import { MessageList } from "@/components/message-list";
import { personaInitials, personaStyle } from "@/lib/persona";
import { GlobeIcon } from "@/components/icons";

export default function SharePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3.5">
          <Link
            href="/"
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
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <GlobeIcon className="size-3.5" />
            Shared · read-only
          </span>
        </div>
      </header>

      <Suspense fallback={<SharedSkeleton />}>
        <SharedConversation params={params} />
      </Suspense>
    </main>
  );
}

async function SharedConversation({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shared = await getSharedConversation(slug);
  if (!shared) notFound();

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 pt-8">
        <div
          className="flex items-center gap-3"
          style={personaStyle(shared.assistantId)}
        >
          <span
            aria-hidden
            className="persona-avatar grid size-11 shrink-0 place-items-center rounded-xl text-sm font-semibold"
          >
            {personaInitials(shared.assistantName)}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight text-ink">
              {shared.title}
            </h1>
            <p className="persona-name truncate text-sm font-medium">
              {shared.assistantName}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <MessageList
          messages={shared.messages}
          personaName={shared.assistantName}
          assistantId={shared.assistantId}
        />
      </div>

      <footer className="mx-auto max-w-2xl px-4 pb-12 text-center">
        <Link
          href="/"
          className="text-xs text-muted transition-colors hover:text-ink"
        >
          Created with Atlas — make your own AI assistants →
        </Link>
      </footer>
    </>
  );
}

function SharedSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8" aria-hidden>
      <div className="flex items-center gap-3">
        <div className="size-11 animate-pulse rounded-xl bg-surface" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-1/2 animate-pulse rounded bg-surface" />
          <div className="h-3 w-24 animate-pulse rounded bg-surface" />
        </div>
      </div>
      <div className="mt-8 space-y-3">
        <div className="h-20 animate-pulse rounded-xl bg-surface" />
        <div className="h-16 animate-pulse rounded-xl bg-surface" />
      </div>
    </div>
  );
}
