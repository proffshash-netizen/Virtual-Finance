import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { STUDY_PATHS } from '../lib/studyData';

export function StudyDistrict() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Hero Section */}
      <div className="medieval-parchment rounded-[40px] border-[3px] border-[#8D6E63] p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#E8DFCD] border-[4px] border-[#8D6E63] overflow-hidden shrink-0 shadow-inner">
          {/* Character Avatar */}
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=E6F0F9" 
            alt="Guide" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-[#E8DFCD] px-4 py-2 rounded-full border-2 border-[#8D6E63]/50 shadow-inner mb-4">
            <GraduationCap className="w-5 h-5 text-[#3E2723]" />
            <span className="font-black text-[#5D4037] text-sm uppercase tracking-widest">STUDY 🎓</span>
          </div>
          <div>
            <h1 className="medieval-wood-plaque px-5 py-2 rounded-xl font-display font-black text-3xl md:text-4xl uppercase tracking-wider mb-4 inline-block shadow-lg">
              Welcome to Study!
            </h1>
          </div>
          <p className="text-lg font-bold text-[#3E2723] leading-relaxed">
            "Understand money. Make smarter decisions. Build your world. This is where we'll turn confusing money topics into things you can actually understand."
          </p>
        </div>
      </div>

      {/* Progress Bar overall */}
      <div className="medieval-parchment p-6 rounded-[32px] border-[3px] border-[#8D6E63] shadow-md flex items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="font-black text-[#3E2723] text-sm uppercase tracking-wider mb-2">Your Knowledge Progress</h3>
          <div className="w-full h-4 bg-[#E8DFCD] rounded-full overflow-hidden border-2 border-[#8D6E63]/50 relative shadow-inner">
            <div className="absolute top-0 left-0 h-full bg-[#3C8533]" style={{ width: '15%' }}></div>
          </div>
        </div>
        <div className="text-right">
          <span className="font-black text-[#3E2723] text-2xl">15%</span>
          <p className="text-[10px] font-bold text-[#8D6E63] uppercase">Mastered</p>
        </div>
      </div>

      {/* Learning Paths */}
      <div>
        <h2 className="font-display font-black text-2xl text-[#3E2723] drop-shadow-sm uppercase tracking-widest mb-6 px-4">
          Learning Paths
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDY_PATHS.map((path, index) => {
            const isCompleted = index === 0; // Fake state for demo purposes
            
            return (
              <motion.div
                key={path.id}
                whileHover={!path.locked ? { y: -5 } : {}}
                className={`relative rounded-[32px] border-[3px] p-6 flex flex-col h-full transition-shadow ${
                  path.locked 
                    ? 'bg-[#E8DFCD]/70 border-[#8D6E63]/30 grayscale opacity-80' 
                    : isCompleted 
                      ? 'medieval-parchment border-[#3C8533] shadow-md'
                      : 'medieval-parchment border-[#8D6E63] shadow-md hover:shadow-xl cursor-pointer'
                }`}
                onClick={() => !path.locked && navigate(`/study/${path.lesson.id}`)}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 rounded-[20px] bg-[#FFFAEE] border-2 border-[#8D6E63]/50 flex items-center justify-center text-3xl shadow-inner">
                    {path.icon}
                  </div>
                  {path.locked ? (
                    <div className="bg-[#E8DFCD] p-2 rounded-full border-2 border-[#8D6E63]/30">
                      <Lock className="w-4 h-4 text-[#8D6E63]" />
                    </div>
                  ) : isCompleted ? (
                    <div className="bg-[#3C8533] p-2 rounded-full border-2 border-[#2A5E24]">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  ) : null}
                </div>
                
                {/* Content */}
                <h3 className="font-black text-[#3E2723] text-lg uppercase tracking-wider mb-2 leading-tight">
                  {path.title}
                </h3>
                <p className="text-sm font-bold text-[#5D4037] mb-6 flex-1">
                  {path.description}
                </p>
                
                {/* Footer Meta */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-[#8D6E63]/30">
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-black text-[#5D4037] uppercase bg-[#E8DFCD] border border-[#8D6E63]/30 shadow-inner px-2 py-1 rounded-md">
                      {path.difficulty}
                    </span>
                    <span className="text-[10px] font-black text-[#5D4037] uppercase flex items-center">
                      ⏱ {path.timeEstimate}
                    </span>
                  </div>
                  
                  {!path.locked && (
                    <span className="text-xs font-black text-amber-700 flex items-center bg-amber-500/20 border border-amber-600/30 px-2 py-1 rounded-md shadow-inner">
                      +{path.rewardXP} XP
                    </span>
                  )}
                </div>

                {/* Hover Play Icon overlay */}
                {!path.locked && !isCompleted && (
                  <div className="absolute inset-0 bg-[#8D6E63]/0 hover:bg-[#8D6E63]/10 transition-colors rounded-[28px] flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="bg-[#E8DFCD] p-3 rounded-full border-[3px] border-[#8D6E63] text-[#3E2723] shadow-lg transform translate-y-4">
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
