"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { personaInitials, personaStyle } from "@/lib/persona";
import { ArrowUpIcon, AlertIcon, RefreshIcon } from "@/components/icons";
import { Markdown } from "@/components/markdown";

function messageText(m: UIMessage): string {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

export function Chat({
  conversationId,
  assistantId,
  personaName,
  systemPrompt,
  initialMessages,
}: {
  conversationId: string;
  assistantId: string;
  personaName: string;
  systemPrompt: string;
  initialMessages: UIMessage[];
}) {
  const [input, setInput] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, regenerate, stop } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  // Auto-grow the composer (JS fallback for browsers without field-sizing).
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 192)}px`;
  }, [input]);

  // Follow the conversation as it streams, unless the reader scrolled up.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 160;
    if (nearBottom || status === "submitted") {
      endRef.current?.scrollIntoView({ block: "end" });
    }
  }, [messages, status]);

  const initials = personaInitials(personaName);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || status !== "ready") return;
    sendMessage({ text }, { body: { conversationId, assistantId } });
    setInput("");
  }

  const busy = status === "submitted" || status === "streaming";
  const empty = messages.length === 0;

  return (
    <div
      className="flex h-full min-h-0 flex-col"
      style={personaStyle(assistantId)}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          {empty ? (
            <EmptyState
              personaName={personaName}
              initials={initials}
              systemPrompt={systemPrompt}
            />
          ) : (
            <ol className="flex flex-col gap-1.5">
              {messages.map((m) =>
                m.role === "assistant" ? (
                  <li
                    key={m.id}
                    className="persona-tint animate-rise-in flex gap-3 rounded-xl px-3 py-3.5"
                  >
                    <Avatar className="persona-avatar">{initials}</Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="persona-name text-sm font-semibold">
                        {personaName}
                      </div>
                      <div className="mt-1">
                        <Markdown text={messageText(m)} />
                      </div>
                    </div>
                  </li>
                ) : (
                  <li
                    key={m.id}
                    className="animate-rise-in flex gap-3 rounded-xl px-3 py-3.5"
                  >
                    <Avatar className="bg-surface-2 text-muted">You</Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-ink">You</div>
                      <div className="mt-1 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-ink">
                        {messageText(m)}
                      </div>
                    </div>
                  </li>
                ),
              )}

              {status === "submitted" && (
                <li className="persona-tint flex gap-3 rounded-xl px-3 py-3.5">
                  <Avatar className="persona-avatar">{initials}</Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="persona-name text-sm font-semibold">
                      {personaName}
                    </div>
                    <div className="mt-2.5 flex gap-1.5" aria-label="Thinking">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="persona-name size-1.5 rounded-full bg-current [animation:blink_1.1s_var(--ease-out-quart)_infinite]"
                          style={{ animationDelay: `${i * 0.18}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </li>
              )}
            </ol>
          )}

          {error && (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-danger-soft px-4 py-3">
              <AlertIcon className="size-5 shrink-0 text-danger" />
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-medium text-ink">The assistant didn’t reply.</p>
                <p className="text-muted">
                  Something interrupted the response. You can try again.
                </p>
              </div>
              <button
                type="button"
                onClick={() => regenerate()}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-2"
              >
                <RefreshIcon className="size-4" />
                Try again
              </button>
            </div>
          )}

          <div ref={endRef} />
        </div>
      </div>

      <form
        onSubmit={submit}
        className="shrink-0 border-t border-border bg-bg px-4 py-3"
      >
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-end gap-2 rounded-2xl border border-border-strong bg-surface px-3 py-2 shadow-[var(--shadow-1)] transition-colors focus-within:border-primary">
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={1}
              placeholder={`Message ${personaName}…`}
              aria-label={`Message ${personaName}`}
              className="max-h-48 flex-1 resize-none bg-transparent py-1.5 text-[0.95rem] leading-relaxed text-ink outline-none placeholder:text-faint"
            />
            {busy ? (
              <button
                type="button"
                onClick={stop}
                aria-label="Stop generating"
                className="grid size-9 shrink-0 place-items-center rounded-xl border border-border-strong text-ink transition-colors hover:bg-surface-2"
              >
                <span className="size-2.5 rounded-[3px] bg-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-ink transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowUpIcon className="size-5" />
              </button>
            )}
          </div>
          <p className="mt-1.5 px-1 text-[0.6875rem] text-faint">
            <kbd className="font-sans font-medium text-muted">Enter</kbd> to send
            · <kbd className="font-sans font-medium text-muted">Shift + Enter</kbd>{" "}
            for a new line
          </p>
        </div>
      </form>
    </div>
  );
}

function Avatar({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      aria-hidden
      className={`grid size-8 shrink-0 place-items-center rounded-full text-[0.6875rem] font-semibold ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

function EmptyState({
  personaName,
  initials,
  systemPrompt,
}: {
  personaName: string;
  initials: string;
  systemPrompt: string;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-12 text-center sm:py-20">
      <span
        aria-hidden
        className="persona-avatar grid size-16 place-items-center rounded-2xl text-xl font-bold"
      >
        {initials}
      </span>
      <h2 className="mt-4 text-lg font-semibold text-ink">
        Talk with {personaName}
      </h2>
      <p className="mt-1 max-w-sm text-sm text-muted">
        This is the start of your conversation. Everything you both say is saved
        automatically.
      </p>
      {systemPrompt.trim() && (
        <div className="mt-6 w-full max-w-md rounded-xl border border-border bg-surface px-4 py-3 text-left">
          <div className="text-[0.6875rem] font-semibold uppercase tracking-wider text-faint">
            How {personaName} behaves
          </div>
          <p className="mt-1.5 line-clamp-4 text-sm leading-relaxed text-muted">
            {systemPrompt}
          </p>
        </div>
      )}
    </div>
  );
}
