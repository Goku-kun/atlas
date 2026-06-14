import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { db } from "./db";
import { assistant, conversation, message } from "./schema";

export type StoredMessage = InferSelectModel<typeof message>;
export type Conversation = InferSelectModel<typeof conversation>;
export type Assistant = InferSelectModel<typeof assistant>;

export function getConversationsForUser(userId: string) {
  return db
    .select()
    .from(conversation)
    .where(eq(conversation.ownerId, userId))
    .orderBy(desc(conversation.updatedAt));
}

export function getAssistantsForUser(userId: string) {
  return db
    .select()
    .from(assistant)
    .where(eq(assistant.ownerId, userId))
    .orderBy(desc(assistant.createdAt));
}

export async function getAssistantForUser(assistantId: string, userId: string) {
  const [row] = await db
    .select()
    .from(assistant)
    .where(and(eq(assistant.id, assistantId), eq(assistant.ownerId, userId)))
    .limit(1);
  return row ?? null;
}

export async function getConversationForUser(
  conversationId: string,
  userId: string,
) {
  const [row] = await db
    .select()
    .from(conversation)
    .where(
      and(
        eq(conversation.id, conversationId),
        eq(conversation.ownerId, userId),
      ),
    );
  return row ?? null;
}

export function getMessages(conversationId: string): Promise<StoredMessage[]> {
  return db
    .select()
    .from(message)
    .where(eq(message.conversationId, conversationId))
    .orderBy(asc(message.createdAt));
}
