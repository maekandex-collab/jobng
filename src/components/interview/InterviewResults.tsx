'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { UserResponse } from '@/types/interview';
import { FiAward, FiRotateCcw, FiBriefcase, FiAlertCircle, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface InterviewResultsProps {
  roleSelected: string;
  responses: UserResponse[];
  onRestart: () => void;
}

export const InterviewResults: React.FC<InterviewResultsProps> = ({ 
  roleSelected,
  responses, 
  onRestart,
}) => {
  const router = useRouter();
  const correctCount = responses.filter((r) => r.isCorrect).length;
  const totalQuestions = responses.length || 1;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = scorePercentage >= 70;

  // Apple-inspired spring physics
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 20 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.08, 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 300, damping: 24 } 
    }
  };

  const handleSearch = (searchKeyword?: string) => {
    const query = searchKeyword !== undefined ? searchKeyword : roleSelected;
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/jobs?${params.toString()}`);
  };

  // SVG Ring Progress Calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="max-w-xl mx-auto"
    >
      <div className="relative overflow-hidden rounded-[36px] bg-white/70  backdrop-blur-2xl border border-slate-200/80 p-8 sm:p-11 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all">
        
        {/* Dynamic Multi-layered Ambient Glow */}
        <div 
          aria-hidden="true"
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 blur-[110px] opacity-25 rounded-full pointer-events-none transition-all duration-700 ${
            isPassed ? 'bg-[#00A651]' : 'bg-rose-500'
          }`} 
        />

        {/* Header Section */}
        <motion.div variants={itemVariants} className="relative z-10 flex flex-col items-center text-center">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: isPassed ? 5 : -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-5 shadow-inner border backdrop-blur-md ${
              isPassed 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-[#00A651]' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
            }`}
          >
            {isPassed ? <FiAward className="w-9 h-9" /> : <FiAlertCircle className="w-9 h-9" />}
          </motion.div>

          <div className="mb-3">
            {isPassed ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/10 text-[#00863F] border border-emerald-500/20 shadow-sm">
                <FiCheckCircle className="w-3.5 h-3.5" /> Benchmark Passed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-rose-500/10 text-rose-600  border border-rose-500/20 shadow-sm">
                <FiAlertCircle className="w-3.5 h-3.5" /> Practice Recommended
              </span>
            )}
          </div>

          <h2 className="text-3xl font-extrabold !text-slate-900 tracking-tight">
            Session Complete
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Role: <span className="text-slate-800 capitalize">{roleSelected.replace(/_/g, " ")}</span>
          </p>
        </motion.div>

        {/* Score Breakdown Metrics */}
        <motion.div 
          variants={itemVariants} 
          className="relative z-10 my-8 p-6 rounded-3xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-around gap-4 shadow-sm"
        >
          {/* Circular Visual Indicator */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-200"
                strokeWidth="7"
                fill="transparent"
              />
              <motion.circle
                cx="48"
                cy="48"
                r={radius}
                className={isPassed ? 'stroke-[#00A651]' : 'stroke-rose-500'}
                strokeWidth="7"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-2xl font-black tracking-tight ${isPassed ? 'text-[#00A651]' : 'text-rose-500'}`}>
                {scorePercentage}%
              </span>
            </div>
          </div>

          <div className="h-14 w-px bg-slate-200" />

          {/* Numerical Score */}
          <div className="flex flex-col items-start justify-center">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {correctCount}
              </span>
              <span className="text-lg font-bold text-slate-400">
                /{totalQuestions}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              Correct Answers
            </p>
          </div>
        </motion.div>

        {/* Action Controls */}
        <motion.div variants={itemVariants} className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="py-3.5 px-5 rounded-2xl bg-slate-100  hover:bg-slate-200 text-slate-800 text-sm font-semibold flex items-center justify-center gap-2 border border-slate-200/50 transition-colors cursor-pointer"
          >
            <FiRotateCcw className="w-4 h-4 text-slate-500" />
            <span>Retake Interview</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSearch(roleSelected.replace(/_/g, " "))}
            className="py-3.5 px-5 rounded-2xl bg-[#00A651] hover:bg-[#00863F] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            <FiBriefcase className="w-4 h-4" />
            <span>Apply for Roles</span>
            <FiArrowRight className="w-4 h-4 opacity-75" />
          </motion.button>
        </motion.div>

      </div>
    </motion.div>
  );
};