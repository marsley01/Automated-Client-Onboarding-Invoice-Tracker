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
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0B0B14; color: #F1F5F9;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-family: 'Fraunces', serif; font-size: 28px; color: #F1F5F9; margin: 0;">${businessName}</h1>
      </div>
      <div style="background: #111120; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 32px;">
        <h2 style="font-family: 'Fraunces', serif; font-size: 22px; color: #F1F5F9; margin: 0 0 8px;">Invoice ${invoiceNumber}</h2>
        <p style="color: #64748B; margin: 0 0 24px;">Hi ${clientName},</p>
        <p style="color: #94A3B8; margin: 0 0 24px;">You've been sent an invoice for <strong style="color: #F1F5F9;">KES ${amount.toLocaleString()}</strong>. Please pay by <strong style="color: #F1F5F9;">${dueDate}</strong>.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${payLink}" style="display: inline-block; background: #673DE0; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; box-shadow: 0 0 24px rgba(103,61,224,0.35);">View & Pay Invoice</a>
        </div>
        <p style="color: #64748B; font-size: 14px; text-align: center; margin: 0;">Powered by <strong>Dicosis</strong></p>
      </div>
    </div>
  `;

  return resend.emails.send({
    from: `${businessName} <invoices@dicosis.app>`,
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
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0B0B14; color: #F1F5F9;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-family: 'Fraunces', serif; font-size: 28px; color: #F1F5F9; margin: 0;">${businessName}</h1>
      </div>
      <div style="background: #111120; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 32px;">
        <h2 style="font-family: 'Fraunces', serif; font-size: 22px; color: #F59E0B; margin: 0 0 8px;">Payment Reminder</h2>
        <p style="color: #64748B; margin: 0 0 24px;">Hi ${clientName},</p>
        <p style="color: #94A3B8; margin: 0 0 8px;">This is a reminder that Invoice <strong style="color: #F1F5F9;">${invoiceNumber}</strong> for <strong style="color: #F1F5F9;">KES ${amount.toLocaleString()}</strong> was due on <strong style="color: #F59E0B;">${dueDate}</strong> and is now <strong style="color: #F59E0B;">${daysOverdue} days overdue</strong>.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${payLink}" style="display: inline-block; background: #673DE0; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; box-shadow: 0 0 24px rgba(103,61,224,0.35);">Pay Now</a>
        </div>
        <p style="color: #64748B; font-size: 14px; text-align: center; margin: 0;">Powered by <strong>Dicosis</strong></p>
      </div>
    </div>
  `;

  return resend.emails.send({
    from: `${businessName} <reminders@dicosis.app>`,
    to,
    subject: `Reminder: Invoice ${invoiceNumber} is ${daysOverdue} days overdue`,
    html,
  });
}
