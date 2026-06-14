import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

/**
 * Renders assistant messages, which arrive as Markdown. Uses react-markdown +
 * remark-gfm (GitHub-flavored: tables, task lists, strikethrough, autolinks),
 * with every element mapped to Atlas tokens. The default react-markdown export
 * is synchronous and hook-free, so this stays renderable in Server Components
 * (the public share page) without shipping client JS.
 */
const components: Components = {
  h1: ({ children }) => (
    <h3 className="text-[1.05rem] font-semibold">{children}</h3>
  ),
  h2: ({ children }) => <h3 className="text-base font-semibold">{children}</h3>,
  h3: ({ children }) => <h4 className="text-sm font-semibold">{children}</h4>,
  h4: ({ children }) => (
    <h5 className="text-sm font-semibold text-muted">{children}</h5>
  ),
  h5: ({ children }) => (
    <h6 className="text-sm font-semibold text-muted">{children}</h6>
  ),
  h6: ({ children }) => (
    <h6 className="text-sm font-semibold text-muted">{children}</h6>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-1 pl-5 marker:text-faint">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-1 pl-5 marker:text-faint">{children}</ol>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-text underline underline-offset-2 transition-opacity hover:opacity-80"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-border-strong pl-3 text-muted">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[0.85em]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg border border-border bg-surface-2 p-3 font-mono text-[0.85rem] leading-relaxed text-ink [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[0.85rem]">
      {children}
    </pre>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  hr: () => <hr className="border-border" />,
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-surface-2">{children}</thead>,
  th: ({ children }) => (
    <th className="border border-border px-3 py-1.5 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-3 py-1.5">{children}</td>
  ),
};

export function Markdown({ text }: { text: string }) {
  return (
    <div className="space-y-3 text-[0.95rem] leading-relaxed text-ink">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
