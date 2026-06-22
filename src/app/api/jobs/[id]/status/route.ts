import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient();
    const { status, notes } = await request.json();

    const authHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: { user } } = await supabase.auth.getUser(authHeader);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: job } = await supabase.from("jobs").select("status").eq("id", params.id).single();
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const { error: updateError } = await supabase
      .from("jobs")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", params.id);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    const { error: historyError } = await supabase.from("job_status_history").insert({
      job_id: params.id,
      from_status: job.status,
      to_status: status,
      notes: notes || null,
      changed_by: user.id,
    });

    if (historyError) return NextResponse.json({ error: historyError.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
