import { createSupabaseContext } from "@/lib/supabase/with-auth";
import { sendInvoiceEmail } from "@/lib/resend";
import { formatDate } from "@/lib/utils";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { data: ctx, error } = await createSupabaseContext(request, { auth: "user" });
  if (error) return Response.json({ message: error.message }, { status: error.status });

  const { data: invoice } = await ctx.supabase
    .from("invoices")
    .select("*, clients(*), jobs(*), businesses(*)")
    .eq("id", params.id)
    .single();

  if (!invoice) return Response.json({ error: "Invoice not found" }, { status: 404 });
  if (!invoice.clients?.email) return Response.json({ error: "Client has no email" }, { status: 400 });

  const payLink = `${request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL}/c/${invoice.jobs?.client_token}/pay`;

  await sendInvoiceEmail({
    to: invoice.clients.email,
    invoiceNumber: invoice.invoice_number,
    clientName: invoice.clients.name,
    businessName: invoice.businesses?.name || "Dicosis",
    amount: invoice.total,
    dueDate: formatDate(invoice.due_date),
    payLink,
  });

  await ctx.supabase
    .from("invoices")
    .update({ status: "sent", updated_at: new Date().toISOString() })
    .eq("id", params.id);

  await ctx.supabase.from("reminder_logs").insert({
    invoice_id: params.id,
    type: "sent",
    sent_to: invoice.clients.email,
  });

  return Response.json({ success: true });
}
