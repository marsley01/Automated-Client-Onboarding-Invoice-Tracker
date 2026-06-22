import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { name, email, password, business_name, business_type, phone, city } = await request.json();

    if (!name || !email || !password || !business_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    const { data: businessData, error: bizError } = await supabase
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
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: bizError.message }, { status: 500 });
    }

    const { error: buError } = await supabase
      .from("business_users")
      .insert({ business_id: businessData.id, user_id: userId, role: "owner" });

    if (buError) {
      await supabase.from("businesses").delete().eq("id", businessData.id);
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: buError.message }, { status: 500 });
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return NextResponse.json({ error: signInError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, business_id: businessData.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
