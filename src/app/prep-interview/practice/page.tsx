'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { InterviewConfig, Question, UserResponse } from '@/types/interview';
import { ActiveInterviewSession } from '@/components/interview/ActiveInterviewSession';
import { InterviewResults } from '@/components/interview/InterviewResults';
import { InterviewSetup } from '@/components/interview/InterviewSetup';
import { fetchQuestionsFromApi } from '@/lib/jobApi';

// Apple-style modern fade & slide variants using spring physics
const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 300, damping: 30 } 
  },
  exit: { 
    opacity: 0, 
    y: -15, 
    transition: { duration: 0.2, ease: 'easeInOut' } 
  },
};

export default function InterviewPrepPracticePage() {
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<UserResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanly derive the current UI step from our state
  const step = !config ? 'setup' : !responses ? 'active' : 'results';

  const handleStartSession = async (newConfig: InterviewConfig) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('job_token') 
        : undefined;

      const sessionQuestions = await fetchQuestionsFromApi(
        newConfig.jobRole,
        newConfig.questionCount,
        token || undefined 
      );
      
      setConfig(newConfig);
      setQuestions(sessionQuestions);
      setResponses(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions. Please try again.');
      
      // Auto-dismiss the error toast after 5 seconds for better UX
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setConfig(null);
    setQuestions([]);
    setResponses(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="font-['Lato',sans-serif] min-h-screen bg-gray-50/50 text-gray-900 py-12 sm:py-20 px-4 sm:px-6 lg:px-8 selection:bg-[#00A651]/20 overflow-hidden">
      <div className="max-w-5xl mx-auto relative">
        
        {/* iOS-Style Floating Error Toast */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-white/85 backdrop-blur-md border border-rose-100 shadow-lg shadow-rose-100/50 rounded-full text-sm font-medium text-rose-600"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area with Smooth Step Transitions */}
        <AnimatePresence mode="wait">
          {step === 'setup' && (
            <motion.div key="setup" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
              <InterviewSetup 
                onStartSession={handleStartSession} 
                isLoading={isLoading} 
              />
            </motion.div>
          )}

          {step === 'active' && questions.length > 0 && (
            <motion.div key="active" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
              <ActiveInterviewSession
                questions={questions}
                config={config!}
                onComplete={(finalResponses) => {
                  setResponses(finalResponses);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {step === 'results' && responses && (
            <motion.div key="results" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
              <InterviewResults
                responses={responses}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}