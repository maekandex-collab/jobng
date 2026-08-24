'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { InterviewConfig, Question, UserResponse } from '@/types/interview';
import { ActiveInterviewSession } from '@/components/interview/ActiveInterviewSession';
import { InterviewResults } from '@/components/interview/InterviewResults';
import { InterviewSetup } from '@/components/interview/InterviewSetup';
import { fetchQuestionsFromApi } from '@/services/interviewApi';

export default function InterviewPrepPracticePage() {
  const router = useRouter();
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<UserResponse[] | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartSession = async (newConfig: InterviewConfig) => {
    setLoading(true);
    setError(null);

    try {
      const fetchedQuestions = await fetchQuestionsFromApi(
        newConfig.jobRole || 'product',
        newConfig.questionCount
      );

      setConfig(newConfig);
      setQuestions(fetchedQuestions);
      setResponses(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'Unable to load interview questions.');
    } finally {
      setLoading(false);
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
    <main className="font-['Lato',sans-serif] min-h-screen bg-[#F8F9FA] text-[#0A0F1C] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-all">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }} 
              className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex justify-between items-center"
            >
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-800 underline font-bold">
                Dismiss
              </button>
            </motion.div>
          )}

          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="bg-white border border-[#0F172A]/10 rounded-3xl p-12 text-center space-y-4 shadow-sm max-w-lg mx-auto"
            >
              <div className="w-10 h-10 border-4 border-[#00A651] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-[#0A0F1C]">Fetching questions...</p>
            </motion.div>
          ) : !config ? (
            <InterviewSetup key="setup" onStartSession={handleStartSession} />
          ) : config && questions.length > 0 && !responses ? (
            <ActiveInterviewSession
              key="session"
              questions={questions}
              config={config}
              onComplete={(finalResponses) => {
                setResponses(finalResponses);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : responses ? (
            <InterviewResults
              key="results"
              responses={responses}
              onRestart={handleRestart}
              onApplyForJobs={() => router.push('/jobs')}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}