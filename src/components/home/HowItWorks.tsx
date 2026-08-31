"use client";

import { FiFileText, FiSend, FiCheckCircle, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";

const steps = [
  {
    icon: FiUser,
    step: "01",
    title: "Dial & Register",
    badgeBg: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    iconGlow: "group-hover:shadow-[0_10px_30px_rgba(217,119,6,0.2)",
    iconBg:
      "bg-linear-to-br from-amber-50 to-amber-100/80 text-amber-600 border-amber-200",
    desc: "Dial *7098# on any phone to register on JustJobNG. Then go on to login on the website",
  },
  {
    icon: FiFileText,
    step: "02",
    title: "Search Job Listings",
    badgeBg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    iconGlow: "group-hover:shadow-[0_10px_30px_rgba(16,185,129,0.2)",
    iconBg:
      "bg-linear-to-br from-emerald-50 to-emerald-100/80 text-emerald-600 border-emerald-200",
    desc: "JustJobNG pulls instant job openings from across Nigeria into one place. Filter by  category and preferred work arrangement to find roles that match you.",
  },
  {
    icon: FiSend,
    step: "03",
    title: "Apply Instantly",
    badgeBg: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    iconGlow: "group-hover:shadow-[0_10px_30px_rgba(147,51,234,0.2)",
    iconBg:
      "bg-linear-to-br from-purple-50 to-purple-100/80 text-purple-600 border-purple-200",
    desc: "Submit your application to top employers in one click - fast, simple, and no paperwork.",
  },
  {
    icon: FiCheckCircle,
    step: "04",
    title: "Prep for Interview",
    badgeBg: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    iconGlow: "group-hover:shadow-[0_10px_30px_rgba(37,99,235,0.2)",
    iconBg:
      "bg-linear-to-br from-blue-50 to-blue-100/80 text-blue-600 border-blue-200",
    desc: "Once you apply, get interview-ready with the \"Prep Interview\" feature - practice real questions, sharpen your answers, and walk into the interview with confidence",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50/80 relative overflow-hidden select-none">
      {/* Background Soft Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-tr from-[#00A651]/5 to-[#8DC63F]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <SectionHeader
          subtitle=""
          title="How It Works"
          description="Get started with JustJobNG in four simple steps and accelerate your journey to landing your dream job."
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map(
            (
              { icon: Icon, step, title, badgeBg, iconGlow, iconBg, desc },
              i,
            ) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.12,
                }}
                whileHover={{ y: -6 }}
                className="group relative bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl p-7 lg:p-8 flex flex-col items-center text-center shadow-xs hover:shadow-xl transition-all duration-300 backdrop-blur-xs"
              >
                {/* Step Pill Badge */}
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full border text-[11px] font-black tracking-wider ${badgeBg} backdrop-blur-md shadow-xs`}
                >
                  {step}
                </div>

                {/* Icon Holder with Glow Effect */}
                <motion.div
                  whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
                  transition={{ duration: 0.3 }}
                  className={`w-16 h-16 rounded-2xl border ${iconBg} ${iconGlow} flex items-center justify-center mt-3 mb-6 transition-all duration-300 shadow-xs`}
                >
                  <Icon className="text-2xl" aria-hidden="true" />
                </motion.div>

                <h3 className="font-extrabold text-lg text-slate-900 mb-2.5 tracking-tight group-hover:text-[#00A651] transition-colors duration-200">
                  {title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {desc}
                </p>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
