"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Coins, DollarSign } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function AdminHomePage() {
  const { appUser } = useAuth();
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalAvailableCoins: 0,
    totalPayments: 0,
  });

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token) return;
    fetch(`${API_URL}/admin-stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Total Workers</p>
              <p className="text-xl font-semibold">{stats.totalWorkers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <UserCheck className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Total Buyers</p>
              <p className="text-xl font-semibold">{stats.totalBuyers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Coins className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Available Coins</p>
              <p className="text-xl font-semibold">{stats.totalAvailableCoins}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Payments</p>
              <p className="text-xl font-semibold">{stats.totalPayments}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
