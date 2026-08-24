'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InterviewConfig, JobRole } from '@/types/interview';
import { FiBriefcase, FiHelpCircle, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

interface InterviewSetupProps {
  onStartSession: (config: InterviewConfig) => void;
}

const JOB_ROLES: JobRole[] = [
  'frontend', 'backend', 'AI', 'data', 'digital_market', 
  'sales', 'finance', 'leadership', 'entry', 'product',
];

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStartSession }) => {
  const [selectedRole, setSelectedRole] = useState<JobRole>(JOB_ROLES[0]);
  const [questionCount, setQuestionCount] = useState<number>(10);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onStartSession({ jobRole: selectedRole, questionCount });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="font-['Lato',sans-serif] max-w-6xl mx-auto pb-24 sm:pb-6"
    >
      <div className="bg-white border border-[#0F172A]/10 rounded-3xl p-5 sm:p-8 shadow-[0_8px_30px_rgba(10,15,28,0.06)] space-y-6">
        <div className="text-center space-y-2 relative pb-2 border-b border-[#0F172A]/10">
          <div className="inline-block px-3 py-1 bg-[#00A651]/10 border border-[#00A651]/20 rounded-full text-[11px] font-bold text-[#00863F] uppercase tracking-wider mb-1">
            Powered by Maekandex Academy
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A0F1C] tracking-tight">
            Configure Your <span className="text-[#00A651]">Mock Interview</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-xl mx-auto">
            Select target job role and question count. Timer is standard 60 seconds per question.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold text-[#00A651] uppercase tracking-wider">
                <FiBriefcase className="w-4 h-4" /> 1. Select Target Job Role
              </label>
              <span className="text-[11px] text-[#64748B] font-medium">10 Tracks Available</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {JOB_ROLES.map((role) => {
                const isSelected = selectedRole === role;
                return (
                  <button
                    type="button"
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between relative ${
                      isSelected
                        ? 'bg-[#00A651]/10 border-[#00A651] text-[#0A0F1C] shadow-[0_4px_16px_rgba(0,166,81,0.15)] ring-2 ring-[#00A651]'
                        : 'bg-[#F8F9FA] border-[#0F172A]/10 text-[#64748B] hover:border-[#00A651]/40'
                    }`}
                  >
                    {isSelected && (
                      <motion.div layoutId="check-icon" className="absolute top-3 right-3">
                        <FiCheckCircle className="w-4 h-4 text-[#00A651]" />
                      </motion.div>
                    )}
                    <div className="font-bold text-lg text-[#0A0F1C] pr-4 uppercase">{role}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-[#0F172A]/10 space-y-2">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-xs font-bold text-[#00A651] uppercase tracking-wider">
                <FiHelpCircle className="w-4 h-4" /> 2. Number of Questions
              </label>
              <span className="text-xs font-bold text-[#00863F] bg-[#00A651]/15 px-3 py-0.5 rounded-full border border-[#00A651]/20">
                {questionCount} Questions (60s / q)
              </span>
            </div>
            <input
              type="range"
              min={5} max={25} step={5}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full accent-[#00A651] bg-white h-2 rounded-lg cursor-pointer border border-[#0F172A]/10"
            />
            <div className="flex justify-between text-[11px] text-[#64748B] font-medium">
              <span>Min: 5</span>
              <span>Max: 25</span>
            </div>
          </div>

          <button
            type="submit"
            className="hidden sm:flex w-full py-4 rounded-2xl bg-[#00A651] hover:bg-[#00863F] text-white font-bold text-sm items-center justify-center gap-2 shadow-[0_8px_25px_rgba(0,166,81,0.25)] transition-all active:scale-[0.99]"
          >
            <span>Start Practice Interview</span>
            <FiArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#0F172A]/10 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="text-left">
            <span className="text-xs font-bold text-[#0A0F1C] block capitalize">{selectedRole}</span>
          </div>
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="px-6 py-3 rounded-xl bg-[#00A651] active:bg-[#00863F] text-white font-bold text-xs flex items-center gap-2 shadow-md"
          >
            <span>Start Now</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};