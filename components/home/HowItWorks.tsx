"use client";

import { motion } from "framer-motion";
import { UserPlus, ListChecks, Coins } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Register as a Worker or Buyer. Workers get 10 coins and Buyers get 50 coins to start.",
  },
  {
    icon: ListChecks,
    title: "Complete or Post Tasks",
    description: "Workers browse tasks and submit work. Buyers create tasks and review submissions.",
  },
  {
    icon: Coins,
    title: "Earn & Withdraw",
    description: "Get paid in coins. Withdraw when you reach 200 coins (10 dollars). Simple and fast.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 md:py-16">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-bold text-center mb-10"
      >
        How It Works
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
              <step.icon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
