import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateJobNumber } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const { title, category, priority, description, due_date, internal_notes, client_id, client_name, client_email, client_phone, client_company } = await request.json();

    const authHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: bu } = await supabase.from("business_users").select("business_id").eq("user_id", user.id).single();
    if (!bu) return NextResponse.json({ error: "No business found" }, { status: 400 });

    const businessId = bu.business_id;

    let finalClientId = client_id || null;

    if (!finalClientId && client_name) {
      const { data: newClient } = await supabase
        .from("clients")
        .insert({ business_id: businessId, name: client_name, email: client_email || "", phone: client_phone || null, company: client_company || null })
        .select()
        .single();
      if (newClient) finalClientId = newClient.id;
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("job_counter")
      .eq("id", businessId)
      .single();

    const nextCounter = (business?.job_counter || 0) + 1;
    const jobNumber = generateJobNumber(nextCounter);

    const { data: job, error: jobError } = await supabase
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

    if (jobError) return NextResponse.json({ error: jobError.message }, { status: 500 });

    await supabase.from("businesses").update({ job_counter: nextCounter }).eq("id", businessId);

    await supabase.from("job_status_history").insert({
      job_id: job.id,
      from_status: null,
      to_status: "received",
      changed_by: user.id,
    });

    return NextResponse.json(job);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
