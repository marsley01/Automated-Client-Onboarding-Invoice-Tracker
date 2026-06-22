import { createSupabaseContext } from "@/lib/supabase/with-auth";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "user" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const body = await request.json();

  if (Array.isArray(body)) {
    const items = body.map((item: any, i: number) => ({
      invoice_id: params.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      sort_order: item.sort_order ?? i,
    }));
    const { data, error: err } = await ctx.supabase.from("invoice_items").insert(items).select();
    if (err) return Response.json({ error: err.message }, { status: 500 });
    return Response.json(data);
  }

  const { data, error: err } = await ctx.supabase
    .from("invoice_items")
    .insert({ invoice_id: params.id, ...body })
    .select()
    .single();

  if (err) return Response.json({ error: err.message }, { status: 500 });
  return Response.json(data);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "user" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const body = await request.json();

  const { data, error: err } = await ctx.supabase
    .from("invoice_items")
    .update(body)
    .eq("id", body.id)
    .select()
    .single();

  if (err) return Response.json({ error: err.message }, { status: 500 });
  return Response.json(data);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "user" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("id");

  if (!itemId) return Response.json({ error: "Item ID required" }, { status: 400 });

  const { error: err } = await ctx.supabase.from("invoice_items").delete().eq("id", itemId);
  if (err) return Response.json({ error: err.message }, { status: 500 });
  return Response.json({ success: true });
}
