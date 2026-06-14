import {
  convertToModelMessages,
  streamText,
  createIdGenerator,
  type UIMessage,
} from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { assistant, conversation } from "@/lib/schema";
import { saveChatMessages } from "@/lib/chat-store";
import { revalidateTag } from "next/cache";

export const maxDuration = 30;

const BodySchema = z.object({
  conversationId: z.string().min(1),
  assistantId: z.string().min(1),
  messages: z.array(z.any()), // UIMessage[]; the SDK validates the shape downstream
});

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) return new Response("Bad request", { status: 400 });
  const { conversationId, assistantId, messages } = parsed.data;

  const [convo] = await db
    .select({
      id: conversation.id,
      visibility: conversation.visibility,
      shareSlug: conversation.shareSlug,
    })
    .from(conversation)
    .where(
      and(
        eq(conversation.id, conversationId),
        eq(conversation.ownerId, session.user.id),
      ),
    )
    .limit(1);
  if (!convo) return new Response("Conversation not found", { status: 404 });

  const [persona] = await db
    .select({ model: assistant.model, systemPrompt: assistant.systemPrompt })
    .from(assistant)
    .where(
      and(
        eq(assistant.id, assistantId),
        eq(assistant.ownerId, session.user.id),
      ),
    )
    .limit(1);
  if (!persona) return new Response("Assistant not found", { status: 404 });

  const result = streamText({
    model: google(persona.model),
    system: persona.systemPrompt,
    messages: await convertToModelMessages(messages as UIMessage[]),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages as UIMessage[],
    generateMessageId: createIdGenerator({ prefix: "msg", size: 16 }),
    onFinish: async ({ messages }) => {
      try {
        await saveChatMessages(conversationId, messages);
        if (convo.visibility === "public" && convo.shareSlug) {
          // Route handlers use revalidateTag (updateTag is Server-Action-only).
          revalidateTag(`share:${convo.shareSlug}`, "max");
        }
      } catch (error) {
        console.error("Failed to persist chat", { conversationId, error });
      }
    },
  });
}
