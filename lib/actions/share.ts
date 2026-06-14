"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { db } from "@/lib/db";
import { conversation } from "@/lib/schema";
import { requireUser } from "@/lib/session";

function makeSlug() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

export async function shareConversation(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("conversationId") ?? "");
  if (!id) throw new Error("Missing conversation id");

  const [convo] = await db
    .select()
    .from(conversation)
    .where(and(eq(conversation.id, id), eq(conversation.ownerId, user.id)))
    .limit(1);
  if (!convo) throw new Error("Conversation not found");

  const slug = convo.shareSlug ?? makeSlug();
  await db
    .update(conversation)
    .set({ visibility: "public", shareSlug: slug })
    .where(and(eq(conversation.id, id), eq(conversation.ownerId, user.id)));

  updateTag(`share:${slug}`);
  revalidatePath("/", "layout");
}

export async function unshareConversation(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("conversationId") ?? "");
  if (!id) throw new Error("Missing conversation id");

  const [convo] = await db
    .select()
    .from(conversation)
    .where(and(eq(conversation.id, id), eq(conversation.ownerId, user.id)))
    .limit(1);
  if (!convo) throw new Error("Conversation not found");

  await db
    .update(conversation)
    .set({ visibility: "private" })
    .where(and(eq(conversation.id, id), eq(conversation.ownerId, user.id)));

  if (convo.shareSlug) updateTag(`share:${convo.shareSlug}`);
  revalidatePath("/", "layout");
}
