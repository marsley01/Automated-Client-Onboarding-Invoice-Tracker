import { createSupabaseContext } from "@/lib/supabase/with-auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "user" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const { data: job } = await ctx.supabase
    .from("jobs")
    .select("*, clients(*)")
    .eq("id", params.id)
    .single();

  if (!job) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(job);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "user" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const body = await request.json();
  const { data, err } = await ctx.supabase
    .from("jobs")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .select()
    .single();

  if (err) return Response.json({ error: err.message }, { status: 500 });
  return Response.json(data);
}
