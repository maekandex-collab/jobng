/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { Question, InterviewConfig, UserResponse } from '@/types/interview';
import { FiClock, FiArrowRight, FiCheck } from 'react-icons/fi';

interface ActiveInterviewSessionProps {
  questions: Question[];
  config?: InterviewConfig;
  onComplete: (responses: UserResponse[]) => void;
}

const TIMER_LIMIT = 60;
const springTransition: Transition = { type: 'spring', bounce: 0, duration: 0.35 };

export const ActiveInterviewSession: React.FC<ActiveInterviewSessionProps> = ({
  questions,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_LIMIT);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  useEffect(() => {
    setTimeLeft(TIMER_LIMIT);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return TIMER_LIMIT;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleSelectOption = (index: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentIndex] = index;
    setSelectedAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        finishInterview(updatedAnswers);
      }
    }, 350);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishInterview(selectedAnswers);
    }
  };

  const finishInterview = (finalAnswers: (number | null)[]) => {
    const finalResponses: UserResponse[] = questions.map((q, idx) => {
      const selected = finalAnswers[idx];
      return {
        questionId: q.id,
        selectedOptionIndex: selected,
        isCorrect: selected === q.correctOptionIndex,
        timeSpentSeconds: TIMER_LIMIT - timeLeft,
      };
    });
    onComplete(finalResponses);
  };

  const currentSelectedOption = selectedAnswers[currentIndex];

  return (
    <div className="font-['Lato',sans-serif] max-w-3xl mx-auto space-y-4 pb-24 sm:pb-28 px-3 sm:px-0">
      
      {/* Streamlined HUD Top Bar with Integrated Progress */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/70 rounded-2xl p-3.5 sm:p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00A651]/10 text-[#00863F] font-extrabold text-[10px] uppercase tracking-wider">
              {currentQuestion?.category || 'Question'}
            </span>
            <span className="text-xs sm:text-sm text-gray-900 font-black">
              {currentIndex + 1}<span className="text-gray-400 font-medium">/{questions.length}</span>
            </span>
          </div>

          {/* Dynamic Timer Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-black text-xs transition-all duration-300 ${
            timeLeft <= 10 
              ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' 
              : 'bg-gray-100/80 text-gray-800 border border-gray-200/60'
          }`}>
            <FiClock className={`w-3.5 h-3.5 ${timeLeft <= 10 ? 'text-red-500' : 'text-[#00A651]'}`} />
            <span>00:{String(timeLeft).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Embedded Hairline Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
          <motion.div
            className="bg-gradient-to-r from-[#8DC63F] to-[#00A651] h-full"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Main Question & Compact Options Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/70 rounded-3xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={springTransition}
            className="space-y-4"
          >
            {/* Question Text */}
            <h3 className="text-base sm:text-xl font-black text-gray-900 leading-snug tracking-tight">
              {currentQuestion?.questionText}
            </h3>

            {/* Compact Option List */}
            <div className="space-y-2 pt-1">
              {currentQuestion?.options.map((optText, idx) => {
                const isSelected = currentSelectedOption === idx;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className="relative w-full p-3 sm:p-3.5 rounded-xl text-left flex items-center gap-3 group transition-all duration-200 outline-none overflow-hidden"
                  >
                    {/* Option Background Layer */}
                    <div className={`absolute inset-0 rounded-xl border transition-all duration-200 ${
                      isSelected 
                        ? 'bg-[#00A651]/10 border-[#00A651] shadow-[0_2px_10px_rgba(0,166,81,0.15)]' 
                        : 'bg-gray-50/70 border-gray-200/80 hover:border-gray-300 hover:bg-gray-100/60'
                    }`} />
                    
                    <div className="relative z-10 flex items-center gap-3 w-full">
                      {/* Squircle Badge Indicator */}
                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center text-[11px] font-black shrink-0 transition-colors duration-200 ${
                        isSelected 
                          ? 'bg-[#00A651] border-[#00A651] text-white shadow-xs' 
                          : 'bg-white border-gray-300 text-gray-500 group-hover:border-gray-400 group-hover:text-gray-700'
                      }`}>
                        {isSelected ? <FiCheck className="w-3.5 h-3.5 stroke-[3]" /> : String.fromCharCode(65 + idx)}
                      </div>
                      
                      <span className={`text-xs sm:text-sm font-semibold leading-normal transition-colors ${
                        isSelected ? 'text-gray-900 font-bold' : 'text-gray-700 group-hover:text-gray-900'
                      }`}>
                        {optText}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Unified Fixed Sticky Bottom Dock */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/80 p-3 sm:p-4 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          {/* Progress Summary */}
          <div className="text-left hidden sm:block">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Session Progress</span>
            <span className="text-xs font-black text-gray-900">
              {progressPercent}% Completed
            </span>
          </div>

          <div className="sm:hidden text-xs font-bold text-gray-500">
            Q{currentIndex + 1} of {questions.length}
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleNextQuestion}
            className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gray-900 hover:bg-black active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
          >
            <span>{currentIndex + 1 === questions.length ? 'Submit Session' : 'Skip & Next'}</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};