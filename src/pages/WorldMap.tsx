import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VillageMap } from '../components/ui/VillageMap';
import { WorldCamera } from '../components/ui/WorldCamera';
import { useGameState } from '../lib/gameState';

const LOCATIONS = {
  academy: { x: 58, y: 28 },
  market: { x: 65, y: 48 },
  investment: { x: 75, y: 35 },
  life: { x: 85, y: 45 },
  security: { x: 48, y: 15 },
  social: { x: 30, y: 50 },
};

export function WorldMap() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [focusedLocation] = useState<string | null>(null);
  const [quizDistrict, setQuizDistrict] = useState<string | null>(null);
  const { districts } = useGameState();

  const handleLocationClick = (id: string) => {
    const district = districts.find(d => d.id === id);
    if (district && !district.locked) {
      window.dispatchEvent(new CustomEvent('trigger-transition', { detail: { path: district.path } }));
    }
  };

  const handleQuizClick = (id: string) => {
    setQuizDistrict(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute inset-0 w-full h-full bg-[#55B84A] overflow-hidden flex flex-col font-sans"
    >
      {/* The Hero Map Component with Camera */}
      <div className="relative flex-1 w-full h-full">
        <WorldCamera focusedLocation={focusedLocation} locations={LOCATIONS}>
          <VillageMap 
            mini={false} 
            activeHover={hoveredLocation} 
            setActiveHover={setHoveredLocation} 
            onLocationClick={handleLocationClick}
            onQuizClick={handleQuizClick}
          />
        </WorldCamera>
      </div>

      {/* Contextual Information Panel (Bottom Left) */}
      <AnimatePresence>
        {hoveredLocation && districts.find(d => d.id === hoveredLocation) && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: -20 }}
            className="absolute bottom-6 left-6 z-50 w-80 bg-surface border-4 border-border rounded-[2rem] p-6 shadow-[0_20px_40px_rgba(22,58,42,0.2)]"
          >
            {(() => {
              const district = districts.find(d => d.id === hoveredLocation)!;
              return (
                <>
                  <h3 className="font-display font-black text-xl text-text-primary uppercase tracking-wider">
                    {district.name}
                  </h3>
                  <p className="text-sm font-medium text-text-secondary mt-2 mb-4 leading-relaxed">
                    {district.description}
                  </p>
                  
                  {district.locked ? (
                    <div className="bg-background rounded-xl p-3 border-2 border-border/50 text-center">
                      <span className="text-xs font-black text-danger uppercase">LOCKED</span>
                      <p className="text-xs font-bold text-text-secondary mt-1">Reach Level 20 to unlock.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-background rounded-xl p-3 border-2 border-border/50">
                        <span className="text-xs font-black text-text-secondary uppercase">Progress</span>
                        <span className="text-sm font-black text-primary">{district.progress}</span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-background rounded-xl p-3 border-2 border-border/50">
                        <span className="text-xs font-black text-text-secondary uppercase">Market Value</span>
                        <span className="text-sm font-black text-green-600">{district.marketValue}</span>
                      </div>

                      <div className="flex justify-between items-center bg-background rounded-xl p-3 border-2 border-border/50">
                        <span className="text-xs font-black text-text-secondary uppercase">Next Reward</span>
                        <span className="text-sm font-black text-reward">{district.reward}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleLocationClick(hoveredLocation)}
                        className="w-full mt-2 game-btn-primary py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-transform active:scale-95"
                      >
                        Enter
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple Quiz Modal Overlay */}
      <AnimatePresence>
        {quizDistrict && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface border-4 border-border rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setQuizDistrict(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-background border-2 border-border rounded-full flex items-center justify-center font-bold text-text-secondary hover:bg-danger/10 hover:text-danger hover:border-danger transition-colors"
              >
                X
              </button>
              <h2 className="text-2xl font-black text-text-primary mb-2 uppercase tracking-wide">
                Scout Mission: {districts.find(d => d.id === quizDistrict)?.name}
              </h2>
              <p className="text-text-secondary font-medium mb-6">
                Test your knowledge of this district to earn bonus XP and unlock hidden lore!
              </p>
              
              <div className="space-y-4">
                <button className="w-full game-btn-secondary py-4 rounded-xl font-bold text-left px-6 relative overflow-hidden group">
                  <span className="relative z-10">Start Basic Quiz</span>
                  <div className="absolute inset-0 bg-primary/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                </button>
                <button className="w-full game-btn-primary py-4 rounded-xl font-bold text-left px-6 relative overflow-hidden group flex justify-between items-center">
                  <span className="relative z-10">Advanced Challenge</span>
                  <span className="bg-white/20 px-2 py-1 rounded-md text-xs">Level 5+</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </motion.div>
  );
}
