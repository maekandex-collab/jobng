"use client";

import Link from "next/link";
import { FiSearch, FiArrowRight, FiPhoneCall } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaWandMagicSparkles } from "react-icons/fa6";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#021f0f] via-[#052914] to-[#004220] py-20 lg:py-28 text-white select-none">
      {/* 1. Ambient Animated Background Glows */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -right-24 w-80 h-80 sm:w-[450px] sm:h-[450px] bg-[#00A651]/25 rounded-full blur-[80px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.28, 0.15],
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -bottom-20 -left-20 w-72 h-72 sm:w-[380px] sm:h-[380px] bg-[#8DC63F]/20 rounded-full blur-[80px] pointer-events-none"
      />

      {/* 2. Grid Pattern Overlay with Gradient Fade */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* 3. Top Subtle Accent Light Streak */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-linear-to-r from-transparent via-white/30 to-transparent" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Glassmorphic Container Card */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-16 bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-14 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Subtle Glass Inner Shimmer */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#CDEBB0] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 backdrop-blur-md shadow-xs">
              <FaWandMagicSparkles className="text-[#8DC63F]" size={14} />
              <span>Start Today — It&apos;s Free</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] mb-4 tracking-tight">
              The Smarter Way to Find Your{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#8DC63F] via-[#A2E259] to-[#CDEBB0]">
                Next Job
              </span>
            </h2>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-lg font-normal">
              Join over 4 million professionals using JustJobNG. Browse live
              listings or dial{" "}
              <strong className="text-white font-bold">*7098#</strong> to get
              instant job alerts sent straight to your phone.
            </p>
          </motion.div>

          {/* Right Action Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.15,
            }}
            className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full sm:w-auto shrink-0"
          >
            {/* Primary Action Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/jobs"
                className="group flex items-center justify-center gap-3 bg-white text-[#052914] hover:text-[#004220] font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-50 transition-all duration-300 w-full sm:w-auto text-center"
              >
                <FiSearch size={18} className="text-[#00A651]" />
                <span>Browse Jobs</span>
                <FiArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>

            {/* USSD Quick Callout Badge */}
            <div className="flex items-center justify-center sm:justify-start gap-3 px-5 py-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md">
              <div className="w-7 h-7 rounded-full bg-[#8DC63F]/20 text-[#8DC63F] flex items-center justify-center shrink-0">
                <FiPhoneCall size={13} />
              </div>
              <p className="text-xs text-white/80 font-medium m-0">
                Dial{" "}
                <strong className="text-[#8DC63F] font-black">*7098#</strong> on
                any phone
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
