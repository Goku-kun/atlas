import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.execute(sql`select 1 as ok`);
    return Response.json({ ok: true, db: result.rows?.[0] ?? "connected" });
  } catch (error) {
    console.error("Health check failed", error);
    return Response.json(
      { ok: false, error: "database unreachable" },
      { status: 503 },
    );
  }
}
