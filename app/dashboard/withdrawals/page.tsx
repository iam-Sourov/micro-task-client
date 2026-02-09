"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Coins, DollarSign } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const COINS_PER_DOLLAR = 20;
const MIN_WITHDRAW_COINS = 200;

export default function WithdrawalsPage() {
  const { appUser, refreshAppUser } = useAuth();
  const [coinToWithdraw, setCoinToWithdraw] = useState("");
  const [paymentSystem, setPaymentSystem] = useState("stripe");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const coins = appUser?.coins ?? 0;
  const withdrawAmount = coinToWithdraw
    ? (Number(coinToWithdraw) / COINS_PER_DOLLAR).toFixed(2)
    : "0.00";
  const canWithdraw = coins >= MIN_WITHDRAW_COINS;
  const isValidAmount =
    coinToWithdraw !== "" &&
    Number(coinToWithdraw) > 0 &&
    Number(coinToWithdraw) <= coins;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValidAmount) {
      setError("Enter a valid coin amount within your balance.");
      return;
    }
    if (Number(coinToWithdraw) < MIN_WITHDRAW_COINS) {
      setError(`Minimum withdrawal is ${MIN_WITHDRAW_COINS} coins ($10).`);
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token || !appUser) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/withdrawals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          worker_email: appUser.email,
          worker_name: appUser.name || appUser.email,
          withdrawal_coin: Number(coinToWithdraw),
          withdrawal_amount: Number(withdrawAmount),
          payment_system: paymentSystem,
          account_number: accountNumber,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Withdrawal failed");
      }
      await refreshAppUser();
      setCoinToWithdraw("");
      setAccountNumber("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold">Withdrawals</h1>
      <p className="text-sm text-muted-foreground">
        20 coins = 1 dollar. Minimum withdrawal: 200 coins ($10).
      </p>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              <span className="font-semibold">Current coins: {coins}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-semibold">
                Withdrawal amount: ${(coins / COINS_PER_DOLLAR).toFixed(2)}
              </span>
            </div>
          </div>
          {!canWithdraw ? (
            <p className="text-destructive font-medium">Insufficient coin.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div>
                <Label>Coin To Withdraw</Label>
                <Input
                  type="number"
                  min={MIN_WITHDRAW_COINS}
                  max={coins}
                  value={coinToWithdraw}
                  onChange={(e) => setCoinToWithdraw(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Withdraw amount ($)</Label>
                <Input
                  type="text"
                  value={withdrawAmount}
                  readOnly
                  className="mt-1 bg-muted"
                />
              </div>
              <div>
                <Label>Select Payment System</Label>
                <Select value={paymentSystem} onValueChange={setPaymentSystem}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="bkash">Bkash</SelectItem>
                    <SelectItem value="rocket">Rocket</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Account Number</Label>
                <Input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Your account / wallet number"
                  className="mt-1"
                />
              </div>
              <Button type="submit" disabled={loading || !isValidAmount}>
                {loading ? "Submitting..." : "Withdraw"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
