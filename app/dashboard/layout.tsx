"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import PrivateRoute from "@/components/PrivateRoute";
import {
  Coins,
  User,
  Bell,
  Home,
  LayoutDashboard,
  ListTodo,
  Send,
  Wallet,
  ShoppingCart,
  History,
  PlusCircle,
  ClipboardList,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const workerNav = [
  { href: "/dashboard/worker-home", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/task-list", label: "Task List", icon: ListTodo },
  { href: "/dashboard/my-submissions", label: "My Submissions", icon: Send },
  { href: "/dashboard/withdrawals", label: "Withdrawals", icon: Wallet },
];

const buyerNav = [
  { href: "/dashboard/buyer-home", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/add-task", label: "Add new Tasks", icon: PlusCircle },
  { href: "/dashboard/my-tasks", label: "My Task's", icon: ClipboardList },
  {
    href: "/dashboard/tasks-to-review",
    label: "Task To Review",
    icon: ListTodo,
  },
  {
    href: "/dashboard/purchase-coin",
    label: "Purchase Coin",
    icon: ShoppingCart,
  },
  {
    href: "/dashboard/payment-history",
    label: "Payment History",
    icon: History,
  },
];

const adminNav = [
  { href: "/dashboard/admin-home", label: "Home", icon: LayoutDashboard },
  {
    href: "/dashboard/withdraw-requests",
    label: "Withdraw request",
    icon: Wallet,
  },
  { href: "/dashboard/manage-users", label: "Manage Users", icon: Users },
  {
    href: "/dashboard/manage-tasks",
    label: "Manage Tasks",
    icon: ClipboardList,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </PrivateRoute>
  );
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { appUser } = useAuth();
  const pathname = usePathname();

  const [notifications, setNotifications] = useState<
    { message: string; time: string; actionRoute?: string }[]
  >([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const nav =
    appUser?.role === "admin"
      ? adminNav
      : appUser?.role === "buyer"
        ? buyerNav
        : workerNav;

  useEffect(() => {
    if (!appUser?.email) return;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access-token")
        : null;

    if (!token) return;

    fetch(`${API_URL}/notifications/${encodeURIComponent(appUser.email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]));
  }, [appUser?.email]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r bg-muted/30 shrink-0">
          {/* Logo & User */}
          <div className="p-4 border-b flex flex-col sm:flex-row md:flex-col items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-primary"
            >
              <Coins className="h-6 w-6 text-amber-500" />
              <span className="hidden sm:inline">TaskEarn</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-amber-600 flex items-center gap-1">
                <Coins className="h-4 w-4" />
                {appUser?.coins ?? 0} coins
              </span>

              {appUser?.photo ? (
                <Image
                  src={appUser.photo}
                  width={32}
                  height={32}
                  alt="User profile photo"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 rounded-full bg-muted p-1" />
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="p-2 text-center md:text-left border-b md:border-b-0">
            <p className="text-xs text-muted-foreground capitalize">
              {appUser?.role}
            </p>
            <p className="text-sm font-medium truncate">
              {appUser?.name || appUser?.email}
            </p>
          </div>

          {/* Notifications */}
          <div className="p-2 relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-muted text-sm"
            >
              <Bell className="h-4 w-4" />
              Notifications
              {notifications.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute left-2 right-2 md:left-auto md:right-0 md:w-80 top-full mt-1 bg-popover border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">
                      No notifications
                    </p>
                  ) : (
                    <ul className="p-2">
                      {notifications.map((n, i) => (
                        <li
                          key={i}
                          className="p-2 border-b last:border-0 text-sm"
                        >
                          <p>{n.message}</p>
                          {n.time && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(n.time).toLocaleString()}
                            </p>
                          )}
                          {n.actionRoute && (
                            <Link
                              href={n.actionRoute}
                              className="text-primary text-xs underline"
                              onClick={() => setShowNotifications(false)}
                            >
                              View
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className="p-2 space-y-1">
            {/* Go Home */}
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                pathname === "/"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Home className="h-4 w-4 shrink-0" />
              Go Home
            </Link>

            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
