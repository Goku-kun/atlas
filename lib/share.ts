import { cacheLife, cacheTag } from "next/cache";
import { and, asc, eq } from "drizzle-orm";
import { db } from "./db";
import { assistant, conversation, message } from "./schema";

export async function getSharedConversation(slug: string) {
  "use cache";
  cacheTag(`share:${slug}`);
  cacheLife("max");

  const [convo] = await db
    .select()
    .from(conversation)
    .where(
      and(
        eq(conversation.shareSlug, slug),
        eq(conversation.visibility, "public"),
      ),
    )
    .limit(1);
  if (!convo) return null;

  const [persona] = await db
    .select({ id: assistant.id, name: assistant.name })
    .from(assistant)
    .where(eq(assistant.id, convo.assistantId))
    .limit(1);

  const messages = await db
    .select()
    .from(message)
    .where(eq(message.conversationId, convo.id))
    .orderBy(asc(message.createdAt));

  return {
    title: convo.title,
    assistantId: convo.assistantId,
    assistantName: persona?.name ?? "Assistant",
    messages,
  };
}
