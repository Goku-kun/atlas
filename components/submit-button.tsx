"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  idle,
  pending,
}: {
  idle: string;
  pending: string;
}) {
  const { pending: isPending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={isPending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-ink transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending && (
        <span
          aria-hidden
          className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}
      {isPending ? pending : idle}
    </button>
  );
}
