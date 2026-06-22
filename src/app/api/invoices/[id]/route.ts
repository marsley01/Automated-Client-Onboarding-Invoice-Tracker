import { createSupabaseContext } from "@/lib/supabase/with-auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "user" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const { data: invoice } = await ctx.supabase
    .from("invoices")
    .select("*, invoice_items(*), clients(*)")
    .eq("id", params.id)
    .single();

  if (!invoice) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(invoice);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "user" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const { items, ...updateData } = await request.json();

  if (items) {
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0);
    const { data: invoice } = await ctx.supabase.from("invoices").select("tax_rate").eq("id", params.id).single();
    const taxRate = invoice?.tax_rate || 16;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    updateData.subtotal = subtotal;
    updateData.tax_amount = taxAmount;
    updateData.total = total;
    updateData.balance_due = total - (updateData.amount_paid || 0);

    await ctx.supabase.from("invoice_items").delete().eq("invoice_id", params.id);
    const lineItems = items.map((item: any, i: number) => ({
      invoice_id: params.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      sort_order: i,
    }));
    await ctx.supabase.from("invoice_items").insert(lineItems);
  }

  updateData.updated_at = new Date().toISOString();

  const { data, error: err } = await ctx.supabase
    .from("invoices")
    .update(updateData)
    .eq("id", params.id)
    .select()
    .single();

  if (err) return Response.json({ error: err.message }, { status: 500 });
  return Response.json(data);
}
