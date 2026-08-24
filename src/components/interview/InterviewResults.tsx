'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { UserResponse } from '@/types/interview';
import { FiAward, FiRotateCcw, FiBriefcase, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface InterviewResultsProps {
  responses: UserResponse[];
  onRestart: () => void;
  onApplyForJobs?: () => void;
}

export const InterviewResults: React.FC<InterviewResultsProps> = ({ 
  responses, 
  onRestart,
  onApplyForJobs 
}) => {
  const correctCount = responses.filter((r) => r.isCorrect).length;
  const totalQuestions = responses.length || 1;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = scorePercentage >= 70;

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { staggerChildren: 0.1, duration: 0.5, type: 'spring', bounce: 0.2 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="font-['Lato',sans-serif] max-w-2xl mx-auto space-y-6"
    >
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-[32px] p-8 sm:p-12 text-center space-y-8 shadow-[0_8px_40px_rgba(0,0,0,0.04)] relative overflow-hidden">
        
        {/* Soft background glow based on result */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-md blur-[100px] opacity-20 pointer-events-none ${isPassed ? 'bg-[#00A651]' : 'bg-rose-500'}`} />

        <motion.div variants={itemVariants} className="relative z-10">
          <div className={`w-20 h-20 mx-auto rounded-[24px] flex items-center justify-center mb-6 shadow-sm border ${isPassed ? 'bg-emerald-50 border-emerald-100 text-[#00A651]' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
             {isPassed ? <FiAward className="w-10 h-10" /> : <FiAlertCircle className="w-10 h-10" />}
          </div>
          <div className="inline-block mb-3">
            {isPassed ? (
              <span className="bg-[#00A651]/10 text-[#00863F] border border-[#00A651]/20 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4" /> Passed Benchmark
              </span>
            ) : (
              <span className="bg-rose-100 text-rose-800 border border-rose-200 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4" /> Practice Required
              </span>
            )}
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Session Complete</h2>
        </motion.div>

        <motion.div variants={itemVariants} className="relative z-10 bg-gray-50/50 border border-gray-100 p-6 rounded-3xl flex items-center justify-around">
          <div>
            <span className={`text-4xl font-black tracking-tighter ${isPassed ? 'text-[#00A651]' : 'text-rose-500'}`}>
              {scorePercentage}%
            </span>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-2">Accuracy Score</p>
          </div>
          <div className="h-16 w-px bg-gray-200" />
          <div>
            <span className="text-4xl font-black tracking-tighter text-gray-900">
              {correctCount}<span className="text-2xl text-gray-300">/{totalQuestions}</span>
            </span>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-2">Correct Answers</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <button
            type="button"
            onClick={onRestart}
            className="py-4 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <FiRotateCcw className="w-4 h-4" />
            <span>Retake Interview</span>
          </button>
          <button
            type="button"
            onClick={onApplyForJobs || (() => window.location.href = '/jobs')}
            className="py-4 px-6 rounded-2xl bg-gray-900 hover:bg-black text-white text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            <FiBriefcase className="w-4 h-4" />
            <span>Apply for Roles</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};