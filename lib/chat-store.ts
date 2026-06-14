import "server-only";

import { asc, eq } from "drizzle-orm";
import type { UIMessage } from "ai";
import { db } from "./db";
import { conversation, message } from "@/lib/schema";

export async function loadChatMessages(
  conversationId: string,
): Promise<UIMessage[]> {
  const rows = await db
    .select()
    .from(message)
    .where(eq(message.conversationId, conversationId))
    .orderBy(asc(message.createdAt));

  return rows.map((r) => ({
    id: r.id,
    role: r.role as UIMessage["role"],
    parts: r.parts as UIMessage["parts"],
  }));
}

export async function saveChatMessages(
  conversationId: string,
  messages: UIMessage[],
) {
  await db.transaction(async (tx) => {
    await tx.delete(message).where(eq(message.conversationId, conversationId));
    if (messages.length > 0) {
      await tx.insert(message).values(
        messages.map((m) => ({
          id: m.id,
          conversationId,
          role: m.role,
          parts: m.parts,
        })),
      );
    }
    await tx
      .update(conversation)
      .set({ updatedAt: new Date() })
      .where(eq(conversation.id, conversationId));
  });
}
