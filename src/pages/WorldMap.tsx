import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { VillageMap } from '../components/ui/VillageMap';
import { WorldCamera } from '../components/ui/WorldCamera';
import { useGameState } from '../lib/gameState';

const LOCATIONS = {
  academy: { x: 29, y: 32 },
  market: { x: 74, y: 32 },
  investment: { x: 21, y: 72 },
  life: { x: 78, y: 72 },
  security: { x: 50, y: 20 },
  social: { x: 80, y: 20 },
};

export function WorldMap() {
  const navigate = useNavigate();
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [focusedLocation, setFocusedLocation] = useState<string | null>(null);
  const { districts } = useGameState();

  const handleLocationClick = (id: string) => {
    const district = districts.find(d => d.id === id);
    if (district && !district.locked) {
      setFocusedLocation(id);
      setTimeout(() => {
        navigate(district.path);
      }, 1200); // Wait for zoom transition
    }
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
      
    </motion.div>
  );
}
