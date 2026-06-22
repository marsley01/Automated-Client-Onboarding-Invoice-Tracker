import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminClient();

  const authHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(authHeader);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, invoice_items(*), clients(*)")
    .eq("id", params.id)
    .single();

  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient();
    const { items, ...updateData } = await request.json();

    const authHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: { user } } = await supabase.auth.getUser(authHeader);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (items) {
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0);
      const { data: invoice } = await supabase.from("invoices").select("tax_rate").eq("id", params.id).single();
      const taxRate = invoice?.tax_rate || 16;
      const taxAmount = subtotal * (taxRate / 100);
      const total = subtotal + taxAmount;

      updateData.subtotal = subtotal;
      updateData.tax_amount = taxAmount;
      updateData.total = total;
      updateData.balance_due = total - (updateData.amount_paid || 0);

      await supabase.from("invoice_items").delete().eq("invoice_id", params.id);
      const lineItems = items.map((item: any, i: number) => ({
        invoice_id: params.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        sort_order: i,
      }));
      await supabase.from("invoice_items").insert(lineItems);
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("invoices")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
