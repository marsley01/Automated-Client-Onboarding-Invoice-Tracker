import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendReminderEmail } from "@/lib/resend";
import { formatDate } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (authHeader !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: overdueInvoices } = await supabase
      .from("invoices")
      .select("*, clients(*), jobs(*), businesses(*)")
      .in("status", ["sent", "partially_paid"])
      .not("due_date", "is", null)
      .lt("due_date", new Date().toISOString().split("T")[0]);

    if (!overdueInvoices || overdueInvoices.length === 0) {
      return NextResponse.json({ success: true, sent: 0 });
    }

    let sentCount = 0;

    for (const invoice of overdueInvoices) {
      if (!invoice.clients?.email) continue;
      if (invoice.reminder_count >= 3) continue;

      const lastReminder = invoice.last_reminder_sent_at ? new Date(invoice.last_reminder_sent_at) : null;
      if (lastReminder && (Date.now() - lastReminder.getTime()) < 3 * 86400000) continue;

      const daysOverdue = Math.floor((Date.now() - new Date(invoice.due_date).getTime()) / 86400000);
      const payLink = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/c/${invoice.jobs?.client_token}/pay`;

      try {
        await sendReminderEmail({
          to: invoice.clients.email,
          invoiceNumber: invoice.invoice_number,
          clientName: invoice.clients.name,
          businessName: invoice.businesses?.name || "Dicosis",
          amount: invoice.balance_due,
          dueDate: formatDate(invoice.due_date),
          payLink,
          daysOverdue,
        });

        await supabase.from("reminder_logs").insert({
          invoice_id: invoice.id,
          type: "overdue_reminder",
          sent_to: invoice.clients.email,
        });

        await supabase
          .from("invoices")
          .update({
            last_reminder_sent_at: new Date().toISOString(),
            reminder_count: (invoice.reminder_count || 0) + 1,
            status: "overdue",
          })
          .eq("id", invoice.id);

        sentCount++;
      } catch (err) {
        console.error(`Failed to send reminder for invoice ${invoice.invoice_number}:`, err);
      }
    }

    return NextResponse.json({ success: true, sent: sentCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
