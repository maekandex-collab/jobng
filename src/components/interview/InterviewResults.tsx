'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { UserResponse } from '@/types/interview';
import { 
  FiAward, 
  FiRotateCcw, 
  FiBriefcase, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiArrowRight, 
  FiChevronDown, 
  FiXCircle,
  FiZap,
  FiTarget
} from 'react-icons/fi';
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const correctCount = responses.filter((r) => r.isCorrect).length;
  const incorrectCount = responses.length - correctCount;
  const totalQuestions = responses.length || 1;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = scorePercentage >= 70;

  const formattedRole = roleSelected.replace(/_/g, ' ');

  // Dynamic Performance Analysis based on Score & Selected Role
  const getPerformanceDiagnostics = () => {
    if (scorePercentage >= 85) {
      return {
        level: 'Exceptional Mastery',
        badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        summary: `You demonstrated comprehensive technical depth in ${formattedRole}. Your understanding of architecture patterns, edge cases, and best practices meets senior-level standards.`,
        actionAdvice: `You are in a prime position to apply for high-level ${formattedRole} job openings immediately.`,
      };
    } else if (scorePercentage >= 70) {
      return {
        level: 'Solid Proficiency',
        badgeColor: 'bg-teal-500/10 text-teal-700 border-teal-500/20',
        summary: `You showed reliable core technical knowledge for a ${formattedRole} position. While your fundamentals are strong, polishing complex edge-case concepts will make your answers stand out.`,
        actionAdvice: `Review the flagged questions below to close your minor knowledge gaps before interviewing.`,
      };
    } else if (scorePercentage >= 50) {
      return {
        level: 'Developing Competency',
        badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        summary: `Your test highlighted partial familiarity with ${formattedRole} principles, but revealed inconsistencies in execution and conceptual clarity.`,
        actionAdvice: `Focus on revising core documentation and standard interview patterns for ${formattedRole} before re-evaluating.`,
      };
    } else {
      return {
        level: 'Needs Targeted Focus',
        badgeColor: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
        summary: `The assessment identified major conceptual gaps in key ${formattedRole} domains required for job readiness.`,
        actionAdvice: `Dedicated practice on basic domain concepts is recommended prior to scheduling live interviews.`,
      };
    }
  };

  const diagnostics = getPerformanceDiagnostics();

  // Motion Animations
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.97, y: 20 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.07, 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 320, damping: 24 } 
    }
  };

  const handleSearch = (searchKeyword?: string) => {
    const query = searchKeyword !== undefined ? searchKeyword : formattedRole;
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
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
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="relative overflow-hidden rounded-[36px] bg-white/80 backdrop-blur-2xl border border-slate-200/80 p-6 sm:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
        
        {/* Ambient Radial Glow */}
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
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border shadow-sm ${diagnostics.badgeColor}`}>
              {isPassed ? <FiCheckCircle className="w-3.5 h-3.5" /> : <FiAlertCircle className="w-3.5 h-3.5" />} 
              {diagnostics.level}
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
  {scorePercentage >= 70 
    ? "Excellent 👍" 
    : scorePercentage >= 50 
      ? "Not Good Enough 😪" 
      : "Failed ❌"}
</h2>
          <p className="text-sm font-medium text-slate-500 mt-1 capitalize">
            Target Role: <span className="text-slate-800 font-semibold">{formattedRole}</span>
          </p>
        </motion.div>

        {/* Score Visual & Breakdown Metrics */}
        <motion.div 
          variants={itemVariants} 
          className="relative z-10 my-6 p-6 rounded-3xl bg-slate-50/90 border border-slate-200/70 flex items-center justify-around gap-4 shadow-sm"
        >
          {/* Circular Progress Gauge */}
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
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
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

          {/* Correct / Incorrect Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                {correctCount}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Correct
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-rose-500 tracking-tight">
                {incorrectCount}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Incorrect
              </span>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Role Performance Summary Box */}
        <motion.div 
          variants={itemVariants}
          className="relative z-10 p-5 mb-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <FiZap className="w-4 h-4 text-[#00A651]" />
            <span>Role Performance Insights</span>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed">
            {diagnostics.summary}
          </p>
          {/* <div className="flex items-start gap-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
            <FiTarget className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong className="font-semibold text-slate-900">Next Steps:</strong> {diagnostics.actionAdvice}</span>
          </div> */}
        </motion.div>

        {/* Question-by-Question Detailed Breakdown */}
        {/* <motion.div variants={itemVariants} className="relative z-10 space-y-3 mb-8">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase text-slate-400 mb-2">
            Detailed Question Breakdown
          </h3>
          {responses.map((resp, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 pr-2">
                    {resp.isCorrect ? (
                      <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <FiXCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                    <span className="text-sm font-semibold text-slate-800 line-clamp-1">
                      {idx + 1}. {resp.question}
                    </span>
                  </div>
                  <FiChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-100 p-4 bg-slate-50/50 space-y-2 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-500 block">Question:</span>
                        <p className="text-slate-800 font-medium">{resp.question}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500 block">Your Answer:</span>
                        <p className={`font-semibold ${resp.isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {resp.userAnswer || 'No answer provided'}
                        </p>
                      </div>
                      {resp.explanation && (
                        <div className="pt-2 border-t border-slate-200/60">
                          <span className="font-bold text-slate-700 block">Explanation & Feedback:</span>
                          <p className="text-slate-600 leading-relaxed mt-0.5">{resp.explanation}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div> */}

        {/* Action Controls */}
        <motion.div variants={itemVariants} className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold flex items-center justify-center gap-2 border border-slate-200/60 transition-colors cursor-pointer"
          >
            <FiRotateCcw className="w-4 h-4 text-slate-500" />
            <span>Retake Assessment</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSearch(formattedRole)}
            className="py-3.5 px-5 rounded-2xl bg-[#00A651] hover:bg-[#00863F] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            <FiBriefcase className="w-4 h-4" />
            <span>Explore Jobs</span>
            <FiArrowRight className="w-4 h-4 opacity-75" />
          </motion.button>
        </motion.div>

      </div>
    </motion.div>
  );
};