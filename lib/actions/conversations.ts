"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "../db";
import { assistant, conversation } from "../schema";
import { requireUser } from "../session";
import {
  createConversationSchema,
  renameConversationSchema,
} from "../validators";
import { FormState } from "./types";

export async function createConversation(formData: FormData) {
  const user = await requireUser();

  const parsed = createConversationSchema.safeParse({
    assistantId: formData.get("assistantId"),
  });
  if (!parsed.success) {
    throw new Error("Pick an assistant");
  }

  const [owned] = await db
    .select({ id: assistant.id })
    .from(assistant)
    .where(
      and(
        eq(assistant.id, parsed.data.assistantId),
        eq(assistant.ownerId, user.id),
      ),
    )
    .limit(1);
  if (!owned) throw new Error("Assistant not found");

  const [created] = await db
    .insert(conversation)
    .values({
      ownerId: user.id,
      assistantId: parsed.data.assistantId,
      title: "New chat",
    })
    .returning({ id: conversation.id });

  revalidatePath("/", "layout");
  redirect(`/chat/${created.id}`);
}

export async function renameConversation(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();

  const parsed = renameConversationSchema.safeParse({
    conversationId: formData.get("conversationId"),
    title: formData.get("title"),
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  await db
    .update(conversation)
    .set({ title: parsed.data.title })
    .where(
      and(
        eq(conversation.id, parsed.data.conversationId),
        eq(conversation.ownerId, user.id),
      ),
    );

  revalidatePath("/", "layout");
  return { message: "Renamed" };
}

export async function deleteConversation(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("conversationId") ?? "");
  if (!id) throw new Error("Missing conversation id");

  await db
    .delete(conversation)
    .where(and(eq(conversation.id, id), eq(conversation.ownerId, user.id)));

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function shareConversation(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("conversationId") ?? "");
  if (!id) throw new Error("Missing conversation id");

  await db
    .update(conversation)
    .set({
      visibility: "public",
      shareSlug: crypto.randomUUID(),
    })
    .where(and(eq(conversation.id, id), eq(conversation.ownerId, user.id)));

  revalidatePath("/", "layout");
}

export async function unshareConversation(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("conversationId") ?? "");
  if (!id) throw new Error("Missing conversation id");

  await db
    .update(conversation)
    .set({
      visibility: "private",
      // null (not "") — the unique index on share_slug treats NULLs as distinct,
      // so multiple unshared conversations don't collide.
      shareSlug: null,
    })
    .where(and(eq(conversation.id, id), eq(conversation.ownerId, user.id)));

  revalidatePath("/", "layout");
}
