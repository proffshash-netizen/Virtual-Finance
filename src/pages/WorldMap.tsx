import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, TrendingUp, Building2, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

const districts = [
  {
    id: 'academy',
    name: 'Fin Academy',
    description: 'Financial learning and curriculum.',
    icon: GraduationCap,
    path: '/academy',
    color: 'from-cyan-500 to-violet-500',
    glowColor: 'rgba(124,92,255,0.6)',
    position: { top: '15%', left: '20%' },
    progress: '3/10 Modules',
  },
  {
    id: 'investment',
    name: 'Investment District',
    description: 'Portfolio, assets and wealth management.',
    icon: TrendingUp,
    path: '/investment',
    color: 'from-green-400 to-emerald-600',
    glowColor: 'rgba(34,197,94,0.6)',
    position: { top: '25%', right: '20%' },
    progress: '+12.4% Return',
  },
  {
    id: 'market',
    name: 'Market City',
    description: 'Economic conditions and market simulation.',
    icon: Building2,
    path: '/market',
    color: 'from-cyan-400 to-blue-600',
    glowColor: 'rgba(0,212,255,0.6)',
    position: { bottom: '25%', left: '25%' },
    progress: 'Market Open',
  },
  {
    id: 'life',
    name: 'Life Hub',
    description: 'Missions, achievements, and player identity.',
    icon: Trophy,
    path: '/life',
    color: 'from-amber-400 to-orange-500',
    glowColor: 'rgba(245,185,66,0.6)',
    position: { bottom: '15%', right: '25%' },
    progress: 'Level 18',
  }
];

export function WorldMap() {
  const navigate = useNavigate();
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute inset-0 w-full h-full bg-[#080B14] overflow-hidden flex items-center justify-center"
    >
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 z-0 opacity-30 bg-cover bg-center mix-blend-screen"
        style={{ backgroundImage: 'url(/bg-city.png)', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background backdrop-blur-sm"></div>
      </div>

      {/* 2.5D Container */}
      <div 
        className="relative w-full max-w-[1200px] h-[800px] z-10"
        style={{
          perspective: '1400px',
        }}
      >
        <motion.div 
          className="absolute inset-0 w-full h-full"
          initial={{ rotateX: 60, rotateZ: -10, y: 100 }}
          animate={{ rotateX: 55, rotateZ: 0, y: 50 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Base Grid Layer */}
          <div className="absolute inset-0 rounded-full border border-primary/20 bg-black/60 backdrop-blur-md shadow-[0_0_150px_rgba(124,92,255,0.15)] flex items-center justify-center">
            
            {/* Connection Paths (Abstract SVG) */}
            <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 1200 800">
               {/* Academy path */}
               <path d="M600,400 L240,120" stroke="rgba(124,92,255,0.8)" strokeWidth="3" strokeDasharray="10,10" className="animate-[dash_20s_linear_infinite]" />
               {/* Investment path */}
               <path d="M600,400 L960,200" stroke="rgba(34,197,94,0.8)" strokeWidth="3" strokeDasharray="10,10" className="animate-[dash_20s_linear_infinite]" />
               {/* Market path */}
               <path d="M600,400 L300,600" stroke="rgba(0,212,255,0.8)" strokeWidth="3" strokeDasharray="10,10" className="animate-[dash_20s_linear_infinite]" />
               {/* Life Hub path */}
               <path d="M600,400 L900,680" stroke="rgba(245,185,66,0.8)" strokeWidth="3" strokeDasharray="10,10" className="animate-[dash_20s_linear_infinite]" />
            </svg>
            
            {/* Central Player Node */}
            <div className="relative w-32 h-32 rounded-full border-4 border-surface bg-background flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] z-20"
                 style={{ transform: 'rotateX(-55deg) translateZ(40px)' }}>
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-50"></div>
              <span className="text-textSecondary text-xs tracking-widest uppercase mb-1">Player</span>
              <span className="font-display font-bold text-xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Lvl 18</span>
            </div>
          </div>

          {/* Districts */}
          {districts.map((district) => (
            <div
              key={district.id}
              className="absolute w-64 h-64 -mt-32 -ml-32 cursor-pointer group z-30"
              style={{ ...district.position }}
              onMouseEnter={() => setHoveredDistrict(district.id)}
              onMouseLeave={() => setHoveredDistrict(null)}
              onClick={() => navigate(district.path)}
            >
              <motion.div
                className="w-full h-full flex flex-col items-center justify-center"
                animate={{
                  y: hoveredDistrict === district.id ? -40 : 0,
                  scale: hoveredDistrict === district.id ? 1.05 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* 3D Platform Base */}
                <div 
                  className={cn(
                    "relative w-40 h-40 rounded-[2rem] backdrop-blur-2xl border-2 transition-all duration-500 flex items-center justify-center shadow-2xl",
                    hoveredDistrict === district.id ? "bg-[#182235]/90 border-white/50" : "bg-black/60 border-white/10"
                  )}
                  style={{
                    boxShadow: hoveredDistrict === district.id 
                      ? `0 30px 60px ${district.glowColor}, inset 0 0 30px ${district.glowColor}` 
                      : `0 15px 35px rgba(0,0,0,0.8), inset 0 0 15px rgba(255,255,255,0.02)`,
                    transform: 'rotateX(-55deg) translateZ(20px)', // Counteract parent rotation for popup effect
                  }}
                >
                  {/* Holographic Icon */}
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${district.color} bg-opacity-20 relative`}>
                    {/* Glowing underlay */}
                    <div className={cn("absolute inset-0 rounded-xl bg-gradient-to-br opacity-50 blur-md", district.color)}></div>
                    <district.icon className="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)] relative z-10" />
                  </div>
                </div>

                {/* Floating Info Panel */}
                <AnimatePresence>
                  {hoveredDistrict === district.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, rotateX: -55, scale: 0.9 }}
                      animate={{ opacity: 1, y: -20, rotateX: -55, scale: 1 }}
                      exit={{ opacity: 0, y: 10, rotateX: -55, scale: 0.9 }}
                      className="absolute -top-36 w-72 p-6 glass-elevated rounded-2xl pointer-events-none text-center border border-white/20 shadow-2xl"
                      style={{ transformOrigin: 'bottom' }}
                    >
                      <h3 className="font-display font-bold text-xl text-white tracking-wide">{district.name}</h3>
                      <p className="text-sm text-textSecondary mt-2 leading-tight">{district.description}</p>
                      <div className="mt-4 pt-3 border-t border-white/10 flex justify-center">
                        <span className={cn("text-sm font-semibold drop-shadow-md px-3 py-1 rounded-full bg-white/5", 
                          district.id === 'investment' ? 'text-success' : 'text-white'
                        )}>
                          {district.progress}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            </div>
          ))}

        </motion.div>
      </div>
      
      {/* CSS for path animation */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </motion.div>
  );
}
