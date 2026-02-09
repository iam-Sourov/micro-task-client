"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="rounded-2xl bg-gradient-to-r from-amber-500/20 to-primary/20 border p-8 md:p-12 text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Start Earning?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Join TaskEarn today. Register as a Worker to complete tasks or as a Buyer to get work done.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
