import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request, { params }: { params: { token: string } }) {
  try {
    const supabase = createAdminClient();

    const { data: job } = await supabase
      .from("jobs")
      .select("*, clients(*), businesses(name, logo_url, paystack_public_key), job_status_history(*)")
      .eq("client_token", params.token)
      .single();

    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { data: invoices } = await supabase
      .from("invoices")
      .select("*, invoice_items(*)")
      .eq("job_id", job.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ ...job, invoices: invoices || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
