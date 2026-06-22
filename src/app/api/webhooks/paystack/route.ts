import { withSupabase } from "@/lib/supabase/with-auth";

export const POST = withSupabase({ auth: "none" }, async (req, ctx) => {
  const body = await req.json();
  const event = body.event;
  const data = body.data;

  if (event === "charge.success") {
    const reference = data.reference;
    const metadata = data.metadata || {};
    const invoiceId = metadata.invoice_id;

    if (!invoiceId) return Response.json({ error: "No invoice_id" }, { status: 400 });

    const { data: invoice } = await ctx.supabaseAdmin.from("invoices").select("*").eq("id", invoiceId).single();
    if (!invoice) return Response.json({ error: "Invoice not found" }, { status: 404 });

    const amount = data.amount / 100;
    const newAmountPaid = (invoice.amount_paid || 0) + amount;
    const newBalanceDue = invoice.total - newAmountPaid;
    const newStatus = newBalanceDue <= 0 ? "paid" : "partially_paid";

    await ctx.supabaseAdmin.from("payments").insert({
      invoice_id: invoiceId,
      amount,
      method: "paystack",
      reference,
      paystack_data: data,
      status: "successful",
    });

    await ctx.supabaseAdmin
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

  return Response.json({ success: true });
});
