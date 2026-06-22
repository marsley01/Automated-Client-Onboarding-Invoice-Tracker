import { createSupabaseContext } from "@/lib/supabase/with-auth";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "user" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const { status, notes } = await request.json();

  const { data: job } = await ctx.supabase.from("jobs").select("status").eq("id", params.id).single();
  if (!job) return Response.json({ error: "Job not found" }, { status: 404 });

  const { error: updateError } = await ctx.supabase
    .from("jobs")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", params.id);

  if (updateError) return Response.json({ error: updateError.message }, { status: 500 });

  const { error: historyError } = await ctx.supabase.from("job_status_history").insert({
    job_id: params.id,
    from_status: job.status,
    to_status: status,
    notes: notes || null,
    changed_by: ctx.userClaims!.id,
  });

  if (historyError) return Response.json({ error: historyError.message }, { status: 500 });

  return Response.json({ success: true });
}
