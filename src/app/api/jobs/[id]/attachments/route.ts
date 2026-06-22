import { createSupabaseContext } from "@/lib/supabase/with-auth";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "user" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) return Response.json({ error: "No file provided" }, { status: 400 });

  const fileExt = file.name.split(".").pop();
  const fileName = `${params.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await ctx.supabase.storage
    .from("job-attachments")
    .upload(fileName, file);

  if (uploadError) return Response.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = ctx.supabase.storage
    .from("job-attachments")
    .getPublicUrl(fileName);

  const { error: dbError } = await ctx.supabase.from("job_attachments").insert({
    job_id: params.id,
    uploader: "staff",
    file_url: publicUrl,
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
  });

  if (dbError) return Response.json({ error: dbError.message }, { status: 500 });

  return Response.json({ success: true, url: publicUrl });
}
