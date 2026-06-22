import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

interface SendInvoiceEmailParams {
  to: string;
  invoiceNumber: string;
  clientName: string;
  businessName: string;
  amount: number;
  dueDate: string;
  payLink: string;
}

export async function sendInvoiceEmail(params: SendInvoiceEmailParams) {
  const resend = getResend();
  if (!resend) {
    console.warn("Resend API key not configured — email not sent");
    return { data: null, error: null };
  }

  const { to, invoiceNumber, clientName, businessName, amount, dueDate, payLink } = params;

  const html = `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #F3F4F6;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-family: 'DM Sans', sans-serif; font-size: 28px; color: #1F2937; margin: 0;">${businessName}</h1>
      </div>
      <div style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 32px;">
        <h2 style="font-family: 'DM Sans', sans-serif; font-size: 22px; color: #1F2937; margin: 0 0 8px;">Invoice ${invoiceNumber}</h2>
        <p style="color: #6B7280; margin: 0 0 24px;">Hi ${clientName},</p>
        <p style="color: #9CA3AF; margin: 0 0 24px;">You've been sent an invoice for <strong style="color: #1F2937;">KES ${amount.toLocaleString()}</strong>. Please pay by <strong style="color: #1F2937;">${dueDate}</strong>.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${payLink}" style="display: inline-block; background: #2563EB; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; box-shadow: 0 2px 8px rgba(37,99,235,0.25);">View & Pay Invoice</a>
        </div>
        <p style="color: #6B7280; font-size: 14px; text-align: center; margin: 0;">Powered by <strong style="color: #2563EB;">Mash</strong></p>
      </div>
    </div>
  `;

  return resend.emails.send({
    from: `${businessName} <invoices@mash.ke>`,
    to,
    subject: `Invoice ${invoiceNumber} from ${businessName}`,
    html,
  });
}

interface SendReminderEmailParams {
  to: string;
  invoiceNumber: string;
  clientName: string;
  businessName: string;
  amount: number;
  dueDate: string;
  payLink: string;
  daysOverdue: number;
}

export async function sendReminderEmail(params: SendReminderEmailParams) {
  const resend = getResend();
  if (!resend) {
    console.warn("Resend API key not configured — email not sent");
    return { data: null, error: null };
  }

  const { to, invoiceNumber, clientName, businessName, amount, dueDate, payLink, daysOverdue } = params;

  const html = `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #F3F4F6;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-family: 'DM Sans', sans-serif; font-size: 28px; color: #1F2937; margin: 0;">${businessName}</h1>
      </div>
      <div style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 32px;">
        <h2 style="font-family: 'DM Sans', sans-serif; font-size: 22px; color: #F59E0B; margin: 0 0 8px;">Payment Reminder</h2>
        <p style="color: #6B7280; margin: 0 0 24px;">Hi ${clientName},</p>
        <p style="color: #9CA3AF; margin: 0 0 8px;">This is a reminder that Invoice <strong style="color: #1F2937;">${invoiceNumber}</strong> for <strong style="color: #1F2937;">KES ${amount.toLocaleString()}</strong> was due on <strong style="color: #F59E0B;">${dueDate}</strong> and is now <strong style="color: #F59E0B;">${daysOverdue} days overdue</strong>.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${payLink}" style="display: inline-block; background: #2563EB; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; box-shadow: 0 2px 8px rgba(37,99,235,0.25);">Pay Now</a>
        </div>
        <p style="color: #6B7280; font-size: 14px; text-align: center; margin: 0;">Powered by <strong style="color: #2563EB;">Mash</strong></p>
      </div>
    </div>
  `;

  return resend.emails.send({
    from: `${businessName} <reminders@mash.ke>`,
    to,
    subject: `Reminder: Invoice ${invoiceNumber} is ${daysOverdue} days overdue`,
    html,
  });
}
