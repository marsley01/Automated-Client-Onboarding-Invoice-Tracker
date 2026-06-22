import { createSupabaseContext } from "@/lib/supabase/with-auth";

export async function POST(request: Request, { params }: { params: { token: string } }) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "none" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const { client_name, client_email, client_phone, description } = await request.json();

  const { data: job } = await ctx.supabaseAdmin
    .from("jobs")
    .select("id, business_id, client_id")
    .eq("client_token", params.token)
    .single();

  if (!job) return Response.json({ error: "Not found" }, { status: 404 });

  const { error: subError } = await ctx.supabaseAdmin.from("client_submissions").insert({
    job_id: job.id,
    client_name: client_name || null,
    client_email: client_email || null,
    client_phone: client_phone || null,
    description: description || "",
  });

  if (subError) return Response.json({ error: subError.message }, { status: 500 });

  if (client_name) {
    if (job.client_id) {
      await ctx.supabaseAdmin.from("clients").update({ name: client_name, email: client_email || "", phone: client_phone || null }).eq("id", job.client_id);
    } else {
      const { data: newClient } = await ctx.supabaseAdmin.from("clients").insert({
        business_id: job.business_id,
        name: client_name,
        email: client_email || "",
        phone: client_phone || null,
      }).select().single();

      if (newClient) {
        await ctx.supabaseAdmin.from("jobs").update({ client_id: newClient.id }).eq("id", job.id);
      }
    }
  }

  await ctx.supabaseAdmin.from("jobs").update({ client_submission_done: true }).eq("id", job.id);

  return Response.json({ success: true });
}
