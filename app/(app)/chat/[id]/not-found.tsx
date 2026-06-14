import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

export default function ChatNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
      <h2 className="text-xl font-semibold tracking-tight text-ink">
        Conversation not found
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted">
        It doesn&rsquo;t exist, or it isn&rsquo;t yours.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-1.5 rounded-xl border border-border-strong px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-2"
      >
        <ArrowLeftIcon className="size-4" />
        Back to dashboard
      </Link>
    </div>
  );
}
