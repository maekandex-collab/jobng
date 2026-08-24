'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { InterviewConfig, JobRole } from '@/types/interview';
import { FiBriefcase, FiHelpCircle, FiArrowRight, FiCheck } from 'react-icons/fi';

interface InterviewSetupProps {
  onStartSession: (config: InterviewConfig) => void;
  isLoading: boolean;
}

const JOB_ROLES: JobRole[] = [
  "entry", "security", "data", "product", "digital_market", "frontend", "backend", "sales", "AI", "finance", "leadership"
];

// Apple-style spring animation config
const springTransition: Transition = { type: 'spring', bounce: 0.15, duration: 0.5 };

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStartSession, isLoading }) => {
  const [selectedRole, setSelectedRole] = useState<JobRole>('frontend');
  const [questionCount, setQuestionCount] = useState<number>(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSession({
      jobRole: selectedRole,
      questionCount,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={springTransition}
      className="font-['Lato',sans-serif] max-w-4xl mx-auto pb-24 sm:pb-6"
    >
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-[32px] p-6 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 pb-6 border-b border-gray-100">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="inline-block px-4 py-1.5 bg-[#00A651]/10 rounded-full text-[11px] font-bold text-[#00863F] uppercase tracking-widest mb-2"
          >
            Powered by Maekandex Academy
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-black !text-gray-900 tracking-tight">
            Configure Your <span className="text-[#00A651]">Mock Session</span>
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto font-medium">
            Select your target specialization and session length.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Target Job Role */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
                <FiBriefcase className="w-4 h-4 text-[#00A651]" /> Specialization
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {JOB_ROLES.map((role) => {
                const isSelected = selectedRole === role;
                return (
                  <button
                    type="button"
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className="relative p-4 rounded-2xl text-left transition-all duration-300 flex flex-col justify-center overflow-hidden h-24 group border border-gray-100 bg-gray-50/50 hover:bg-gray-100/50"
                  >
                    {isSelected && (
                      <motion.div 
                        layoutId="active-role-bg"
                        transition={springTransition}
                        className="absolute inset-0 bg-[#00A651] border border-[#00A651] rounded-2xl shadow-[0_8px_20px_rgba(0,166,81,0.2)]"
                      />
                    )}
                    
                    <div className={`relative z-10 font-bold text-sm uppercase tracking-wide transition-colors duration-300 ${isSelected ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {role.replace('-', ' ')}
                    </div>
                    
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-3 right-3 z-10"
                        >
                          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                            <FiCheck className="w-3 h-3 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Count Slider */}
          <div className="space-y-4 px-1">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
                <FiHelpCircle className="w-4 h-4 text-[#00A651]" /> Session Length
              </label>
              <span className="text-xs font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                {questionCount} Questions
              </span>
            </div>
            
            <div className="relative pt-2 pb-6">
              <input
                type="range"
                min={10}
                max={30}
                step={5}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full appearance-none bg-gray-200 h-2 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_10px_rgba(0,0,0,0.15)] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-100 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #00A651 0%, #00A651 ${((questionCount - 10) / 20) * 100}%, #E5E7EB ${((questionCount - 10) / 20) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-[11px] text-gray-400 font-medium absolute w-full bottom-0">
                <span>Short (10)</span>
                <span>Standard (15)</span>
                <span>Deep Dive (30)</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="hidden sm:flex w-full py-4 rounded-2xl 0 bg-linear-to-br from-[#8DC63F] via-[#00A651] to-[#00863F] text-white font-bold text-sm items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Begin Interview</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 z-50">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="text-left">
            <span className="text-xs font-bold text-gray-900 block uppercase tracking-wider">{selectedRole.replace('-', ' ')}</span>
            <span className="text-[10px] text-gray-500">{questionCount} Questions</span>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-3.5 rounded-xl bg-gray-900 active:bg-black text-white font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-70"
          >
            {isLoading ? (
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Start Now</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};