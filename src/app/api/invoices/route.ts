import { withSupabase } from "@/lib/supabase/with-auth";

export const POST = withSupabase({ auth: "user" }, async (req, ctx) => {
  const { job_id, client_id, business_id, invoice_number, due_date, notes, terms, items } = await req.json();

  if (!items || items.length === 0) {
    return Response.json({ error: "At least one line item is required" }, { status: 400 });
  }

  const { data: business } = await ctx.supabase
    .from("businesses")
    .select("tax_rate, invoice_counter, invoice_prefix")
    .eq("id", business_id)
    .single();

  const taxRate = business?.tax_rate || 16;
  const nextCounter = (business?.invoice_counter || 1000) + 1;
  const finalInvoiceNumber = invoice_number || `${business?.invoice_prefix || "INV"}-${nextCounter}`;

  const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const { data: invoice, error: invError } = await ctx.supabase
    .from("invoices")
    .insert({
      job_id,
      business_id,
      client_id,
      invoice_number: finalInvoiceNumber,
      status: "draft",
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      discount_amount: 0,
      total,
      amount_paid: 0,
      balance_due: total,
      currency: "KES",
      due_date: due_date || null,
      notes: notes || null,
      terms: terms || null,
    })
    .select()
    .single();

  if (invError) return Response.json({ error: invError.message }, { status: 500 });

  const lineItems = items.map((item: any, i: number) => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    sort_order: i,
  }));

  const { error: itemsError } = await ctx.supabase.from("invoice_items").insert(lineItems);
  if (itemsError) return Response.json({ error: itemsError.message }, { status: 500 });

  await ctx.supabase.from("businesses").update({ invoice_counter: nextCounter }).eq("id", business_id);

  return Response.json(invoice);
});
