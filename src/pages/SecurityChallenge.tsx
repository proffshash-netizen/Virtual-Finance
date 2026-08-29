import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../lib/gameState';
import { mockSecurityApi } from '../lib/mockSecurityApi';
import type { SecurityAnswer, SecurityScenario, SecurityAttemptResponse } from '../lib/mockSecurityApi';
import { 
  ShieldCheck, ShieldAlert, Search, Smartphone, ArrowRight, CheckCircle2, 
  XCircle, Award, QrCode, KeyRound, PhoneIncoming, 
  TrendingDown, Megaphone, Link, Lock, BatteryFull, Wifi, Signal
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export function SecurityChallenge() {
  const navigate = useNavigate();
  const { addXp, unlockAchievement } = useGameState();
  const [scenarios, setScenarios] = useState<SecurityScenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [breakdown, setBreakdown] = useState({
    safeMistakes: 0,
    fraudMistakes: 0,
    verifyMistakes: 0,
  });
  
  const [feedback, setFeedback] = useState<SecurityAttemptResponse | null>(null);
  const [processing, setProcessing] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    mockSecurityApi.getScenarios().then(data => {
      setScenarios(data);
      setLoading(false);
    });
  }, []);

  const handleAnswer = async (answer: SecurityAnswer) => {
    if (processing || feedback) return;
    setProcessing(true);

    const scenario = scenarios[currentIndex];
    
    try {
      const response = await mockSecurityApi.attemptScenario(scenario.id, answer);
      setFeedback(response);
      
      if (response.correct) {
        setScore(prev => prev + 1);
        addXp(response.xpAwarded);
      } else {
        if (response.correctAnswer === 'safe') {
          setBreakdown(prev => ({ ...prev, safeMistakes: prev.safeMistakes + 1 }));
        } else if (response.correctAnswer === 'fraud') {
          setBreakdown(prev => ({ ...prev, fraudMistakes: prev.fraudMistakes + 1 }));
        } else if (response.correctAnswer === 'verify') {
          setBreakdown(prev => ({ ...prev, verifyMistakes: prev.verifyMistakes + 1 }));
        }
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
      unlockAchievement('fraud_spotter');
    }
  };

  if (loading) {
    return (
      <div className="absolute inset-0 bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#F4E4BC]"></div>
      </div>
    );
  }

  if (sessionComplete) {
    const winRate = score / scenarios.length;
    const earnedBadge = winRate >= 0.8;

    return (
      <div className="absolute inset-0 bg-transparent overflow-y-auto pt-16 px-4 pb-32">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="medieval-parchment rounded-[32px] p-10 shadow-2xl text-center relative overflow-hidden"
          >
            {/* Decorative background element */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8D6E63]/10 rounded-full pointer-events-none"></div>
            
            <div className="w-24 h-24 bg-[#E8DFCD] rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 border-2 border-[#8D6E63]/50 shadow-inner">
              <ShieldCheck className="w-12 h-12 text-[#3C8533]" />
            </div>
            
            <h2 className="medieval-wood-plaque px-8 py-3 rounded-xl text-4xl font-display font-black mb-6 text-center uppercase tracking-wide inline-block shadow-lg">Session Complete</h2>
            <p className="text-[#5D4037] text-lg font-bold mb-8">You correctly identified {score} out of {scenarios.length} scenarios.</p>

            <div className="bg-[#E8DFCD] rounded-2xl p-6 mb-8 border-2 border-[#8D6E63]/50 text-left shadow-inner">
              <h3 className="font-black text-[#3E2723] uppercase tracking-wider text-base mb-4 border-b-2 border-[#8D6E63]/30 pb-2">Analysis Breakdown</h3>
              <ul className="space-y-4 text-lg">
                <li className="flex justify-between items-center">
                  <span className="font-bold text-[#5D4037]">False Alarms (Safe marked Fraud/Verify):</span>
                  <span className="font-black text-[#3E2723]">{breakdown.safeMistakes}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-bold text-[#5D4037]">Missed Frauds (Fraud marked Safe/Verify):</span>
                  <span className="font-black text-danger">{breakdown.fraudMistakes}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-bold text-[#5D4037]">Missed Verifications (Didn't verify when needed):</span>
                  <span className="font-black text-warning">{breakdown.verifyMistakes}</span>
                </li>
              </ul>
            </div>

            {earnedBadge && (
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-400 p-8 rounded-2xl mb-8 transform hover:-translate-y-1 transition-transform shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-amber-200/50 rounded-full blur-xl pointer-events-none"></div>
                <Award className="w-16 h-16 text-amber-500 mx-auto mb-3 relative z-10 drop-shadow-md" />
                <h3 className="text-2xl font-black text-amber-900 mb-1 relative z-10 uppercase tracking-wide">Fraud Spotter</h3>
                <p className="font-bold text-amber-700 relative z-10">Awarded for high accuracy in identifying scams.</p>
              </div>
            )}

            <Button className="game-btn-primary w-full h-16 text-xl font-bold tracking-wider uppercase" onClick={() => navigate('/world')}>
              Return to Map
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentScenario = scenarios[currentIndex];

  const getScenarioIcon = () => {
    switch(currentScenario.scenarioType) {
      case 'upi_request': return <QrCode className="w-10 h-10 text-emerald-600 drop-shadow-sm" />;
      case 'otp_share': return <KeyRound className="w-10 h-10 text-amber-600 drop-shadow-sm" />;
      case 'caller_spam': return <PhoneIncoming className="w-10 h-10 text-blue-600 drop-shadow-sm" />;
      case 'stock_scam': return <TrendingDown className="w-10 h-10 text-rose-600 drop-shadow-sm" />;
      case 'ad_scam': return <Megaphone className="w-10 h-10 text-purple-600 drop-shadow-sm" />;
      case 'phishing_link': return <Link className="w-10 h-10 text-cyan-600 drop-shadow-sm" />;
      default: return <Smartphone className="w-10 h-10 text-border" />;
    }
  };

  const getScenarioAnimation = (): any => {
    switch(currentScenario.scenarioType) {
      case 'caller_spam': 
        return { animate: { rotate: [-5, 5, -5, 5, 0], scale: [1, 1.1, 1] }, transition: { repeat: Infinity, duration: 1.5, repeatDelay: 1 } as any };
      case 'phishing_link':
      case 'otp_share':
        return { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.5 } as any };
      case 'upi_request':
        return { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: 'spring' as const, bounce: 0.5 } as any };
      default:
        return { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4 } as any };
    }
  };

  return (
    <div className="absolute inset-0 bg-transparent overflow-y-auto">
      {/* Background Watermark */}
      <div className="fixed bottom-0 right-0 opacity-5 pointer-events-none -z-10 overflow-hidden translate-x-1/4 translate-y-1/4">
        <Lock className="w-[600px] h-[600px] text-[#3E2723]" />
      </div>

      <div className="max-w-6xl mx-auto pt-8 md:pt-16 px-4 pb-32 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-16 min-h-full">
        
        {/* Narrative Context Section */}
        <motion.div 
          key={`narrative-${currentScenario.id}`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-[480px] lg:mt-12 mb-8 lg:mb-0 medieval-parchment rounded-2xl p-6 shadow-lg relative border-[3px] border-[#8D6E63]"
        >
          {/* Decorative scroll pin */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#271510] border-2 border-[#4A2D23] rounded-full flex items-center justify-center shadow-md z-10">
            <div className="w-2 h-2 bg-[#8D6E63] rounded-full"></div>
          </div>
          
          <div className="flex items-start space-x-5 mt-2">
            <div className="w-20 h-20 shrink-0 bg-[#E8DFCD] border-2 border-[#8D6E63]/50 rounded-2xl flex items-center justify-center relative overflow-hidden group shadow-inner">
              <div className="absolute inset-0 bg-[#8D6E63]/5 group-hover:bg-[#8D6E63]/10 transition-colors"></div>
              <motion.div {...getScenarioAnimation()}>
                {getScenarioIcon()}
              </motion.div>
            </div>
            <div>
              <h3 className="font-display font-black text-[#8D6E63] uppercase tracking-wide text-base mb-2">
                Scenario Context
              </h3>
              <p className="text-[#3E2723] font-bold leading-relaxed text-lg">
                {currentScenario.narrativeSetup}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Interactive Phone Section */}
        <div className="flex flex-col items-center justify-center w-full lg:w-auto h-[80vh] max-h-[850px] min-h-[600px]">
          {/* iPhone Wrapper */}
        <motion.div 
          key={currentScenario.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="h-full w-auto aspect-[9/19.5] bg-[#1a1a1a] rounded-[3.5rem] p-3 shadow-2xl relative border-4 border-[#333] flex flex-col"
        >
          {/* Hardware Buttons */}
          <div className="absolute top-32 -left-[6px] w-[6px] h-14 bg-[#333] rounded-l-md"></div>
          <div className="absolute top-52 -left-[6px] w-[6px] h-14 bg-[#333] rounded-l-md"></div>
          <div className="absolute top-40 -right-[6px] w-[6px] h-20 bg-[#333] rounded-r-md"></div>

          {/* Screen Content - Native iOS Style */}
          <div className="bg-[#F2F2F7] w-full flex-1 rounded-[3rem] overflow-hidden relative flex flex-col pt-2">

            {/* Status Bar & Dynamic Island */}
            <div className="w-full h-8 flex justify-between items-center px-6 text-[11px] font-bold text-slate-900 z-40 shrink-0">
              <span className="mt-1">9:41</span>
              
              {/* Dynamic Island */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[110px] h-[32px] bg-black rounded-full z-50"></div>
              
              <div className="flex items-center space-x-1.5 mt-1">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <BatteryFull className="w-4 h-4" />
              </div>
            </div>

            {/* Screen Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Scrollable Message Area */}
              <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4 flex flex-col justify-end">
                
                {/* iMessage Style Scenario */}
                <div className="flex flex-col mb-4">
                  {/* Sender Info / Category */}
                  <div className="flex items-center space-x-2 mb-1 px-14">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {currentScenario.scenarioType.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Message Row */}
                  <div className="flex items-end space-x-2">
                    {/* Sender Avatar */}
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                      <div className="scale-75">
                        {getScenarioIcon()}
                      </div>
                    </div>
                    
                    {/* Bubble */}
                    <motion.div 
                      {...getScenarioAnimation()}
                      className="bg-[#E9E9EB] px-4 py-3 rounded-[20px] rounded-bl-[4px] relative max-w-[85%] self-start"
                    >
                      <h4 className="font-bold text-black text-[15px] leading-tight mb-1">{currentScenario.title}</h4>
                      <p className="text-black font-medium leading-relaxed text-[15px]">
                        {currentScenario.messageContent}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Fixed at Bottom */}
              <div className="space-y-3 px-5 pb-8 pt-4 shrink-0 relative z-10 bg-white border-t border-slate-200 mt-2">
                <button 
                  onClick={() => handleAnswer('safe')}
                  disabled={!!feedback || processing}
                  className="w-full bg-[#E8DFCD] border-4 border-[#3C8533] hover:bg-[#3C8533]/10 text-[#3C8533] font-black py-3.5 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center space-x-3 uppercase tracking-wider text-base shadow-sm"
                >
                  <ShieldCheck className="w-6 h-6" />
                  <span>This is Safe</span>
                </button>
                
                <button 
                  onClick={() => handleAnswer('verify')}
                  disabled={!!feedback || processing}
                  className="w-full bg-[#E8DFCD] border-4 border-amber-500 hover:bg-amber-500/10 text-amber-700 font-black py-3.5 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center space-x-3 uppercase tracking-wider text-base shadow-sm"
                >
                  <Search className="w-6 h-6" />
                  <span>Verify First</span>
                </button>

                <button 
                  onClick={() => handleAnswer('fraud')}
                  disabled={!!feedback || processing}
                  className="w-full bg-[#E8DFCD] border-4 border-danger hover:bg-danger/10 text-danger font-black py-3.5 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center space-x-3 uppercase tracking-wider text-base shadow-sm"
                >
                  <ShieldAlert className="w-6 h-6" />
                  <span>This is Fraud</span>
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
                  className="absolute inset-0 bg-[#F2F2F7] z-50 flex flex-col p-8 overflow-y-auto"
                >
                  <div className="mt-10 mb-8 text-center">
                    {feedback.correct ? (
                      <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-success/30">
                        <CheckCircle2 className="w-12 h-12 text-success" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-danger/30">
                        <XCircle className="w-12 h-12 text-danger" />
                      </div>
                    )}
                    <h3 className={`text-4xl font-display font-black uppercase tracking-wider ${feedback.correct ? 'text-success' : 'text-danger'}`}>
                      {feedback.correct ? 'Correct!' : 'Incorrect'}
                    </h3>
                  </div>
                  
                  <div className="bg-white rounded-3xl p-6 mb-8 border border-slate-200 flex-1 shadow-sm">
                    <p className="text-slate-800 text-base font-bold leading-relaxed">
                      {feedback.explanation}
                    </p>
                  </div>

                  {feedback.correct && feedback.xpAwarded > 0 && (
                    <div className="bg-primary/10 text-primary border-2 border-primary/30 font-black px-8 py-4 rounded-2xl flex items-center justify-center mb-8 w-max mx-auto shadow-sm text-lg">
                      <Award className="w-6 h-6 mr-2" />
                      +{feedback.xpAwarded} XP
                    </div>
                  )}

                  <div className="mt-auto pb-6">
                    <Button className="game-btn-primary w-full h-16 text-xl font-bold uppercase tracking-wider" onClick={handleNext}>
                      {currentIndex + 1 < scenarios.length ? 'Next Scenario' : 'Finish Session'}
                      <ArrowRight className="w-6 h-6 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* HUD Info */}
        <div className="mt-8 text-center w-full">
          <div className="inline-block medieval-wood-plaque border-2 border-[#271510] px-5 py-2 rounded-full shadow-md">
            <span className="text-[#F4E4BC] font-black uppercase tracking-widest text-sm drop-shadow-sm">
              Scenario {currentIndex + 1} of {scenarios.length}
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
