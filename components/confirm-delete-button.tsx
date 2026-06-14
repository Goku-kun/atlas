"use client";

import { useState } from "react";
import { TrashIcon } from "@/components/icons";

/**
 * Destructive action with a two-step inline confirm (no modal). The server
 * action is passed in from the owning server component and posted with a single
 * hidden field.
 */
export function ConfirmDeleteButton({
  action,
  fieldName,
  fieldValue,
  srLabel,
  confirmLabel = "Delete",
}: {
  action: (formData: FormData) => void | Promise<void>;
  fieldName: string;
  fieldValue: string;
  srLabel: string;
  confirmLabel?: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <form action={action} className="flex items-center gap-1">
        <input type="hidden" name={fieldName} value={fieldValue} />
        <button
          type="submit"
          className="rounded-lg bg-danger px-2.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          {confirmLabel}
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
      title={srLabel}
      aria-label={srLabel}
      onClick={() => setConfirming(true)}
      className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-danger-soft hover:text-danger"
    >
      <TrashIcon className="size-[1.05rem]" />
    </button>
  );
}
