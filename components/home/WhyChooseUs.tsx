"use client";

import { motion } from "framer-motion";
import { Shield, Zap, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Your data and payments are protected. We use industry-standard security practices.",
  },
  {
    icon: Zap,
    title: "Quick Payouts",
    description: "Withdraw your earnings when you hit the minimum. No long waiting periods.",
  },
  {
    icon: HeadphonesIcon,
    title: "Support When You Need It",
    description: "Our team is here to help with any questions about tasks or payments.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12 md:py-16 bg-muted/30 rounded-2xl">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-bold text-center mb-10"
      >
        Why Choose TaskEarn
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/20 text-amber-600 mb-4">
              <f.icon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
