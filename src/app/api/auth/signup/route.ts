import { createSupabaseContext } from "@/lib/supabase/with-auth";

export async function POST(request: Request) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "none" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const { name, email, password, business_name, phone, city } = await request.json();

  if (!name || !email || !password || !business_name) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: authData, error: authError } = await ctx.supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  });

  if (authError) return Response.json({ error: authError.message }, { status: 400 });

  const userId = authData.user.id;

  const { data: businessData, error: bizError } = await ctx.supabaseAdmin
    .from("businesses")
    .insert({
      name: business_name,
      email,
      phone: phone || null,
      city: city || "Nairobi",
      currency: "KES",
    })
    .select()
    .single();

  if (bizError) {
    await ctx.supabaseAdmin.auth.admin.deleteUser(userId);
    return Response.json({ error: bizError.message }, { status: 500 });
  }

  const { error: buError } = await ctx.supabaseAdmin
    .from("business_users")
    .insert({ business_id: businessData.id, user_id: userId, role: "owner" });

  if (buError) {
    await ctx.supabaseAdmin.from("businesses").delete().eq("id", businessData.id);
    await ctx.supabaseAdmin.auth.admin.deleteUser(userId);
    return Response.json({ error: buError.message }, { status: 500 });
  }

  const { error: signInError } = await ctx.supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) return Response.json({ error: signInError.message }, { status: 500 });

  return Response.json({ success: true, business_id: businessData.id });
}
