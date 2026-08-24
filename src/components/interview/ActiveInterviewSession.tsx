/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, InterviewConfig, UserResponse } from '@/types/interview';
import { FiClock, FiArrowRight, FiCheck } from 'react-icons/fi';

interface ActiveInterviewSessionProps {
  questions: Question[];
  config: InterviewConfig;
  onComplete: (responses: UserResponse[]) => void;
}

const TIMER_LIMIT = 60;
const springTransition = { type: 'spring' as const, bounce: 0, duration: 0.4 };

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

    // Subtle pause before moving on
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        finishInterview(updatedAnswers);
      }
    }, 400);
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
    <div className="font-['Lato',sans-serif] max-w-3xl mx-auto space-y-6 pb-10">
      
      {/* Header Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="uppercase tracking-widest text-[10px] font-black text-gray-400 block mb-1">
            {currentQuestion?.category}
          </span>
          <p className="text-sm text-gray-900 font-bold">
            Question {currentIndex + 1} <span className="text-gray-400 font-normal">of {questions.length}</span>
          </p>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono font-bold text-sm transition-colors duration-300 ${timeLeft <= 10 ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-900'}`}>
          <FiClock className={`w-4 h-4 ${timeLeft <= 10 ? 'animate-pulse' : ''}`} />
          <span>00:{String(timeLeft).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
        <motion.div
          className="bg-[#00A651] h-full"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-[32px] p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, filter: 'blur(8px)', x: 10 }}
            animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)', x: -10 }}
            transition={springTransition}
            className="space-y-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold !text-gray-900 leading-tight">
              {currentQuestion?.questionText}
            </h3>

            <div className="space-y-3">
              {currentQuestion?.options.map((optText, idx) => {
                const isSelected = currentSelectedOption === idx;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className="relative w-full p-4 sm:p-5 rounded-2xl text-left flex items-start gap-4 group transition-all duration-300 outline-none"
                  >
                    {/* Background layer for animation */}
                    <div className={`absolute inset-0 rounded-2xl border transition-all duration-300 ${isSelected ? 'bg-[#00A651]/5 border-[#00A651]/30' : 'bg-white border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-50/50'}`} />
                    
                    <div className="relative z-10 flex items-start gap-4 w-full">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 transition-colors duration-300 ${isSelected ? 'bg-[#00A651] border-[#00A651] text-white shadow-sm' : 'border-gray-300 text-gray-400 group-hover:border-gray-400 group-hover:text-gray-500'}`}>
                        {isSelected ? <FiCheck className="w-3 h-3" /> : String.fromCharCode(65 + idx)}
                      </div>
                      <span className={`text-sm sm:text-base leading-relaxed transition-colors duration-300 ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                        {optText}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
               <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-2xl bg-gray-900 hover:bg-black active:scale-95 text-white font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <span>{currentIndex + 1 === questions.length ? 'Submit' : 'Skip & Next'}</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};