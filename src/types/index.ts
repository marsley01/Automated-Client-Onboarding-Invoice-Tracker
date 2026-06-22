export interface Business {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  logo_url: string | null;
  address: string | null;
  city: string;
  country: string;
  currency: string;
  tax_label: string;
  tax_rate: number;
  invoice_prefix: string;
  invoice_counter: number;
  job_counter: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessUser {
  id: string;
  business_id: string;
  user_id: string;
  role: "owner" | "admin" | "staff";
  created_at: string;
}

export interface Client {
  id: string;
  business_id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type JobCategory = "general" | "consulting" | "design" | "development" | "marketing" | "writing" | "financial" | "legal" | "repair" | "maintenance" | "cleaning" | "photography" | "education" | "health" | "logistics" | "event" | "other";
export type JobStatus = "received" | "diagnosed" | "in_progress" | "quality_check" | "ready" | "delivered" | "cancelled";
export type JobPriority = "low" | "normal" | "high" | "urgent";

export interface Job {
  id: string;
  business_id: string;
  client_id: string | null;
  client_token: string;
  job_number: string;
  title: string;
  description: string | null;
  category: JobCategory;
  status: JobStatus;
  priority: JobPriority;
  due_date: string | null;
  internal_notes: string | null;
  client_submission_done: boolean;
  created_at: string;
  updated_at: string;
  client?: Client;
}

export interface JobStatusHistory {
  id: string;
  job_id: string;
  from_status: string | null;
  to_status: string;
  notes: string | null;
  changed_by: string | null;
  created_at: string;
}

export interface ClientSubmission {
  id: string;
  job_id: string;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  description: string;
  submitted_at: string;
}

export interface JobAttachment {
  id: string;
  job_id: string;
  uploader: "client" | "staff";
  file_url: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
}

export type InvoiceStatus = "draft" | "sent" | "partially_paid" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  id: string;
  job_id: string;
  business_id: string;
  client_id: string | null;
  invoice_number: string;
  status: InvoiceStatus;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  amount_paid: number;
  balance_due: number;
  currency: string;
  due_date: string | null;
  notes: string | null;
  terms: string;
  last_reminder_sent_at: string | null;
  reminder_count: number;
  created_at: string;
  updated_at: string;
  items?: InvoiceItem[];
  client?: Client;
  job?: Job;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  sort_order: number;
  created_at: string;
}

export type PaymentMethod = "mpesa" | "cash" | "bank_transfer";
export type PaymentStatus = "pending" | "successful" | "failed";

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  method: PaymentMethod;
  reference: string | null;
  status: PaymentStatus;
  paid_at: string;
  recorded_by: string | null;
  created_at: string;
}

export interface ReminderLog {
  id: string;
  invoice_id: string;
  type: string;
  sent_to: string;
  sent_at: string;
}

export type BusinessType = "agency" | "freelancer" | "consultant" | "repair_shop" | "retail" | "restaurant" | "tech" | "manufacturing" | "healthcare" | "education" | "logistics" | "real_estate" | "creative" | "financial_services" | "legal" | "cleaning" | "other";

export interface SignupStep1 {
  name: string;
  email: string;
  password: string;
}

export interface SignupStep2 {
  business_name: string;
  business_type: BusinessType;
  phone: string;
  city: string;
}

export interface SignupData extends SignupStep1, SignupStep2 {}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  revenueThisMonth: number;
  outstandingBalance: number;
}

export interface DailyRevenue {
  date: string;
  total: number;
}
