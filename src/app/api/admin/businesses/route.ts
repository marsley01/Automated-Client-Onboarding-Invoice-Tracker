import { createSupabaseContext } from "@/lib/supabase/with-auth";

export async function POST(request: Request) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "user" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const { data: caller } = await ctx.supabase
    .from("business_users")
    .select("role")
    .eq("user_id", (await ctx.supabase.auth.getUser()).data.user?.id)
    .single();

  if (!caller || caller.role !== "owner") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { name, email, password, city } = await request.json();
  if (!name || !email || !password) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: authData, error: authError } = await ctx.supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  });
  if (authError) return Response.json({ error: authError.message }, { status: 400 });

  const { data: bizData, error: bizError } = await ctx.supabaseAdmin
    .from("businesses")
    .insert({ name, email, city: city || "Nairobi", currency: "KES" })
    .select()
    .single();

  if (bizError) {
    await ctx.supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return Response.json({ error: bizError.message }, { status: 500 });
  }

  await ctx.supabaseAdmin
    .from("business_users")
    .insert({ business_id: bizData.id, user_id: authData.user.id, role: "owner" });

  return Response.json({ success: true, business_id: bizData.id });
}

export async function DELETE(request: Request) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "user" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const { data: caller } = await ctx.supabase
    .from("business_users")
    .select("role")
    .eq("user_id", (await ctx.supabase.auth.getUser()).data.user?.id)
    .single();

  if (!caller || caller.role !== "owner") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { business_id } = await request.json();
  if (!business_id) return Response.json({ error: "Missing business_id" }, { status: 400 });

  const { data: users } = await ctx.supabaseAdmin
    .from("business_users")
    .select("user_id")
    .eq("business_id", business_id);

  const { error: bizDeleteError } = await ctx.supabaseAdmin
    .from("businesses")
    .delete()
    .eq("id", business_id);

  if (bizDeleteError) return Response.json({ error: bizDeleteError.message }, { status: 500 });

  for (const u of users || []) {
    await ctx.supabaseAdmin.auth.admin.deleteUser(u.user_id);
  }

  return Response.json({ success: true });
}
