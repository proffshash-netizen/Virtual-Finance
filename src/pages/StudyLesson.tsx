import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, XCircle, Trophy, Home } from 'lucide-react';
import { STUDY_PATHS } from '../lib/studyData';
import { useGameState } from '../lib/gameState';
import { StudyVisualRenderer } from '../components/study/StudyVisuals';

export function StudyLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { addXp, showToast } = useGameState();
  
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  // Find the lesson
  const path = STUDY_PATHS.find(p => p.lesson.id === lessonId);
  const lesson = path?.lesson;

  // Reset state when lesson changes
  useEffect(() => {
    setCurrentPartIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
  }, [lessonId]);

  if (!lesson || !path) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="font-display font-black text-2xl text-[#3E2723]">Lesson Not Found</h2>
        <button onClick={() => navigate('/study')} className="medieval-button-primary px-6 py-2 rounded-xl">Go Back</button>
      </div>
    );
  }

  const part = lesson.parts[currentPartIndex];
  const isLastPart = currentPartIndex === lesson.parts.length - 1;
  const progress = ((currentPartIndex + 1) / lesson.parts.length) * 100;

  const handleNext = () => {
    if (isLastPart) {
      addXp(path.rewardXP);
      showToast('Lesson Complete!', `Earned ${path.rewardXP} XP`, 'reward');
      navigate('/study');
    } else {
      setCurrentPartIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (isAnswerRevealed) return;
    setSelectedOption(optionId);
    setIsAnswerRevealed(true);
    
    // Add small XP for correct answer
    const option = part.options?.find(o => o.id === optionId);
    if (option?.isCorrect) {
      addXp(10);
    }
  };

  const renderPartContent = () => {
    switch (part.type) {
      case 'hook':
        return (
          <div className="flex flex-col items-center text-center space-y-8 mt-12">
            <div className="w-24 h-24 rounded-full bg-[#E8DFCD] border-[4px] border-[#3C8533] flex items-center justify-center shadow-inner">
              <span className="text-4xl">🤔</span>
            </div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-[#3E2723] uppercase leading-snug max-w-xl drop-shadow-sm">
              {part.content}
            </h2>
          </div>
        );
        
      case 'explanation':
        return (
          <div className="flex flex-col items-center space-y-8 mt-8 w-full max-w-2xl mx-auto">
            <div className="medieval-parchment p-8 rounded-[32px] border-[3px] border-[#8D6E63] text-center shadow-lg relative w-full">
              {/* Character hint */}
              <div className="absolute -top-10 -left-6 w-20 h-20 rounded-full border-[4px] border-[#8D6E63] bg-[#E8DFCD] overflow-hidden shadow-md">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=E6F0F9" alt="Guide" className="w-full h-full object-cover" />
              </div>
              <p className="text-lg font-bold text-[#3E2723] mt-6 leading-relaxed">
                {part.content}
              </p>
            </div>
          </div>
        );

      case 'visual':
        return (
          <div className="w-full mt-8">
             {part.visualId && <StudyVisualRenderer visualId={part.visualId} />}
          </div>
        );

      case 'real-life':
        return (
          <div className="flex flex-col items-center space-y-6 mt-8 w-full max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-[#E8DFCD] px-4 py-2 rounded-full border-2 border-[#8D6E63]/50 shadow-inner">
              <span className="text-xl">🌍</span>
              <span className="font-black text-[#5D4037] text-sm uppercase tracking-widest">REAL LIFE</span>
            </div>
            <div className="medieval-parchment p-8 rounded-[32px] border-[3px] border-[#8D6E63] text-center shadow-lg">
              <p className="text-lg font-bold text-[#3E2723] leading-relaxed whitespace-pre-wrap">
                {part.content}
              </p>
            </div>
          </div>
        );

      case 'game-example':
        return (
          <div className="flex flex-col items-center space-y-6 mt-8 w-full max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-[#3C8533]/10 px-4 py-2 rounded-full border-2 border-[#3C8533]">
              <span className="text-xl">🎮</span>
              <span className="font-black text-[#3C8533] text-sm uppercase tracking-widest drop-shadow-sm">FINLIT SIMULATION</span>
            </div>
            <div className="medieval-parchment p-8 rounded-[32px] border-[3px] border-[#3C8533] text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#3C8533]"></div>
              <p className="text-lg font-bold text-[#3E2723] leading-relaxed">
                {part.content}
              </p>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="flex flex-col items-center space-y-8 mt-8 w-full max-w-2xl mx-auto">
            <h3 className="font-display font-black text-xl text-[#3E2723] uppercase text-center drop-shadow-sm">
              {part.question}
            </h3>
            <div className="space-y-4 w-full">
              {part.options?.map((option) => {
                const isSelected = selectedOption === option.id;
                const showStatus = isAnswerRevealed;
                
                let btnClass = "w-full text-left p-4 rounded-[24px] border-[3px] font-bold text-sm transition-all shadow-sm ";
                
                if (showStatus) {
                  if (option.isCorrect) {
                    btnClass += isSelected ? "bg-[#3C8533] text-white border-[#2A5E24]" : "bg-[#3C8533]/20 border-[#3C8533] text-[#3E2723]";
                  } else {
                    btnClass += isSelected ? "bg-danger text-white border-[#8D1D1D]" : "bg-[#E8DFCD]/50 border-[#8D6E63] text-[#8D6E63] opacity-50";
                  }
                } else {
                  btnClass += "bg-[#E8DFCD] border-[#8D6E63] hover:border-[#5D4037] hover:bg-[#F4E4BC] hover:-translate-y-1 text-[#3E2723]";
                }

                return (
                  <div key={option.id} className="w-full">
                    <button 
                      onClick={() => handleOptionSelect(option.id)}
                      disabled={isAnswerRevealed}
                      className={btnClass}
                    >
                      <div className="flex justify-between items-center">
                        <span>{option.text}</span>
                        {showStatus && option.isCorrect && <CheckCircle2 className="w-5 h-5" />}
                        {showStatus && isSelected && !option.isCorrect && <XCircle className="w-5 h-5" />}
                      </div>
                    </button>
                    {/* Explanation Reveal */}
                    <AnimatePresence>
                      {showStatus && isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                          className="bg-[#E8DFCD] p-4 rounded-xl border-2 border-[#8D6E63]/50 border-l-[6px] border-l-[#3C8533] shadow-inner"
                        >
                          <p className="text-xs font-bold text-[#3E2723]">
                            {option.explanation}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        );
        
      case 'challenge':
        return (
           <div className="w-full mt-8">
             {part.visualId && <StudyVisualRenderer visualId={part.visualId} />}
           </div>
        );

      case 'takeaway':
        return (
          <div className="flex flex-col items-center space-y-6 mt-8 w-full max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 shadow-inner">
              <Trophy className="w-10 h-10 text-amber-700 drop-shadow-sm" />
            </div>
            <h2 className="font-display font-black text-2xl text-[#3E2723] uppercase tracking-widest text-center drop-shadow-sm">
              Key Takeaway
            </h2>
            <div className="medieval-parchment p-8 rounded-[32px] border-[4px] border-amber-600/60 text-center shadow-xl w-full">
              <p className="text-xl font-black text-[#3E2723] leading-relaxed">
                {part.content}
              </p>
            </div>
          </div>
        );

      default:
        return <div>Unknown part type</div>;
    }
  };

  const isNextDisabled = part.type === 'quiz' && !isAnswerRevealed;

  return (
    <div className="min-h-full max-w-4xl mx-auto flex flex-col relative pb-32">
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#E8DFCD]/95 backdrop-blur-md p-4 rounded-b-[32px] border-x-[3px] border-b-[3px] border-[#8D6E63] shadow-lg flex items-center justify-between mx-4 mt-0">
        <button 
          onClick={() => navigate('/study')}
          className="w-10 h-10 rounded-full bg-[#F4E4BC] border-2 border-[#8D6E63] flex items-center justify-center hover:bg-[#E8DFCD] transition-colors text-[#5D4037] shadow-sm"
        >
          <Home className="w-5 h-5" />
        </button>
        
        <div className="flex-1 px-8">
           <div className="flex justify-between items-end mb-2">
             <span className="font-black text-[#8D6E63] text-[10px] uppercase tracking-widest">
               {path.title} • {lesson.title}
             </span>
             <span className="font-black text-[#3C8533] text-[10px] uppercase drop-shadow-sm">
               {currentPartIndex + 1} / {lesson.parts.length}
             </span>
           </div>
           <div className="w-full h-2 bg-[#F4E4BC] rounded-full overflow-hidden border border-[#8D6E63]/30 shadow-inner">
             <motion.div 
               className="h-full bg-[#3C8533]"
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               transition={{ duration: 0.3 }}
             />
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPartIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full"
          >
            {renderPartContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#F5F1E7] via-[#F5F1E7]/90 to-transparent z-20 pointer-events-none">
        <div className="max-w-4xl mx-auto flex justify-between items-center pointer-events-auto">
          
          <button 
            onClick={() => setCurrentPartIndex(prev => prev - 1)}
            disabled={currentPartIndex === 0}
            className={`w-14 h-14 rounded-full border-[3px] border-[#8D6E63] flex items-center justify-center transition-all shadow-md ${
              currentPartIndex === 0 ? 'opacity-0 cursor-default' : 'bg-[#E8DFCD] hover:bg-[#F4E4BC] text-[#5D4037] active:scale-95'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={handleNext}
            disabled={isNextDisabled}
            className={`flex items-center justify-between px-8 py-4 rounded-[24px] border-4 border-b-[6px] transition-all shadow-lg ${
              isNextDisabled 
                ? 'bg-[#E8DFCD] border-[#8D6E63] text-[#8D6E63] opacity-50 cursor-not-allowed'
                : isLastPart 
                  ? 'bg-amber-500 border-amber-700 text-white hover:brightness-110 active:scale-95 active:border-b-4 active:translate-y-[2px]'
                  : 'bg-[#3C8533] border-[#2A5E24] text-white hover:brightness-110 active:scale-95 active:border-b-4 active:translate-y-[2px]'
            }`}
          >
            <span className="font-black text-sm uppercase tracking-wider mr-4">
              {isLastPart ? 'Complete Lesson' : 'Continue'}
            </span>
            {isLastPart ? <CheckCircle2 className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
          
        </div>
      </div>
      
    </div>
  );
}
