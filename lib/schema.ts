import {
  pgTable,
  text,
  jsonb,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "@/auth-schema";

export * from "@/auth-schema";

export const assistant = pgTable(
  "assistant",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    systemPrompt: text("system_prompt").notNull(),
    model: text("model").notNull().default("gemini-3.1-flash-lite"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("assistant_owner_idx").on(t.ownerId)],
);

export const conversation = pgTable(
  "conversation",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    assistantId: text("assistant_id")
      .notNull()
      .references(() => assistant.id, { onDelete: "cascade" }),
    title: text("title").notNull().default("New Chat"),
    visibility: text("visibility", { enum: ["private", "public"] })
      .notNull()
      .default("private"),
    shareSlug: text("share_slug"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("conversation_owner_idx").on(t.ownerId),
    uniqueIndex("conversation_share_slug_idx").on(t.shareSlug),
  ],
);

export const message = pgTable(
  "message",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
    parts: jsonb("parts").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("message_conversation_idx").on(t.conversationId)],
);

export const assistantRelations = relations(assistant, ({ many }) => ({
  conversations: many(conversation),
}));

export const conversationRelations = relations(
  conversation,
  ({ one, many }) => ({
    assistant: one(assistant, {
      fields: [conversation.assistantId],
      references: [assistant.id],
    }),
    messages: many(message),
  }),
);

export const messageRelations = relations(message, ({ one }) => ({
  conversation: one(conversation, {
    fields: [message.conversationId],
    references: [conversation.id],
  }),
}));
