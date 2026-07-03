/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TRIVIA } from '../data/okpoamaData';
import { Award, CheckCircle, XCircle, ChevronRight, HelpCircle, RotateCcw, ShieldAlert, Sparkles, Printer } from 'lucide-react';

export const TriviaQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Certificate Customization State
  const [ambassadorName, setAmbassadorName] = useState('Emmanuel Kpe');
  const [isCertificatePrinted, setIsCertificatePrinted] = useState(false);

  const currentQuestion = TRIVIA[currentQuestionIndex];

  const handleOptionClick = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOptionIndex(idx);
    setHasAnswered(true);

    if (idx === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextClick = () => {
    setSelectedOptionIndex(null);
    setHasAnswered(false);

    if (currentQuestionIndex < TRIVIA.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setHasAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setIsCertificatePrinted(false);
  };

  const handlePrintCertificate = () => {
    setIsCertificatePrinted(true);
    setTimeout(() => {
      window.print();
      setIsCertificatePrinted(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Quiz Board: Left */}
      <div className="lg:col-span-7 flex flex-col justify-between h-full">
        <AnimatePresence mode="wait">
          {!quizCompleted ? (
            <motion.div
              key="active-quiz"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Score & Progress indicator */}
                <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
                  <span className="font-mono text-3xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-300/30">
                    Question {currentQuestionIndex + 1} of {TRIVIA.length}
                  </span>
                  <span className="font-sans text-2xs font-semibold text-stone-500">
                    Current Score: <strong className="text-stone-900">{score}</strong>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / TRIVIA.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <div className="space-y-3 pt-2 text-left">
                  <h4 className="font-display text-base md:text-lg font-bold text-stone-900 tracking-tight leading-snug flex items-start gap-2.5">
                    <HelpCircle className="w-5.5 h-5.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{currentQuestion.question}</span>
                  </h4>
                </div>

                {/* Options Rack */}
                <div className="grid grid-cols-1 gap-3 pt-3">
                  {currentQuestion.options.map((option, idx) => {
                    let btnStyle = 'border-stone-200 hover:bg-stone-50 text-stone-700 bg-white';
                    
                    if (hasAnswered) {
                      if (idx === currentQuestion.correctAnswerIndex) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                      } else if (idx === selectedOptionIndex) {
                        btnStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                      } else {
                        btnStyle = 'border-stone-100 bg-stone-50/50 text-stone-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasAnswered}
                        onClick={() => handleOptionClick(idx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs font-sans transition-all duration-200 flex items-center justify-between gap-4 ${btnStyle} ${
                          !hasAnswered ? 'cursor-pointer' : 'cursor-default'
                        }`}
                        id={`quiz-option-${idx}`}
                      >
                        <span className="leading-relaxed">{option}</span>
                        {hasAnswered && idx === currentQuestion.correctAnswerIndex && (
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                        )}
                        {hasAnswered && idx === selectedOptionIndex && idx !== currentQuestion.correctAnswerIndex && (
                          <XCircle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Immediate educational explanation panel */}
              <div className="pt-6 border-t border-stone-100 mt-6 space-y-4">
                <div className="min-h-16 flex items-center justify-center">
                  {hasAnswered ? (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-stone-50 border border-stone-150 rounded-xl text-left w-full"
                    >
                      <h5 className="font-display text-3xs font-bold uppercase tracking-wider text-stone-900 mb-1">
                        Cultural Fact Explorer
                      </h5>
                      <p className="font-sans text-xs text-stone-600 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </motion.div>
                  ) : (
                    <p className="font-sans text-3xs text-stone-500 italic text-center">
                      Choose an option above to answer the question.
                    </p>
                  )}
                </div>

                {hasAnswered && (
                  <button
                    onClick={handleNextClick}
                    className="w-full py-3 bg-stone-900 hover:bg-stone-850 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-sans"
                    id="quiz-next-btn"
                  >
                    <span>{currentQuestionIndex < TRIVIA.length - 1 ? 'Next Question' : 'View Quiz Results'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="completed-quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-sm flex-1 flex flex-col justify-center items-center py-10"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-600 mb-2 animate-bounce">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-sm">
                <h4 className="font-display text-2xl font-extrabold text-stone-900 tracking-tight">
                  Trivia Complete!
                </h4>
                <p className="font-sans text-xs text-stone-600 leading-relaxed">
                  You scored <strong className="text-stone-900">{score} out of {TRIVIA.length}</strong> on the Okpoama Kingdom cultural assessment.
                </p>
                {score >= 3 ? (
                  <p className="font-sans text-2xs text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-4 py-2 rounded-xl">
                    Outstanding! You have qualified as an <strong>Official Okpoama Cultural Ambassador</strong>. Personalize your Royal Certificate on the right!
                  </p>
                ) : (
                  <p className="font-sans text-2xs text-amber-700 bg-amber-50 border border-amber-200/50 px-4 py-2 rounded-xl">
                    Great effort! To secure your official Royal Ambassador Certificate, try to get at least <strong>3 correct answers</strong>. Click below to try again.
                  </p>
                )}
              </div>

              <div className="flex gap-4 w-full max-w-xs pt-2">
                <button
                  onClick={resetQuiz}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 hover:text-stone-950 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-sans"
                  id="quiz-retry-btn"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Certificate Showcase: Right */}
      <div className="lg:col-span-5 flex flex-col justify-between h-full">
        {quizCompleted && score >= 3 ? (
          <div className="space-y-4">
            {/* Input name controller */}
            <div className="space-y-1 text-left">
              <label className="font-sans text-2xs font-bold text-stone-600 uppercase tracking-wider block">
                Your Full Name for the Certificate
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={28}
                  placeholder="e.g. Emmanuel Kpe"
                  value={ambassadorName}
                  onChange={(e) => setAmbassadorName(e.target.value)}
                  className="flex-1 bg-white border border-stone-200 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs font-sans text-stone-800 outline-none transition-all duration-200"
                  id="cert-input-name"
                />
                <button
                  onClick={handlePrintCertificate}
                  className="px-4 bg-stone-900 hover:bg-stone-850 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                  id="cert-print-btn"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Royal Certificate Card */}
            <div className="border-8 border-double border-amber-500/80 bg-amber-50/50 p-6 rounded-2xl relative overflow-hidden shadow-md text-center space-y-6 aspect-[4/3] flex flex-col justify-between" id="royal-certificate">
              {/* Corner flourishes */}
              <div className="absolute top-2 left-2 text-amber-500/30 text-xl font-serif">❈</div>
              <div className="absolute top-2 right-2 text-amber-500/30 text-xl font-serif">❈</div>
              <div className="absolute bottom-2 left-2 text-amber-500/30 text-xl font-serif">❈</div>
              <div className="absolute bottom-2 right-2 text-amber-500/30 text-xl font-serif">❈</div>

              {/* Watermark logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none select-none">
                <span className="text-8xl">👑</span>
              </div>

              <div className="space-y-1 relative z-10">
                <span className="font-display text-4xs font-bold tracking-widest text-amber-700 block uppercase">
                  Royal Decree of Honour
                </span>
                <h3 className="font-display text-xs font-extrabold text-stone-900 tracking-tight leading-tight uppercase">
                  Okpoama Traditional Council
                </h3>
                <div className="h-0.5 w-12 bg-amber-500 mx-auto my-1" />
              </div>

              <div className="space-y-2.5 relative z-10">
                <span className="font-serif text-3xs italic text-stone-500 block">
                  This certifies that
                </span>
                <p className="font-serif text-lg md:text-xl font-bold tracking-wide text-amber-950 underline decoration-amber-500/40 decoration-wavy underline-offset-4">
                  {ambassadorName || 'Honoured Guest'}
                </p>
                <span className="font-serif text-3xs italic text-stone-500 max-w-xs mx-auto leading-relaxed block">
                  has demonstrated pristine and profound knowledge of the customs, ancient traditions, and ocean heritage of the Brass-Ijaw people of the Okpoama Kingdom during the public assessments.
                </span>
              </div>

              <div className="relative z-10 space-y-2">
                <span className="font-display text-4xs font-bold text-amber-800 uppercase tracking-widest block">
                  Crowned Ambassador of Culture
                </span>

                {/* Simulated Royal Signatures */}
                <div className="flex justify-between items-end pt-2 border-t border-stone-200/50 max-w-xs mx-auto">
                  <div className="text-left font-serif text-5xs text-stone-500">
                    <span className="font-cursive italic text-stone-700 block leading-none">Amanyanabo Okpo XXI</span>
                    <span className="block mt-1 leading-none">HRM King E. Banigo</span>
                    <span className="block leading-none text-stone-400">Traditional Ruler</span>
                  </div>
                  <div className="text-center">
                    <span className="text-lg">💮</span>
                  </div>
                  <div className="text-right font-serif text-5xs text-stone-500">
                    <span className="font-cursive italic text-stone-700 block leading-none">Elders Council Guild</span>
                    <span className="block mt-1 leading-none">Chief Priest Oru</span>
                    <span className="block leading-none text-stone-400">Okpoama Shrine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-stone-200 border-dashed rounded-3xl p-8 text-center space-y-3.5 bg-stone-50 h-full flex flex-col items-center justify-center">
            <Printer className="w-10 h-10 text-stone-300 animate-pulse" />
            <div className="max-w-xs space-y-1">
              <h4 className="font-display text-sm font-bold text-stone-400">
                Ambassador Certificate Lock
              </h4>
              <p className="font-sans text-2xs text-stone-500 leading-relaxed">
                Complete the Cultural assessment on the left with a score of <strong>3 or higher</strong> to unlock your official Royal Certificate!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
