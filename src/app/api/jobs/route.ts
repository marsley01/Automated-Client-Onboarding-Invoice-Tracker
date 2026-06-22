import { withSupabase } from "@/lib/supabase/with-auth";
import { generateJobNumber } from "@/lib/utils";

export const POST = withSupabase({ auth: "user" }, async (req, ctx) => {
  const { title, category, priority, description, due_date, internal_notes, client_id, client_name, client_email, client_phone, client_company } = await req.json();

  const { data: bu } = await ctx.supabase
    .from("business_users")
    .select("business_id")
    .eq("user_id", ctx.userClaims!.id)
    .single();

  if (!bu) return Response.json({ error: "No business found" }, { status: 400 });

  const businessId = bu.business_id;
  let finalClientId = client_id || null;

  if (!finalClientId && client_name) {
    const { data: newClient } = await ctx.supabase
      .from("clients")
      .insert({ business_id: businessId, name: client_name, email: client_email || "", phone: client_phone || null, company: client_company || null })
      .select()
      .single();
    if (newClient) finalClientId = newClient.id;
  }

  const { data: business } = await ctx.supabase
    .from("businesses")
    .select("job_counter")
    .eq("id", businessId)
    .single();

  const nextCounter = (business?.job_counter || 0) + 1;
  const jobNumber = generateJobNumber(nextCounter);

  const { data: job, error: jobError } = await ctx.supabase
    .from("jobs")
    .insert({
      business_id: businessId,
      client_id: finalClientId,
      job_number: jobNumber,
      title,
      category: category || "general",
      priority: priority || "normal",
      description: description || null,
      due_date: due_date || null,
      internal_notes: internal_notes || null,
    })
    .select()
    .single();

  if (jobError) return Response.json({ error: jobError.message }, { status: 500 });

  await ctx.supabase.from("businesses").update({ job_counter: nextCounter }).eq("id", businessId);

  await ctx.supabase.from("job_status_history").insert({
    job_id: job.id,
    from_status: null,
    to_status: "received",
    changed_by: ctx.userClaims!.id,
  });

  return Response.json(job);
});
