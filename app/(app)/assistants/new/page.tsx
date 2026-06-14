import Link from "next/link";
import { CreateAssistantForm } from "@/components/create-assistant-form";
import { ArrowLeftIcon } from "@/components/icons";

export default function NewAssistantPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeftIcon className="size-4" />
        Back to dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
        New assistant
      </h1>
      <p className="mt-1 text-sm text-muted">
        Give it a name, a voice, and a model. You can chat with it the moment it
        exists.
      </p>
      <div className="mt-8">
        <CreateAssistantForm />
      </div>
    </div>
  );
}
