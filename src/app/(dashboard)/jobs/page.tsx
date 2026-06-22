import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import JobsClient from "./client";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: businessUser } = await supabase
    .from("business_users")
    .select("business_id")
    .eq("user_id", user.id)
    .single();

  if (!businessUser) redirect("/signin");

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, clients(name)")
    .eq("business_id", businessUser.business_id)
    .order("created_at", { ascending: false });

  return <JobsClient jobs={jobs || []} />;
}
