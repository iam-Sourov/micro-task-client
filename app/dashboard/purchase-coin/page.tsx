"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

const PACKS = [
  { coins: 10, price: 1, label: "10 coins = $1" },
  { coins: 150, price: 10, label: "150 coins = $10" },
  { coins: 500, price: 20, label: "500 coins = $20" },
  { coins: 1000, price: 35, label: "1000 coins = $35" },
];

export default function PurchaseCoinPage() {
  const { appUser, refreshAppUser } = useAuth();
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handlePurchase = async (pack: typeof PACKS[0]) => {
    setError("");
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token || !appUser?.email) return;
    setProcessing(pack.label);
    try {
      const res = await fetch(`${API_URL}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: pack.price,
          coins: pack.coins,
          buyer_email: appUser.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment failed");

      if (data.dummy) {
        await fetch(`${API_URL}/payments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            buyer_email: appUser.email,
            coins: pack.coins,
            amount: pack.price,
            transactionId: "dummy_" + Date.now(),
          }),
        });
        await refreshAppUser();
        setProcessing(null);
        return;
      }

      if (!data.clientSecret || !STRIPE_PK) {
        await fetch(`${API_URL}/payments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            buyer_email: appUser.email,
            coins: pack.coins,
            amount: pack.price,
            transactionId: data.paymentIntentId || "dummy_" + Date.now(),
          }),
        });
        await refreshAppUser();
        setProcessing(null);
        return;
      }

      const stripe = await loadStripe(STRIPE_PK);
      if (!stripe) throw new Error("Stripe failed to load");
      const { error: stripeError } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: {} as any },
      });
      if (stripeError) throw new Error(stripeError.message);

      await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          buyer_email: appUser.email,
          coins: pack.coins,
          amount: pack.price,
          transactionId: data.paymentIntentId,
        }),
      });
      await refreshAppUser();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Purchase Coin</h1>
      <p className="text-muted-foreground">
        Buy coins to create tasks. Your balance: {appUser?.coins ?? 0} coins.
      </p>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PACKS.map((pack) => (
          <Card key={pack.label}>
            <CardContent className="p-6 text-center">
              <Coins className="h-10 w-10 text-amber-500 mx-auto mb-2" />
              <p className="font-semibold text-lg">{pack.coins} coins</p>
              <p className="text-muted-foreground">= ${pack.price}</p>
              <Button
                className="w-full mt-4"
                onClick={() => handlePurchase(pack)}
                disabled={!!processing}
              >
                {processing === pack.label ? "Processing..." : `Pay $${pack.price}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {!STRIPE_PK && (
        <p className="text-sm text-muted-foreground">
          Stripe is not configured. Using dummy payment for demo.
        </p>
      )}
    </div>
  );
}
