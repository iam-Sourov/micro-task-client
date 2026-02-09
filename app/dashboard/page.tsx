"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function DashboardPage() {
  const { appUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (appUser?.role === "admin") router.replace("/dashboard/admin-home");
    else if (appUser?.role === "buyer") router.replace("/dashboard/buyer-home");
    else router.replace("/dashboard/worker-home");
  }, [appUser?.role, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
