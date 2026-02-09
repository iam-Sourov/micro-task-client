"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";

const slides = [
  {
    title: "Complete Tasks. Earn Rewards.",
    subtitle: "Join thousands of workers completing micro-tasks and getting paid.",
  },
  {
    title: "Get Work Done Fast",
    subtitle: "Post tasks as a buyer and get quality submissions from verified workers.",
  },
  {
    title: "Simple. Transparent. Secure.",
    subtitle: "Withdraw your earnings anytime. Your money, your control.",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-background to-primary/10 border">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="min-h-[280px] sm:min-h-[320px] md:min-h-[380px]"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="flex flex-col items-center justify-center min-h-[280px] sm:min-h-[320px] md:min-h-[380px] px-6 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground max-w-3xl"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl"
              >
                {slide.subtitle}
              </motion.p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
