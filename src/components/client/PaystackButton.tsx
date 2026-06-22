"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        metadata: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

interface PaystackButtonProps {
  amount: number;
  email: string;
  publicKey: string | null | undefined;
  invoiceId: string;
  businessId: string;
}

export default function PaystackButton({ amount, email, publicKey, invoiceId, businessId }: PaystackButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    if (!publicKey) {
      alert("Payment not configured. Please contact the business.");
      return;
    }

    setLoading(true);

    const ref = `FLOW-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    try {
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: Math.round(amount * 100),
        currency: "KES",
        ref,
        metadata: {
          invoice_id: invoiceId,
          business_id: businessId,
        },
        callback: async (response: { reference: string }) => {
          try {
            await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: response.reference, invoice_id: invoiceId }),
            });
            window.location.reload();
          } catch (err) {
            console.error("Payment verification failed", err);
          }
        },
        onClose: () => {
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Paystack init failed", err);
      setLoading(false);
    }
  };

  return (
    <Button size="lg" onClick={handlePayment} loading={loading} className="w-full sm:w-auto">
      Pay {amount.toLocaleString()} KES with Paystack
    </Button>
  );
}
