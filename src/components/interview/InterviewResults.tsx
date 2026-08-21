'use client';

import React from 'react';
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

  return (
    <div className="font-['Lato',sans-serif] max-w-2xl mx-auto space-y-6">
      <div className={`border rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-md transition-all ${
        isPassed 
          ? 'bg-gradient-to-b from-emerald-50/50 to-white border-emerald-200' 
          : 'bg-gradient-to-b from-rose-50/50 to-white border-rose-200'
      }`}>
        
        {/* Badge Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border ${
          isPassed 
            ? 'bg-emerald-100 border-emerald-300 text-emerald-600' 
            : 'bg-rose-100 border-rose-300 text-rose-600'
        }`}>
          {isPassed ? <FiAward className="w-8 h-8" /> : <FiAlertCircle className="w-8 h-8" />}
        </div>

        <div>
          <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2 border">
            {isPassed ? (
              <span className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1 rounded-full items-center gap-1.5 inline-flex">
                <FiCheckCircle className="w-3.5 h-3.5" /> Interview Passed
              </span>
            ) : (
              <span className="bg-rose-100 text-rose-800 border-rose-200 px-3 py-1 rounded-full items-center gap-1.5 inline-flex">
                <FiAlertCircle className="w-3.5 h-3.5" /> Needs Improvement
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-[#0A0F1C]">Session Complete!</h2>
        </div>

        {/* Score Metrics */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#0F172A]/10 p-5 rounded-2xl flex items-center justify-around shadow-sm">
          <div>
            <span className={`text-3xl font-extrabold ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
              {scorePercentage}%
            </span>
            <p className="text-xs text-[#64748B] font-semibold mt-1">Accuracy Score</p>
          </div>
          <div className="h-10 w-px bg-[#0F172A]/10" />
          <div>
            <span className="text-3xl font-extrabold text-[#0A0F1C]">
              {correctCount} / {totalQuestions}
            </span>
            <p className="text-xs text-[#64748B] font-semibold mt-1">Correct Answers</p>
          </div>
        </div>

        {/* Performance Feedback */}
        <div className={`p-4 rounded-2xl text-xs text-left leading-relaxed border ${
          isPassed 
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
            : 'bg-rose-50/80 border-rose-200 text-rose-900'
        }`}>
          <strong className="block font-bold mb-1">
            {isPassed ? 'Excellent Demonstration of Concepts!' : 'Targeted Practice Recommended:'}
          </strong>
          {isPassed ? (
            'You demonstrated strong technical mastery across the core domain concepts. You are well prepared to advance to real technical interviews for this position.'
          ) : (
            'Your score fell below the standard 70% threshold. Review missed core concepts in the questions above and restart a new session to strengthen your grasp.'
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onRestart}
            className="py-3.5 px-4 rounded-xl bg-[#0A0F1C] hover:bg-[#151B2E] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <FiRotateCcw className="w-4 h-4" />
            <span>Retake Interview Session</span>
          </button>

          <button
            type="button"
            onClick={onApplyForJobs || (() => window.location.href = '/jobs')}
            className="py-3.5 px-4 rounded-xl bg-[#00A651] hover:bg-[#00863F] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <FiBriefcase className="w-4 h-4" />
            <span>Apply for Job Openings</span>
          </button>
        </div>
      </div>

      <div className="text-center">
        <span className="text-[11px] text-[#64748B] font-medium">
          Powered by <strong className="text-[#00A651]">Maekandex Academy</strong>
        </span>
      </div>
    </div>
  );
};