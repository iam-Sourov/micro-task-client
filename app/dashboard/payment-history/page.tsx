"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Coins, DollarSign } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function PaymentHistoryPage() {
  const { appUser } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token || !appUser?.email) return;
    fetch(`${API_URL}/payments/${encodeURIComponent(appUser.email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setPayments(Array.isArray(data) ? data : []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, [appUser?.email]);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment History</h1>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Coins</th>
              <th className="text-left p-3">Amount ($)</th>
              <th className="text-left p-3">Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted-foreground">
                  No payments yet.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">
                    {p.date
                      ? new Date(p.date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-3">{p.coins}</td>
                  <td className="p-3">${p.amount?.toFixed(2) ?? "0.00"}</td>
                  <td className="p-3 font-mono text-xs truncate max-w-[120px]">
                    {p.transactionId || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
