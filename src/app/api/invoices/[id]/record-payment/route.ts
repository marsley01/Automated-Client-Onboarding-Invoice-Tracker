import { createSupabaseContext } from "@/lib/supabase/with-auth";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "user" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const { amount, method, reference, paid_at } = await request.json();

  const { data: invoice } = await ctx.supabase.from("invoices").select("*").eq("id", params.id).single();
  if (!invoice) return Response.json({ error: "Invoice not found" }, { status: 404 });

  const newAmountPaid = (invoice.amount_paid || 0) + amount;
  const newBalanceDue = invoice.total - newAmountPaid;
  const newStatus = newBalanceDue <= 0 ? "paid" : "partially_paid";

  const { error: payError } = await ctx.supabase.from("payments").insert({
    invoice_id: params.id,
    amount,
    method: method || "cash",
    reference: reference || null,
    status: "successful",
    paid_at: paid_at || new Date().toISOString(),
    recorded_by: ctx.userClaims!.id,
  });

  if (payError) return Response.json({ error: payError.message }, { status: 500 });

  const { error: invError } = await ctx.supabase
    .from("invoices")
    .update({
      amount_paid: newAmountPaid,
      balance_due: newBalanceDue,
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id);

  if (invError) return Response.json({ error: invError.message }, { status: 500 });

  return Response.json({ success: true, status: newStatus });
}
