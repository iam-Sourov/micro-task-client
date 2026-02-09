"use client";

import Link from "next/link";
import { Coins, Github, Linkedin, Facebook } from "lucide-react";

const SOCIAL_LINKS = {
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com",
  github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com",
};

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-primary"
          >
            <Coins className="h-6 w-6 text-amber-500" />
            TaskEarn
          </Link>
          <div className="flex items-center gap-4">
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Micro-Task and Earning Platform. Complete tasks and earn rewards.
        </p>
      </div>
    </footer>
  );
}
