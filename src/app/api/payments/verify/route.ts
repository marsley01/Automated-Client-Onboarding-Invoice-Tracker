import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const { reference, invoice_id } = await request.json();

    if (!reference) return NextResponse.json({ error: "Reference required" }, { status: 400 });

    const { data: invoice } = await supabase
      .from("invoices")
      .select("*, businesses(paystack_secret_key)")
      .eq("id", invoice_id)
      .single();

    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

    const secretKey = (invoice.businesses as any)?.paystack_secret_key;
    if (!secretKey) return NextResponse.json({ error: "Paystack not configured" }, { status: 400 });

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });

    const result = await response.json();
    if (!result.status || result.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const amount = result.data.amount / 100;
    const newAmountPaid = (invoice.amount_paid || 0) + amount;
    const newBalanceDue = invoice.total - newAmountPaid;
    const newStatus = newBalanceDue <= 0 ? "paid" : "partially_paid";

    const { error: payError } = await supabase.from("payments").insert({
      invoice_id,
      amount,
      method: "paystack",
      reference,
      paystack_data: result.data,
      status: "successful",
    });

    if (payError) return NextResponse.json({ error: payError.message }, { status: 500 });

    await supabase
      .from("invoices")
      .update({
        amount_paid: newAmountPaid,
        balance_due: newBalanceDue,
        status: newStatus,
        paystack_reference: reference,
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoice_id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
