"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah M.",
    quote: "I earn extra income every week by completing simple tasks. Payouts are fast and reliable.",
    role: "Worker",
  },
  {
    name: "James K.",
    quote: "As a buyer, I get quality submissions without hiring full-time. Great platform for micro-jobs.",
    role: "Buyer",
  },
  {
    name: "Emma L.",
    quote: "The interface is clear and the support team is helpful. I recommend TaskEarn to everyone.",
    role: "Worker",
  },
  {
    name: "David R.",
    quote: "I post tasks regularly and workers deliver on time. Fair pricing and transparent process.",
    role: "Buyer",
  },
];

export default function Testimonials() {
  return (
    <section className="py-12 md:py-16 bg-muted/30 rounded-2xl">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-bold text-center mb-8"
      >
        What Our Users Say
      </motion.h2>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="pb-12"
      >
        {testimonials.map((t, i) => (
          <SwiperSlide key={i}>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground italic">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 font-semibold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
