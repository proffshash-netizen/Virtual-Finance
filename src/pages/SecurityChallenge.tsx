import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../lib/gameState';
import { mockSecurityApi } from '../lib/mockSecurityApi';
import type { SecurityScenario } from '../lib/mockSecurityApi';
import { ShieldCheck, ShieldAlert, Smartphone, ArrowRight, CheckCircle2, XCircle, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export function SecurityChallenge() {
  const navigate = useNavigate();
  const { addXp, unlockAchievement } = useGameState();
  const [scenarios, setScenarios] = useState<SecurityScenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean, explanation: string, xpAwarded: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    mockSecurityApi.getScenarios().then(data => {
      setScenarios(data);
      setLoading(false);
    });
  }, []);

  const handleAnswer = async (isSafe: boolean) => {
    if (processing || feedback) return;
    setProcessing(true);

    const scenario = scenarios[currentIndex];
    
    try {
      const response = await mockSecurityApi.attemptScenario(scenario.id, isSafe);
      
      setFeedback(response);
      
      if (response.correct) {
        setScore(prev => prev + 1);
        addXp(response.xpAwarded);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentIndex + 1 < scenarios.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishSession();
    }
  };

  const finishSession = () => {
    setSessionComplete(true);
    const winRate = score / scenarios.length;
    if (winRate >= 0.8) {
      unlockAchievement('fraud_spotter'); // Assuming we add this badge later
    }
  };

  if (loading) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center pt-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (sessionComplete) {
    const winRate = score / scenarios.length;
    const earnedBadge = winRate >= 0.8;

    return (
      <div className="max-w-md mx-auto pt-16 px-4 pb-32">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-surface rounded-3xl p-8 border-4 border-border shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-black mb-2 text-text-primary">Session Complete</h2>
          <p className="text-text-secondary font-medium mb-8">You correctly identified {score} out of {scenarios.length} scenarios.</p>

          {earnedBadge && (
            <div className="bg-gradient-to-r from-amber-100 to-yellow-50 border-2 border-yellow-400 p-6 rounded-2xl mb-8 transform hover:scale-105 transition-transform">
              <Award className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-xl font-black text-amber-900 mb-1">Fraud Spotter Badge</h3>
              <p className="text-sm font-bold text-amber-700">Awarded for high accuracy in identifying scams.</p>
            </div>
          )}

          <Button className="game-btn-primary w-full h-14 text-lg" onClick={() => navigate('/world')}>
            Return to World Map
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentScenario = scenarios[currentIndex];

  return (
    <div className="max-w-md mx-auto pt-8 md:pt-16 px-4 pb-32 relative flex flex-col items-center">
      {/* Phone Frame wrapper */}
      <motion.div 
        key={currentScenario.id}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="w-full max-w-[360px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl relative border-[6px] border-slate-800"
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20 flex justify-center items-end pb-1">
           <div className="w-12 h-1.5 bg-black/30 rounded-full"></div>
        </div>

        {/* Screen */}
        <div className="bg-slate-50 w-full h-[600px] rounded-[2.5rem] overflow-hidden relative flex flex-col pt-12">
          {/* Status bar mock */}
          <div className="absolute top-3 right-5 flex space-x-2 opacity-50">
             <div className="w-4 h-3 bg-slate-800 rounded-[1px]"></div>
             <div className="w-5 h-3 bg-slate-800 rounded-[2px]"></div>
          </div>

          <div className="flex-1 px-4 flex flex-col">
            <div className="text-center mb-6 pt-4">
              <Smartphone className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-slate-600 text-sm uppercase tracking-widest">{currentScenario.scenarioType.replace('_', ' ')}</h3>
            </div>

            {/* Notification Bubble */}
            <div className="bg-white p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] mb-auto mt-4 border border-slate-100">
              <div className="flex items-center space-x-3 mb-3 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">i</span>
                </div>
                <h4 className="font-bold text-slate-800">{currentScenario.title}</h4>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">{currentScenario.scenarioText}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pb-8 px-2">
              <button 
                onClick={() => handleAnswer(true)}
                disabled={!!feedback || processing}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Mark as Safe</span>
              </button>
              
              <button 
                onClick={() => handleAnswer(false)}
                disabled={!!feedback || processing}
                className="w-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>Report as Fraud</span>
              </button>
            </div>
          </div>

          {/* Feedback Overlay inside Phone */}
          <AnimatePresence>
            {feedback && (
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute inset-x-0 bottom-0 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-3xl p-6 z-30"
              >
                <div className="flex items-center space-x-3 mb-4">
                  {feedback.correct ? (
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  ) : (
                    <XCircle className="w-8 h-8 text-danger" />
                  )}
                  <h3 className={`text-2xl font-black ${feedback.correct ? 'text-success' : 'text-danger'}`}>
                    {feedback.correct ? 'Correct!' : 'Watch Out!'}
                  </h3>
                </div>
                
                <p className="text-slate-700 font-medium mb-6 leading-relaxed">
                  {feedback.explanation}
                </p>

                {feedback.correct && feedback.xpAwarded > 0 && (
                  <div className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-lg inline-block mb-6">
                    +{feedback.xpAwarded} XP
                  </div>
                )}

                <Button className="game-btn-primary w-full h-14" onClick={handleNext}>
                  {currentIndex + 1 < scenarios.length ? 'Next Scenario' : 'Finish Session'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* HUD Info */}
      <div className="mt-8 text-center text-text-secondary font-bold">
        Scenario {currentIndex + 1} of {scenarios.length}
      </div>
    </div>
  );
}
