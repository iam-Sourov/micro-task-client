"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function WithdrawRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadRequests = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token) return;
    fetch(`${API_URL}/withdrawals-pending`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approve = async (id: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token) return;
    setProcessing(id);
    try {
      const res = await fetch(`${API_URL}/withdrawals/approve/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) loadRequests();
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Withdraw Requests</h1>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Worker</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Coins</th>
              <th className="text-left p-3">Amount ($)</th>
              <th className="text-left p-3">Payment System</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-muted-foreground">
                  No pending withdrawal requests.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="p-3">{r.worker_name}</td>
                  <td className="p-3">{r.worker_email}</td>
                  <td className="p-3">{r.withdrawal_coin}</td>
                  <td className="p-3">${r.withdrawal_amount?.toFixed(2) ?? "0.00"}</td>
                  <td className="p-3">{r.payment_system || "-"}</td>
                  <td className="p-3">
                    {r.withdraw_date
                      ? new Date(r.withdraw_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      onClick={() => approve(r._id)}
                      disabled={processing === r._id}
                    >
                      {processing === r._id ? "Processing..." : "Payment Success"}
                    </Button>
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
