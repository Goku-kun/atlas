import { z } from "zod";

export const MODELS = ["gemini-3.1-flash-lite", "gemini-3.5-flash"] as const;

export const createAssistantSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  systemPrompt: z
    .string()
    .trim()
    .min(1, "A system prompt is required")
    .max(4000),
  model: z.enum(MODELS),
});

export const createConversationSchema = z.object({
  assistantId: z.string().min(1, "Pick an assistant"),
});

export const renameConversationSchema = z.object({
  conversationId: z.string().min(1),
  title: z.string().trim().min(1, "Title is required").max(120),
});
