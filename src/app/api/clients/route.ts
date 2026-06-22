import { createSupabaseContext } from "@/lib/supabase/with-auth";

export async function POST(request: Request) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "user" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const user = (await ctx.supabase.auth.getUser()).data.user;
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data: bu } = await ctx.supabase
    .from("business_users")
    .select("business_id")
    .eq("user_id", user.id)
    .single();

  if (!bu) return Response.json({ error: "No business found" }, { status: 403 });

  const { name, contact, email, phone } = await request.json();

  if (!name || !email) {
    return Response.json({ error: "Name and email are required" }, { status: 400 });
  }

  const { data: existing } = await ctx.supabaseAdmin
    .from("clients")
    .select("id")
    .eq("business_id", bu.business_id)
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return Response.json({ error: "A client with this email already exists" }, { status: 409 });
  }

  const { data: client, error: insertError } = await ctx.supabaseAdmin
    .from("clients")
    .insert({
      business_id: bu.business_id,
      name,
      email,
      phone: phone || null,
      notes: contact ? `Contact: ${contact}` : null,
    })
    .select()
    .single();

  if (insertError) return Response.json({ error: insertError.message }, { status: 500 });

  return Response.json(client);
}
