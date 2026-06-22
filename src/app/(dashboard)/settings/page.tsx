import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsClient from "./client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: businessUser } = await supabase
    .from("business_users")
    .select("business_id, role")
    .eq("user_id", user.id)
    .single();

  if (!businessUser) redirect("/signin");

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessUser.business_id)
    .single();

  if (!business) redirect("/dashboard");

  return <SettingsClient business={business} />;
}
