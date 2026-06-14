"use client";

import { useActionState, useState } from "react";
import { createAssistant } from "@/lib/actions/assistants";
import type { FormState } from "@/lib/actions/types";
import { MODELS } from "@/lib/validators";
import { personaInitials } from "@/lib/persona";
import { SubmitButton } from "@/components/submit-button";

const initialState: FormState = {};

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-border-strong bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-primary";

export function CreateAssistantForm() {
  const [state, formAction] = useActionState(createAssistant, initialState);
  const [name, setName] = useState("");

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-2 text-sm font-semibold text-muted"
        >
          {name.trim() ? personaInitials(name) : "?"}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-ink">
            {name.trim() || "Your new assistant"}
          </div>
          <div className="text-xs text-muted">
            Gets its own identity color once created.
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="text-sm font-medium text-ink">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass}
          placeholder="Code Reviewer"
          autoComplete="off"
        />
        {state.errors?.name && (
          <p className="mt-1.5 text-sm text-danger">
            {state.errors.name.join(", ")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="systemPrompt" className="text-sm font-medium text-ink">
          System prompt
        </label>
        <p className="mt-0.5 text-xs text-muted">
          The instructions that define this persona&rsquo;s voice and expertise.
        </p>
        <textarea
          id="systemPrompt"
          name="systemPrompt"
          rows={5}
          className={`${fieldClass} min-h-32 resize-y leading-relaxed`}
          placeholder="You are a meticulous senior engineer who reviews code for correctness and clarity."
        />
        {state.errors?.systemPrompt && (
          <p className="mt-1.5 text-sm text-danger">
            {state.errors.systemPrompt.join(", ")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="model" className="text-sm font-medium text-ink">
          Model
        </label>
        <select
          id="model"
          name="model"
          defaultValue="gemini-3.1-flash-lite"
          className={`${fieldClass} font-mono`}
        >
          {MODELS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end pt-1">
        <SubmitButton idle="Create assistant" pending="Creating…" />
      </div>
    </form>
  );
}
