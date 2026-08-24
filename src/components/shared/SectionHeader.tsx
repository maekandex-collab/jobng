"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionHeader({
  subtitle,
  title,
  description,
  center = true,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`mb-12 lg:mb-16 ${center ? "text-center mx-auto" : "text-left"}`}
    >
      {subtitle && (
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00A651]/10 border border-[#00A651]/20 text-[#00863F] text-xs font-extrabold uppercase tracking-widest mb-3.5 backdrop-blur-sm ${
            center ? "justify-center" : ""
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A651] animate-pulse" />
          <span>{subtitle}</span>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold !text-slate-900 tracking-tight leading-[1.15]">
        {title}
      </h2>

      {description && (
        <p
          className={`mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal ${
            center ? "max-w-xl mx-auto" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
