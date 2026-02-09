"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Clock, Coins } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function WorkerHomePage() {
  const { appUser } = useAuth();
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalEarning: 0,
  });
  const [approved, setApproved] = useState<any[]>([]);
  useEffect(() => {
    if (!appUser?.email) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token) return;
    Promise.all([
      fetch(`${API_URL}/worker-stats/${encodeURIComponent(appUser.email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch(`${API_URL}/submissions-worker-approved/${encodeURIComponent(appUser.email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ]).then(([statsData, approvedData]) => {
      setStats(statsData);
      setApproved(Array.isArray(approvedData) ? approvedData : []);
    }).catch(() => {});
  }, [appUser?.email]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Worker Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Send className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Total Submission</p>
              <p className="text-xl font-semibold">{stats.totalSubmissions}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-sm text-muted-foreground">Pending Submission</p>
              <p className="text-xl font-semibold">{stats.pendingSubmissions}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Coins className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Earning</p>
              <p className="text-xl font-semibold">{stats.totalEarning} coins</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Approved Submissions</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Task Title</th>
                <th className="text-left p-3">Payable Amount</th>
                <th className="text-left p-3">Buyer</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {approved.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    No approved submissions yet.
                  </td>
                </tr>
              ) : (
                approved.map((s) => (
                  <tr key={s._id} className="border-t">
                    <td className="p-3">{s.task_title}</td>
                    <td className="p-3">{s.payable_amount} coins</td>
                    <td className="p-3">{s.buyer_name}</td>
                    <td className="p-3">
                      <span className="text-green-600 font-medium">{s.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
