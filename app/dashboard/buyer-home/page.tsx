"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Users, DollarSign } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function BuyerHomePage() {
  const { appUser } = useAuth();
  const [stats, setStats] = useState({
    taskCount: 0,
    pendingWorkers: 0,
    totalPaid: 0,
  });

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token || !appUser?.email) return;
    fetch(`${API_URL}/buyer-stats/${encodeURIComponent(appUser.email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, [appUser?.email]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Total Task Count</p>
              <p className="text-xl font-semibold">{stats.taskCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-sm text-muted-foreground">Pending Workers</p>
              <p className="text-xl font-semibold">{stats.pendingWorkers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Payment Paid</p>
              <p className="text-xl font-semibold">${stats.totalPaid?.toFixed(2) ?? "0.00"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
