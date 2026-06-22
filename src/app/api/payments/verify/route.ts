import { withSupabase } from "@/lib/supabase/with-auth";

export const POST = withSupabase({ auth: "none" }, async (req, ctx) => {
  const { invoice_id, amount, method, reference } = await req.json();

  if (!invoice_id || !amount) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: invoice } = await ctx.supabaseAdmin
    .from("invoices")
    .select("*")
    .eq("id", invoice_id)
    .single();

  if (!invoice) return Response.json({ error: "Invoice not found" }, { status: 404 });

  const paidAmount = Number(amount);
  const newAmountPaid = (invoice.amount_paid || 0) + paidAmount;
  const newBalanceDue = invoice.total - newAmountPaid;
  const newStatus = newBalanceDue <= 0 ? "paid" : "partially_paid";

  const { error: payError } = await ctx.supabaseAdmin.from("payments").insert({
    invoice_id,
    amount: paidAmount,
    method: method || "cash",
    reference: reference || null,
    status: "successful",
  });

  if (payError) return Response.json({ error: payError.message }, { status: 500 });

  await ctx.supabaseAdmin
    .from("invoices")
    .update({
      amount_paid: newAmountPaid,
      balance_due: newBalanceDue,
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", invoice_id);

  return Response.json({ success: true });
});
