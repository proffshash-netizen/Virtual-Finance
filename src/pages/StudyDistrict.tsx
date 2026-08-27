import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { STUDY_PATHS } from '../lib/studyData';

export function StudyDistrict() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Hero Section */}
      <div className="bg-surface-alt rounded-[40px] border-4 border-border p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-surface border-4 border-border overflow-hidden shrink-0 shadow-[inset_0_-8px_rgba(0,0,0,0.05)]">
          {/* Character Avatar */}
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=E6F0F9" 
            alt="Guide" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-surface px-4 py-2 rounded-full border-2 border-border mb-4">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="font-black text-text-primary text-sm uppercase tracking-widest">STUDY 🎓</span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-text-primary uppercase tracking-wider mb-2">
            Welcome to Study!
          </h1>
          <p className="text-base font-bold text-text-secondary">
            "Understand money. Make smarter decisions. Build your world. This is where we'll turn confusing money topics into things you can actually understand."
          </p>
        </div>
      </div>

      {/* Progress Bar overall */}
      <div className="bg-surface p-6 rounded-[32px] border-4 border-border shadow-sm flex items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="font-black text-text-primary text-sm uppercase tracking-wider mb-2">Your Knowledge Progress</h3>
          <div className="w-full h-4 bg-background rounded-full overflow-hidden border-2 border-border relative">
            <div className="absolute top-0 left-0 h-full bg-primary" style={{ width: '15%' }}></div>
          </div>
        </div>
        <div className="text-right">
          <span className="font-black text-primary text-2xl">15%</span>
          <p className="text-[10px] font-bold text-text-secondary uppercase">Mastered</p>
        </div>
      </div>

      {/* Learning Paths */}
      <div>
        <h2 className="font-display font-black text-xl text-text-primary uppercase tracking-widest mb-6 px-4">
          Learning Paths
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDY_PATHS.map((path, index) => {
            const isCompleted = index === 0; // Fake state for demo purposes
            
            return (
              <motion.div
                key={path.id}
                whileHover={!path.locked ? { y: -5 } : {}}
                className={`relative rounded-[32px] border-4 p-6 flex flex-col h-full transition-shadow ${
                  path.locked 
                    ? 'bg-surface-alt/50 border-border/50 grayscale' 
                    : isCompleted 
                      ? 'bg-surface border-success shadow-sm'
                      : 'bg-surface border-border shadow-sm hover:shadow-md cursor-pointer'
                }`}
                onClick={() => !path.locked && navigate(`/study/${path.lesson.id}`)}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 rounded-[20px] bg-background border-2 border-border flex items-center justify-center text-3xl shadow-[inset_0_-4px_rgba(0,0,0,0.1)]">
                    {path.icon}
                  </div>
                  {path.locked ? (
                    <div className="bg-surface-alt p-2 rounded-full border-2 border-border/50">
                      <Lock className="w-4 h-4 text-text-secondary" />
                    </div>
                  ) : isCompleted ? (
                    <div className="bg-success p-2 rounded-full border-2 border-[#228C3B]">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  ) : null}
                </div>
                
                {/* Content */}
                <h3 className="font-black text-text-primary text-lg uppercase tracking-wider mb-2 leading-tight">
                  {path.title}
                </h3>
                <p className="text-sm font-bold text-text-secondary mb-6 flex-1">
                  {path.description}
                </p>
                
                {/* Footer Meta */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-border/50">
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-black text-text-secondary uppercase bg-surface-alt px-2 py-1 rounded-md">
                      {path.difficulty}
                    </span>
                    <span className="text-[10px] font-black text-text-secondary uppercase flex items-center">
                      ⏱ {path.timeEstimate}
                    </span>
                  </div>
                  
                  {!path.locked && (
                    <span className="text-xs font-black text-reward flex items-center bg-reward/10 px-2 py-1 rounded-md">
                      +{path.rewardXP} XP
                    </span>
                  )}
                </div>

                {/* Hover Play Icon overlay */}
                {!path.locked && !isCompleted && (
                  <div className="absolute inset-0 bg-primary/0 hover:bg-primary/5 transition-colors rounded-[28px] flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="bg-surface p-3 rounded-full border-4 border-primary text-primary shadow-lg transform translate-y-4">
                      <PlayCircle className="w-8 h-8" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
