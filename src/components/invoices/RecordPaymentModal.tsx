"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { recordPaymentSchema, type RecordPaymentData } from "@/lib/validations";
import { formatDate } from "@/lib/utils";

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  balanceDue: number;
  onRecord: (data: RecordPaymentData) => Promise<void>;
}

export default function RecordPaymentModal({ isOpen, onClose, invoiceId, balanceDue, onRecord }: RecordPaymentModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RecordPaymentData>({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: {
      amount: balanceDue,
      method: "paystack",
      paid_at: new Date().toISOString().split("T")[0],
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment">
      <form onSubmit={handleSubmit(onRecord)} className="space-y-4">
        <Input
          label="Amount (KES)"
          type="number"
          step="0.01"
          error={errors.amount?.message}
          {...register("amount", { valueAsNumber: true })}
        />
        <Select
          label="Payment Method"
          error={errors.method?.message}
          options={[
            { value: "paystack", label: "Paystack" },
            { value: "mpesa", label: "M-Pesa" },
            { value: "cash", label: "Cash" },
            { value: "bank_transfer", label: "Bank Transfer" },
          ]}
          {...register("method")}
        />
        <Input
          label="Reference (optional)"
          error={errors.reference?.message}
          {...register("reference")}
        />
        <Input
          label="Payment Date"
          type="date"
          error={errors.paid_at?.message}
          {...register("paid_at")}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>
            Record Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
