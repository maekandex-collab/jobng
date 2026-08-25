"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { InterviewConfig, JobRole } from "@/types/interview";
import {
  FiBriefcase,
  FiHelpCircle,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";

interface InterviewSetupProps {
  onStartSession: (config: InterviewConfig) => void;
  isLoading: boolean;
  roleSelected: JobRole;
  onRoleSelect: (role: JobRole) => void;
}

const JOB_ROLES: JobRole[] = [
  "frontend",
  "security",
  "data",
  "product",
  "digital_market",
  "entry",
  "backend",
  "sales",
  "AI",
  "finance",
  "leadership",
];

const springTransition: Transition = {
  type: "spring",
  bounce: 0.15,
  duration: 0.4,
};

export const InterviewSetup: React.FC<InterviewSetupProps> = ({
  onStartSession,
  isLoading,
  roleSelected,
  onRoleSelect,
}) => {
  const MIN_QUESTIONS = 10;
  const MAX_QUESTIONS = 20;
  
  const [questionCount, setQuestionCount] = useState<number>(10);
  const fillPercentage =
    ((questionCount - MIN_QUESTIONS) / (MAX_QUESTIONS - MIN_QUESTIONS)) * 100;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onStartSession({
      jobRole: roleSelected,
      questionCount,
    });
  };

  const formatRoleLabel = (role: string) => {
    if (role === "security") return "Cyber Security";
    if (role === "AI") return "Artificial Intel.";
    return role.replace("_", " ");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className="font-['Lato',sans-serif] max-w-3xl mx-auto pb-24 sm:pb-28 px-3 sm:px-0"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl border border-gray-200/70 rounded-3xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-5"
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center px-2.5 py-0.5 bg-[#00A651]/10 rounded-full text-[10px] font-extrabold text-[#00863F] uppercase tracking-wider mb-1">
              Maekandex Academy
            </div>
            <h2 className="text-xl sm:text-2xl font-black !text-gray-900 tracking-tight leading-tight">
              Prepare for Your <span className="text-[#00A651]">Next Interview</span>
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-medium sm:block text-right max-w-[300px]">
            Choose your specialization and session length.
          </p>
        </div>

        {/* Target Job Role - Compact Pill Grid */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-900 uppercase tracking-wider">
            <FiBriefcase className="w-3.5 h-3.5 text-[#00A651]" />{" "}
            Specialization
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {JOB_ROLES.map((role) => {
              const isSelected = roleSelected === role;
              return (
                <button
                  type="button"
                  key={role}
                  onClick={() => onRoleSelect(role)}
                  className="relative h-11 px-3 rounded-xl transition-all duration-200 flex items-center justify-between overflow-hidden border border-gray-100 bg-gray-50/60 hover:bg-gray-100/60 text-left group"
                >
                  {isSelected && (
                    <motion.div
                      layoutId="active-role-bg"
                      transition={springTransition}
                      className="absolute inset-0 bg-[#00A651] border border-[#00A651] rounded-xl shadow-[0_4px_12px_rgba(0,166,81,0.25)]"
                    />
                  )}

                  <span
                    className={`relative z-10 font-medium text-xs uppercase tracking-wide truncate pr-1 transition-colors ${isSelected ? "text-white" : "text-gray-700 group-hover:text-gray-900"}`}
                  >
                    {formatRoleLabel(role)}
                  </span>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="relative z-10 shrink-0"
                      >
                        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                          <FiCheck className="w-2.5 h-2.5 text-white" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Count - Compact Segmented Control */}
        <div className="space-y-2 pt-1">
          {/* Header with Title and Current Value Badge */}
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-900 uppercase tracking-wider">
              <FiHelpCircle className="w-3.5 h-3.5 text-[#00A651]" /> Session
              Length
            </label>
            <span className="text-[11px] font-extrabold text-[#00863F] bg-[#00A651]/10 px-2.5 py-0.5 rounded-full">
              {questionCount} Questions
            </span>
          </div>

          {/* Compact Range Bar */}
          <div className="relative pt-1 pb-5 px-0.5">
            <input
              type="range"
              min={MIN_QUESTIONS}
              max={MAX_QUESTIONS}
              step={5}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full appearance-none bg-gray-200 h-2 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.15)] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-200 cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00A651 0%, #00A651 ${fillPercentage}%, #E5E7EB ${fillPercentage}%, #E5E7EB 100%)`,
              }}
            />

            {/* Step Labels Below Bar */}
            <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider absolute w-full bottom-0 left-0 px-0.5">
              <span>Short (10)</span>
              <span className="text-center">Standard (15)</span>
              <span className="text-right">Deep Dive (20)</span>
            </div>
          </div>
        </div>
      </form>

      {/* Fixed Sticky Dock (Mobile & Desktop Unified) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/80 p-3 sm:p-4 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
              Selected Role
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-gray-900 uppercase">
                {formatRoleLabel(roleSelected)}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-xs font-bold text-[#00A651] bg-[#00A651]/10 px-2 py-0.5 rounded-md">
                {questionCount} Questions
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isLoading}
            className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-br from-[#8DC63F] via-[#00A651] to-[#00863F] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_16px_rgba(0,166,81,0.3)] transition-all active:scale-95 hover:brightness-105 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Begin Interview</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
