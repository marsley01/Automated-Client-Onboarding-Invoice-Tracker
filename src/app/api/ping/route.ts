import { withSupabase } from "@/lib/supabase/with-auth";

export const GET = withSupabase({ auth: "none" }, async (req, ctx) => {
  const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (authHeader !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { count } = await ctx.supabaseAdmin
    .from("businesses")
    .select("*", { count: "exact", head: true });

  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    businessCount: count || 0,
  });
});
