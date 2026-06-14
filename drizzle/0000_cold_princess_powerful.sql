CREATE TABLE "assistant" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"system_prompt" text NOT NULL,
	"model" text DEFAULT 'gemini-3.1-flash-lite' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversation" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"assistant_id" text NOT NULL,
	"title" text DEFAULT 'New Chat' NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"share_slug" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"role" text NOT NULL,
	"parts" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_assistant_id_assistant_id_fk" FOREIGN KEY ("assistant_id") REFERENCES "public"."assistant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assistant_owner_idx" ON "assistant" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "conversation_owner_idx" ON "conversation" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "conversation_share_slug_idx" ON "conversation" USING btree ("share_slug");--> statement-breakpoint
CREATE INDEX "message_conversation_idx" ON "message" USING btree ("conversation_id");