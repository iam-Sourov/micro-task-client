"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coins, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Worker {
  _id: string;
  email: string;
  name?: string;
  photo?: string;
  coins?: number;
}

export default function BestWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/users-top-workers`)
      .then((res) => res.json())
      .then((data) => {
        setWorkers(Array.isArray(data) ? data : []);
      })
      .catch(() => setWorkers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Top Workers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (workers.length === 0) {
    return (
      <section className="py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Top Workers
        </h2>
        <p className="text-center text-muted-foreground">
          No workers yet. Be the first to join and earn!
        </p>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-bold text-center mb-8"
      >
        Top Workers
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {workers.map((w, i) => (
          <motion.div
            key={w._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center mb-2">
                  {w.photo ? (
                    <img
                      src={w.photo}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <p className="font-medium text-sm truncate w-full">
                  {w.name || w.email}
                </p>
                <p className="text-amber-600 text-sm flex items-center gap-1">
                  <Coins className="h-4 w-4" />
                  {w.coins ?? 0} coins
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
