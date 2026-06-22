import { z } from "zod";

export const signupStep1Schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupStep2Schema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  business_type: z.enum(["repair_shop", "design_agency", "freelancer", "consulting_firm", "other"]),
  phone: z.string().optional(),
  city: z.string(),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(["repair", "design", "development", "consulting", "general"]),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  description: z.string().optional(),
  due_date: z.string().optional(),
  internal_notes: z.string().optional(),
  client_id: z.string().optional(),
  client_name: z.string().optional(),
  client_email: z.string().email().optional().or(z.literal("")),
  client_phone: z.string().optional(),
  client_company: z.string().optional(),
});

export const createInvoiceSchema = z.object({
  due_date: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.number().min(0.01, "Qty must be > 0"),
      unit_price: z.number().min(0, "Price must be >= 0"),
    })
  ).min(1, "At least one item is required"),
});

export const updateStatusSchema = z.object({
  status: z.enum(["received", "diagnosed", "in_progress", "quality_check", "ready", "delivered", "cancelled"]),
  notes: z.string().optional(),
});

export const recordPaymentSchema = z.object({
  amount: z.number().min(0.01, "Amount must be > 0"),
  method: z.enum(["mpesa", "cash", "bank_transfer"]),
  reference: z.string().optional(),
  paid_at: z.string().optional(),
});

export const clientSubmissionSchema = z.object({
  client_name: z.string().optional(),
  client_email: z.string().email().optional().or(z.literal("")),
  client_phone: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

export type SignupStep1Data = z.infer<typeof signupStep1Schema>;
export type SignupStep2Data = z.infer<typeof signupStep2Schema>;
export type SigninData = z.infer<typeof signinSchema>;
export type CreateJobData = z.infer<typeof createJobSchema>;
export type CreateInvoiceData = z.infer<typeof createInvoiceSchema>;
export type UpdateStatusData = z.infer<typeof updateStatusSchema>;
export type RecordPaymentData = z.infer<typeof recordPaymentSchema>;
export type ClientSubmissionData = z.infer<typeof clientSubmissionSchema>;
