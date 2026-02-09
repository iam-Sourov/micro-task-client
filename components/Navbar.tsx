"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Coins,
  Menu,
  LogOut,
  User,
  LayoutDashboard,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const CLIENT_GITHUB_URL =
  process.env.NEXT_PUBLIC_CLIENT_GITHUB_URL || "https://github.com";

export default function Navbar() {
  const { user, appUser, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // theme logic
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <nav className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg text-primary"
        >
          <span className="hidden sm:inline">TaskEarn</span>
          <Coins className="h-6 w-6 text-amber-500" />
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Github */}
          <a
            href={CLIENT_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline"
          >
            Join as Developer
          </a>

          {/* 🌗 Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="relative overflow-hidden"
            >
              <Sun
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  theme === "dark"
                    ? "rotate-90 scale-0"
                    : "rotate-0 scale-100"
                )}
              />
              <Moon
                className={cn(
                  "absolute h-5 w-5 transition-all duration-300",
                  theme === "dark"
                    ? "rotate-0 scale-100"
                    : "-rotate-90 scale-0"
                )}
              />
            </Button>
          )}

          {/* Auth */}
          {loading ? (
            <span className="text-sm text-muted-foreground">Loading...</span>
          ) : user && appUser ? (
            <>
              <Link
                href="/dashboard"
                className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              <div className="hidden md:flex items-center gap-1 text-sm font-medium text-amber-600">
                <Coins className="h-4 w-4" />
                {appUser.coins ?? 0} coins
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    {appUser.photo ? (
                      <img
                        src={appUser.photo}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {appUser.name || appUser.email}
                  </div>
                  <div className="px-2 py-0.5 text-xs text-muted-foreground capitalize">
                    {appUser.role}
                  </div>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}

          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-3 space-y-2">
          <a
            href={CLIENT_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm"
          >
            Join as Developer
          </a>

          {user && appUser ? (
            <>
              <Link
                href="/dashboard"
                className="block text-sm"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <span className="block text-sm text-amber-600">
                {appUser.coins ?? 0} coins
              </span>
              <button
                className="block text-sm text-destructive"
                onClick={() => {
                  signOut();
                  setMobileOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block text-sm"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block text-sm"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
