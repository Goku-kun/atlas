"use server";

import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { assistant } from "@/lib/schema";
import { requireUser } from "@/lib/session";
import { createAssistantSchema } from "@/lib/validators";
import type { FormState } from "@/lib/actions/types";

export async function createAssistant(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();

  const parsed = createAssistantSchema.safeParse({
    name: formData.get("name"),
    systemPrompt: formData.get("systemPrompt"),
    model: formData.get("model"),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  await db.insert(assistant).values({
    ownerId: user.id,
    name: parsed.data.name,
    systemPrompt: parsed.data.systemPrompt,
    model: parsed.data.model,
  });

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function deleteAssistant(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("assistantId") ?? "");
  if (!id) throw new Error("Missing assistant id");

  await db
    .delete(assistant)
    .where(and(eq(assistant.id, id), eq(assistant.ownerId, user.id)));

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
