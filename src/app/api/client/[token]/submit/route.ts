import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request, { params }: { params: { token: string } }) {
  try {
    const supabase = createAdminClient();
    const { client_name, client_email, client_phone, description } = await request.json();

    const { data: job } = await supabase
      .from("jobs")
      .select("id, business_id, client_id")
      .eq("client_token", params.token)
      .single();

    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { error: subError } = await supabase.from("client_submissions").insert({
      job_id: job.id,
      client_name: client_name || null,
      client_email: client_email || null,
      client_phone: client_phone || null,
      description: description || "",
    });

    if (subError) return NextResponse.json({ error: subError.message }, { status: 500 });

    if (client_name) {
      if (job.client_id) {
        await supabase.from("clients").update({ name: client_name, email: client_email || "", phone: client_phone || null }).eq("id", job.client_id);
      } else {
        const { data: newClient } = await supabase.from("clients").insert({
          business_id: job.business_id,
          name: client_name,
          email: client_email || "",
          phone: client_phone || null,
        }).select().single();

        if (newClient) {
          await supabase.from("jobs").update({ client_id: newClient.id }).eq("id", job.id);
        }
      }
    }

    await supabase.from("jobs").update({ client_submission_done: true }).eq("id", job.id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
