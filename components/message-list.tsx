import type { StoredMessage } from "@/lib/queries";
import { personaInitials, personaStyle } from "@/lib/persona";
import { Markdown } from "@/components/markdown";

type TextPart = { type: string; text?: string };

function renderText(parts: unknown): string {
  if (!Array.isArray(parts)) return "";
  return (parts as TextPart[])
    .filter((p) => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text)
    .join("");
}

export function MessageList({
  messages,
  personaName,
  assistantId,
}: {
  messages: StoredMessage[];
  personaName: string;
  assistantId: string;
}) {
  if (messages.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-faint">
        This conversation has no messages yet.
      </p>
    );
  }

  const initials = personaInitials(personaName);

  return (
    <ol className="flex flex-col gap-1.5" style={personaStyle(assistantId)}>
      {messages.map((m) =>
        m.role === "assistant" ? (
          <li
            key={m.id}
            className="persona-tint flex gap-3 rounded-xl px-3 py-3.5"
          >
            <span
              aria-hidden
              className="persona-avatar grid size-8 shrink-0 place-items-center rounded-full text-[0.6875rem] font-semibold"
            >
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="persona-name text-sm font-semibold">
                {personaName}
              </div>
              <div className="mt-1">
                <Markdown text={renderText(m.parts)} />
              </div>
            </div>
          </li>
        ) : (
          <li key={m.id} className="flex gap-3 rounded-xl px-3 py-3.5">
            <span
              aria-hidden
              className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-[0.6875rem] font-semibold text-muted"
            >
              You
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-ink">You</div>
              <div className="mt-1 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-ink">
                {renderText(m.parts)}
              </div>
            </div>
          </li>
        ),
      )}
    </ol>
  );
}
