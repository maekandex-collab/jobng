/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { motion, type Variants } from "framer-motion";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { authHeaders } from "@/lib/auth-client";

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1] as const,
      delay,
    },
  },
});

const popularTags = ["Engineering", "Finance", "Marketing", "Healthcare", "Remote"];

export default function HeroSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check auth client-side after hydration to avoid SSR mismatch
    const headers = authHeaders();
    setIsLoggedIn(Boolean(headers && Object.keys(headers).length > 0));
  }, []);

  const handleSearch = (e?: React.FormEvent, searchKeyword?: string) => {
    if (e) e.preventDefault();
    const query = searchKeyword !== undefined ? searchKeyword : keyword;
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/jobs?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    setKeyword(tag);
    handleSearch(undefined, tag);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 pt-32 pb-20 bg-linear-to-br from-[#8DC63F] via-[#00A651] to-[#00863F]">
      {/* Background Glow Layer / Grid Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,#CDEBB0_0%,transparent_60%)" />
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(10,15,28,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(10,15,28,0.05)_1px,transparent_1px) bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black_20%,transparent_100%) pointer-events-none" 
        aria-hidden 
      />
      
      {/* Ambient Animated Orbs */}
      <motion.div
        className="absolute top-[10%] right-[5%] w-[420px] h-[420px] rounded-full bg-[#CDEBB0]/40 blur-[80px] pointer-events-none"
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] left-0 w-[360px] h-[360px] rounded-full bg-white/20 blur-[80px] pointer-events-none"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Hero Content Wrapper */}
      <div className="relative z-10 w-full max-w-[760px] mx-auto text-center">
        
        {/* Prep Interview Callout Pill */}
        {isLoggedIn && (
          <motion.div 
            variants={fadeUp(0.05)} 
            initial="hidden" 
            animate="show" 
            className="mb-5 inline-block"
          >
            <Link
              href="/prep-interview/practice"
              className="group inline-flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 text-xs sm:text-sm font-semibold text-white border border-white/30 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center justify-center p-1 rounded-full bg-[#0A0F1C]/20 text-[#0A0F1C]">
                <FaWandMagicSparkles className="text-yellow-300 w-3.5 h-3.5" />
              </span>
              <span>Ace Your Next Interview with <strong className="underline underline-offset-2 decoration-[#0A0F1C]">Prep Interview</strong></span>
              <FiArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}

        {/* Header Banner */}
        <motion.h1 variants={fadeUp(0.1)} initial="hidden" animate="show" className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight !text-[#0A0F1C] leading-[1.1] mb-5">
          Your next Job<br />
          <span className="text-white drop-shadow-[0_2px_20px_rgba(120,53,15,0.25)">starts here.</span>
        </motion.h1>

        <motion.p variants={fadeUp(0.2)} initial="hidden" animate="show" className="text-[17px] leading-relaxed text-white max-w-[480px] mx-auto mb-10">
          Discover opportunities across Nigeria. Subscribe via <strong className="text-[#055A2B] font-extrabold">*7098#</strong> then browse and apply in seconds.
        </motion.p>

        {/* Search Input Form */}
        <motion.form 
          variants={fadeUp(0.3)} initial="hidden" animate="show" 
          onSubmit={handleSearch} 
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-[580px] mx-auto p-2 sm:pl-4 bg-white rounded-2xl shadow-[0_24px_70px_rgba(120,53,15,0.28) mb-6"
        >
          <div className="flex items-center gap-2.5 flex-1 py-2 sm:py-0 px-2 sm:px-0">
            <FiSearch size={18} className="text-emerald-600 shrink-0" />
            <input
              type="text"
              placeholder="Search job title or company..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              aria-label="Search job title or company"
              className="w-full bg-transparent border-none outline-none text-sm text-slate-900 placeholder-slate-400 min-w-0 font-medium"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            type="submit" 
            className="flex items-center justify-center gap-2 font-bold text-sm bg-linear-to-br from-[#00A651] to-[#00863F] hover:from-[#00863F] hover:to-[#055A2B] text-white rounded-xl py-3 px-6 whitespace-nowrap shadow-md transition-all"
          >
            Find Jobs <FiArrowRight size={16} />
          </motion.button>
        </motion.form>

        {/* Popular Tags */}
        <motion.div variants={fadeUp(0.42)} initial="hidden" animate="show" className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <span className="text-xs font-semibold text-[#0A0F1C]/60">Popular:</span>
          {popularTags.map((tag) => (
            <button 
              key={tag} 
              type="button" 
              onClick={() => handleTagClick(tag)} 
              className="bg-white/60 border border-[#0A0F1C]/10 text-[#0A0F1C]/80 rounded-full px-3.5 py-1 text-xs font-semibold transition-all duration-200 hover:bg-[#0A0F1C] hover:border-[#0A0F1C] hover:text-[#8DC63F]"
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Metrics/Stats Cluster */}
        <motion.div variants={fadeUp(0.52)} initial="hidden" animate="show" className="flex flex-wrap justify-center gap-10 border-t border-[#0A0F1C]/15 pt-8">
          {[
            { value: "300+", label: "Live listings" },
            { value: "*7098#", label: "Subscribe via USSD" },
            { value: "24/7", label: "Always available" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-xl font-extrabold text-white">{s.value}</span>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-white/90">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Wave Section Separator */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden>
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="block w-full h-20">
          <path d="M0 80H1440V30C1200 80 900 10 720 10C540 10 240 80 0 30V80Z" className="fill-slate-50" />
        </svg>
      </div>
    </section>
  );
}