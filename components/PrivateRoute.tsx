"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import type { UserRole } from "@/providers/AuthProvider";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user || !appUser) {
      router.replace("/login");
      return;
    }
    if (allowedRoles?.length && !allowedRoles.includes(appUser.role)) {
      router.replace("/dashboard");
    }
  }, [user, appUser, loading, allowedRoles, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !appUser) {
    return null;
  }

  if (allowedRoles?.length && !allowedRoles.includes(appUser.role)) {
    return null;
  }

  return <>{children}</>;
}
