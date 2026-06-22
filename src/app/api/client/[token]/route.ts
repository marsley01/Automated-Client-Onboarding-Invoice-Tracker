import { createSupabaseContext } from "@/lib/supabase/with-auth";

export async function GET(request: Request, { params }: { params: { token: string } }) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "none" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const { data: job } = await ctx.supabaseAdmin
    .from("jobs")
    .select("*, clients(*), businesses(name, logo_url), job_status_history(*)")
    .eq("client_token", params.token)
    .single();

  if (!job) return Response.json({ error: "Not found" }, { status: 404 });

  const { data: invoices } = await ctx.supabaseAdmin
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("job_id", job.id)
    .order("created_at", { ascending: false });

  return Response.json({ ...job, invoices: invoices || [] });
}
