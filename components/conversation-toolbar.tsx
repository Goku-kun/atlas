"use client";

import { useActionState, useRef, useState } from "react";
import {
  renameConversation,
  deleteConversation,
  unshareConversation,
  shareConversation,
} from "@/lib/actions/conversations";
import type { FormState } from "@/lib/actions/types";
import { personaInitials, personaStyle } from "@/lib/persona";
import {
  ShareIcon,
  LinkIcon,
  CheckIcon,
  LockIcon,
  GlobeIcon,
  TrashIcon,
} from "@/components/icons";

const initialState: FormState = {};

export function ConversationToolbar({
  conversationId,
  title,
  visibility,
  shareSlug,
  assistantId,
  personaName,
  model,
}: {
  conversationId: string;
  title: string;
  visibility: "private" | "public";
  shareSlug: string | null;
  assistantId: string;
  personaName: string;
  model: string;
}) {
  const [state, formAction] = useActionState(renameConversation, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div
      className="flex w-full items-center gap-3"
      style={personaStyle(assistantId)}
    >
      <span
        aria-hidden
        className="persona-avatar grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold"
      >
        {personaInitials(personaName)}
      </span>

      <div className="min-w-0 flex-1">
        <form ref={formRef} action={formAction}>
          <input type="hidden" name="conversationId" value={conversationId} />
          <input
            name="title"
            defaultValue={title}
            aria-label="Conversation title"
            spellCheck={false}
            onBlur={(e) => {
              if (e.target.value.trim() && e.target.value !== title) {
                formRef.current?.requestSubmit();
              }
            }}
            className="-mx-1.5 w-full truncate rounded-md bg-transparent px-1.5 py-0.5 text-[0.95rem] font-semibold text-ink outline-none transition-colors hover:bg-surface-2 focus:bg-surface-2"
          />
        </form>
        <div className="mt-0.5 flex items-center gap-1.5 truncate px-0 text-xs">
          <span className="persona-name font-medium">{personaName}</span>
          <span className="text-faint">·</span>
          <span className="truncate font-mono text-faint">{model}</span>
          {state.errors?.title && (
            <span className="truncate text-danger">
              · {state.errors.title.join(", ")}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {visibility === "public" && shareSlug ? (
          <PublicShareControls
            conversationId={conversationId}
            shareSlug={shareSlug}
          />
        ) : (
          <form action={shareConversation}>
            <input type="hidden" name="conversationId" value={conversationId} />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg border border-border-strong px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-2"
            >
              <ShareIcon className="size-4" />
              Share
            </button>
          </form>
        )}

        <DeleteControl conversationId={conversationId} />
      </div>
    </div>
  );
}

function PublicShareControls({
  conversationId,
  shareSlug,
}: {
  conversationId: string;
  shareSlug: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/share/${shareSlug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.open(url, "_blank", "noopener");
    }
  }

  return (
    <>
      <span
        title="This conversation is public"
        className="hidden items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-text sm:flex"
      >
        <GlobeIcon className="size-3.5" />
        Public
      </span>
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-1.5 rounded-lg border border-border-strong px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-2"
      >
        {copied ? (
          <CheckIcon className="size-4 text-success" />
        ) : (
          <LinkIcon className="size-4" />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>
      <form action={unshareConversation}>
        <input type="hidden" name="conversationId" value={conversationId} />
        <button
          type="submit"
          title="Make private"
          aria-label="Make private"
          className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <LockIcon className="size-[1.05rem]" />
        </button>
      </form>
    </>
  );
}

function DeleteControl({ conversationId }: { conversationId: string }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <form action={deleteConversation} className="flex items-center gap-1">
        <input type="hidden" name="conversationId" value={conversationId} />
        <button
          type="submit"
          className="rounded-lg bg-danger px-2.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg px-2 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          Cancel
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      title="Delete conversation"
      aria-label="Delete conversation"
      onClick={() => setConfirming(true)}
      className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-danger-soft hover:text-danger"
    >
      <TrashIcon className="size-[1.05rem]" />
    </button>
  );
}
