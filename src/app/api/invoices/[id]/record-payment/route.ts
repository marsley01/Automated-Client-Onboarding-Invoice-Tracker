import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient();
    const { amount, method, reference, paid_at } = await request.json();

    const authHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: { user } } = await supabase.auth.getUser(authHeader);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: invoice } = await supabase.from("invoices").select("*").eq("id", params.id).single();
    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

    const newAmountPaid = (invoice.amount_paid || 0) + amount;
    const newBalanceDue = invoice.total - newAmountPaid;
    const newStatus = newBalanceDue <= 0 ? "paid" : "partially_paid";

    const { error: payError } = await supabase.from("payments").insert({
      invoice_id: params.id,
      amount,
      method: method || "cash",
      reference: reference || null,
      status: "successful",
      paid_at: paid_at || new Date().toISOString(),
      recorded_by: user.id,
    });

    if (payError) return NextResponse.json({ error: payError.message }, { status: 500 });

    const { error: invError } = await supabase
      .from("invoices")
      .update({
        amount_paid: newAmountPaid,
        balance_due: newBalanceDue,
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    if (invError) return NextResponse.json({ error: invError.message }, { status: 500 });

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
