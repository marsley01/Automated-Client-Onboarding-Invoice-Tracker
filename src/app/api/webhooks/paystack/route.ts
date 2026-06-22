import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    const event = body.event;
    const data = body.data;

    if (event === "charge.success") {
      const reference = data.reference;
      const metadata = data.metadata || {};

      const invoiceId = metadata.invoice_id;
      if (!invoiceId) return NextResponse.json({ error: "No invoice_id" }, { status: 400 });

      const { data: invoice } = await supabase.from("invoices").select("*").eq("id", invoiceId).single();
      if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

      const amount = data.amount / 100;
      const newAmountPaid = (invoice.amount_paid || 0) + amount;
      const newBalanceDue = invoice.total - newAmountPaid;
      const newStatus = newBalanceDue <= 0 ? "paid" : "partially_paid";

      await supabase.from("payments").insert({
        invoice_id: invoiceId,
        amount,
        method: "paystack",
        reference,
        paystack_data: data,
        status: "successful",
      });

      await supabase
        .from("invoices")
        .update({
          amount_paid: newAmountPaid,
          balance_due: newBalanceDue,
          status: newStatus,
          paystack_reference: reference,
          updated_at: new Date().toISOString(),
        })
        .eq("id", invoiceId);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Paystack webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
