/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, InterviewConfig, UserResponse } from '@/types/interview';
import { FiClock, FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi';

interface ActiveInterviewSessionProps {
  questions: Question[];
  config: InterviewConfig;
  onComplete: (responses: UserResponse[]) => void;
}

const TIMER_LIMIT = 60;

export const ActiveInterviewSession: React.FC<ActiveInterviewSessionProps> = ({
  questions,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_LIMIT);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(() => new Array(questions.length).fill(null));
  const [timeSpent, setTimeSpent] = useState<number[]>(() => new Array(questions.length).fill(0));

  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const finishInterview = useCallback(() => {
    const finalResponses: UserResponse[] = questions.map((q, idx) => ({
      questionId: q.id,
      selectedOptionIndex: selectedAnswers[idx],
      isCorrect: selectedAnswers[idx] === q.correctOptionIndex,
      timeSpentSeconds: timeSpent[idx] || TIMER_LIMIT,
    }));
    onComplete(finalResponses);
  }, [questions, selectedAnswers, timeSpent, onComplete]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishInterview();
    }
  }, [currentIndex, questions.length, finishInterview]);

  useEffect(() => {
    setTimeLeft(TIMER_LIMIT);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, handleNextQuestion]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, []);

  const handleSelectOption = (index: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentIndex] = index;
    setSelectedAnswers(updatedAnswers);

    const updatedTimeSpent = [...timeSpent];
    updatedTimeSpent[currentIndex] = TIMER_LIMIT - timeLeft;
    setTimeSpent(updatedTimeSpent);

    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    autoAdvanceTimerRef.current = setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 350);
  };

  const currentSelectedOption = selectedAnswers[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="font-['Lato',sans-serif] max-w-3xl mx-auto space-y-5 pb-10"
    >
      <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#00A651]/10 text-[#00863F] text-xs font-bold border border-[#00A651]/20">
            {currentQuestion?.category || 'General'}
          </span>
          <p className="text-xs text-[#64748B] mt-1.5 font-medium">
            Question <span className="text-[#0A0F1C] font-bold">{currentIndex + 1}</span> of {questions.length}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F8F9FA] border border-[#0F172A]/10 px-3.5 py-1.5 rounded-xl text-[#0A0F1C] font-mono font-bold text-sm">
          <FiClock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-[#00A651]'}`} />
          <span>00:{String(Math.max(0, timeLeft)).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="w-full bg-[#E8E6E1] h-2 rounded-full overflow-hidden">
        <motion.div
          className="bg-[#00A651] h-full"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="bg-white border border-[#0F172A]/10 rounded-3xl p-5 sm:p-8 shadow-sm overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-6"
          >
            <h3 className="text-base sm:text-lg font-bold text-[#0A0F1C] leading-snug">
              {currentQuestion?.questionText}
            </h3>

            <div className="space-y-2.5">
              {currentQuestion?.options.map((optText, idx) => {
                const isSelected = currentSelectedOption === idx;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
                      isSelected
                        ? 'bg-[#00A651]/10 border-[#00A651] text-[#0A0F1C] font-semibold ring-1 ring-[#00A651]'
                        : 'bg-[#F8F9FA] border-[#0F172A]/10 text-[#1E293B] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition-colors ${
                          isSelected ? 'bg-[#00A651] border-[#00A651] text-white' : 'border-[#64748B] text-[#64748B]'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-xs sm:text-sm leading-relaxed">{optText}</span>
                    </div>
                    {isSelected && <FiCheck className="w-4 h-4 text-[#00A651] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#0F172A]/5">
              <button
                type="button"
                onClick={() => {
                  if (currentIndex > 0) {
                    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
                    setCurrentIndex((prev) => prev - 1);
                  }
                }}
                disabled={currentIndex === 0}
                className={`px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                  currentIndex === 0
                    ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200'
                    : 'bg-white border-[#0F172A]/20 text-[#0A0F1C] hover:bg-gray-50'
                }`}
              >
                <FiArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIndex + 1 === questions.length ? (
                <button
                  type="button"
                  onClick={finishInterview}
                  className="px-6 py-3 rounded-xl bg-[#00A651] hover:bg-[#00863F] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
                >
                  <span>Submit & Finish</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-3 rounded-xl bg-[#0A0F1C] hover:bg-[#151B2E] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
                >
                  <span>Next</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};