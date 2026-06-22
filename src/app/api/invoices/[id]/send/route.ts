import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendInvoiceEmail } from "@/lib/resend";
import { formatDate } from "@/lib/utils";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient();

    const authHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: { user } } = await supabase.auth.getUser(authHeader);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: invoice } = await supabase
      .from("invoices")
      .select("*, clients(*), jobs(*), businesses(*)")
      .eq("id", params.id)
      .single();

    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    if (!invoice.clients?.email) return NextResponse.json({ error: "Client has no email" }, { status: 400 });

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

    await supabase
      .from("invoices")
      .update({ status: "sent", updated_at: new Date().toISOString() })
      .eq("id", params.id);

    await supabase.from("reminder_logs").insert({
      invoice_id: params.id,
      type: "sent",
      sent_to: invoice.clients.email,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to send" }, { status: 500 });
  }
}
