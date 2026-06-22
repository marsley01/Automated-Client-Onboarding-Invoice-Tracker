export async function initializePaystackPayment(params: {
  email: string;
  amount: number;
  publicKey: string;
  metadata?: Record<string, unknown>;
}): Promise<{ authorization_url: string; reference: string }> {
  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.publicKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.email,
        amount: Math.round(params.amount * 100),
        currency: "KES",
        metadata: params.metadata,
      }),
    }
  );

  const data = await response.json();
  if (!data.status) throw new Error(data.message || "Paystack init failed");
  return { authorization_url: data.data.authorization_url, reference: data.data.reference };
}

export async function verifyPaystackTransaction(
  reference: string,
  secretKey: string
): Promise<{ status: boolean; data: Record<string, unknown> }> {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  );

  const data = await response.json();
  return { status: data.status, data: data.data };
}
