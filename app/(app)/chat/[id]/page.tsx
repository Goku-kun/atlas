import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getConversationForUser, getAssistantForUser } from "@/lib/queries";
import { loadChatMessages } from "@/lib/chat-store";
import { Chat } from "@/components/chat";
import { ConversationToolbar } from "@/components/conversation-toolbar";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const convo = await getConversationForUser(id, user.id);
  if (!convo) notFound();

  const [persona, initialMessages] = await Promise.all([
    getAssistantForUser(convo.assistantId, user.id),
    loadChatMessages(id),
  ]);
  if (!persona) notFound();

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center border-b border-border bg-bg px-4">
        <ConversationToolbar
          conversationId={id}
          title={convo.title}
          visibility={convo.visibility}
          shareSlug={convo.shareSlug}
          assistantId={convo.assistantId}
          personaName={persona.name}
          model={persona.model}
        />
      </header>
      <Chat
        conversationId={id}
        assistantId={convo.assistantId}
        personaName={persona.name}
        systemPrompt={persona.systemPrompt}
        initialMessages={initialMessages}
      />
    </div>
  );
}
