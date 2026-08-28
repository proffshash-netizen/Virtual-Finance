import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Shield, Crosshair, BookOpen, Heart, Swords, Users, MapPin } from 'lucide-react';

interface VillageMapProps {
  mini?: boolean;
  onLocationClick?: (id: string) => void;
  onQuizClick?: (id: string) => void;
  activeHover?: string | null;
  setActiveHover?: (id: string | null) => void;
}

const DEBUG_MODE = false;

export function VillageMap({ mini = false, onLocationClick, setActiveHover }: VillageMapProps) {
  
  const handleHover = (id: string | null) => {
    if (setActiveHover && !mini) setActiveHover(id);
  };

  const handleClick = (id: string) => {
    if (onLocationClick) onLocationClick(id);
  };

  return (
    <div className="w-full h-full relative font-sans select-none overflow-hidden bg-[#55B84A]">
      <div className="relative w-full h-full">
        {/* 1. Map Image */}
        <img 
          src="/map_artwork_textless.jpg" 
          className="w-full h-auto block pointer-events-none" 
          alt="FinLit City Map" 
        />
        
        {/* 1.2 Natural Motion (River shimmering, Wind) */}
        {!mini && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay z-[2]">
            {/* Animated river ripple - placed over the Achen River */}
            <motion.div 
              className="absolute bg-blue-300/30 blur-md rounded-full"
              style={{ width: '40%', height: '80%', left: '15%', top: '10%', transform: 'rotate(-25deg)' }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Cloud shadows slowly drifting */}
            <motion.div
              className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2)_0%,transparent_50%)]"
              animate={{ x: ['-50%', '150%'] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              style={{ top: '-20%', opacity: 0.4 }}
            />
          </div>
        )}

      {/* 1.5 Animated Map Characters Overlay */}
      {!mini && (
        <div className="absolute inset-0 pointer-events-none z-[5]">
          {/* Villager 1: Walking from Market to Bridge */}
          <motion.div 
            className="absolute"
            animate={{ 
              left: ['50%', '40%', '50%'], 
              top: ['55%', '60%', '55%'],
              scaleX: [1, 1, -1, -1] // flips direction
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative">
              <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/30 rounded-full blur-[1px]"></div>
              <div className="w-3.5 h-5 bg-orange-700 rounded-t-full rounded-b-sm shadow-sm border border-black/20 flex flex-col items-center">
                 <div className="w-3 h-3 bg-[#FFCDB2] rounded-full -mt-1 shadow-sm"></div>
              </div>
            </div>
          </motion.div>

          {/* Villager 2: Walking near the Church */}
          <motion.div 
            className="absolute"
            animate={{ 
              left: ['60%', '70%', '60%'], 
              top: ['78%', '75%', '78%'],
              scaleX: [-1, -1, 1, 1] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
          >
            <div className="relative">
              <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/30 rounded-full blur-[1px]"></div>
              <div className="w-3 h-4 bg-emerald-700 rounded-t-full rounded-b-sm shadow-sm border border-black/20 flex flex-col items-center">
                 <div className="w-2.5 h-2.5 bg-[#FFCDB2] rounded-full -mt-1 shadow-sm"></div>
              </div>
            </div>
          </motion.div>

          {/* Villager 3: Standing near Academy, pacing */}
          <motion.div 
            className="absolute"
            animate={{ 
              left: ['70%', '72%', '70%'], 
              top: ['25%', '25%', '25%'],
              scaleX: [1, -1, 1] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative">
              <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/30 rounded-full blur-[1px]"></div>
              <div className="w-3.5 h-5 bg-indigo-700 rounded-t-full rounded-b-sm shadow-sm border border-black/20 flex flex-col items-center">
                 <div className="w-3 h-3 bg-[#FFCDB2] rounded-full -mt-1 shadow-sm"></div>
                 <div className="w-4 h-1 bg-slate-200 mt-1 rounded-sm"></div> {/* Book */}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 2. Hotspot Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        
        {/* --- FIN ACADEMY --- */}
        <div 
          className={cn(
            "absolute pointer-events-auto cursor-pointer rounded-full transition-all",
            DEBUG_MODE ? "border-[3px] border-purple-500 bg-purple-500/40" : "hover:bg-white/30 hover:scale-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          )} 
          style={{ left: '58%', top: '28%', width: '8%', aspectRatio: '1/1', transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => handleHover('academy')}
          onMouseLeave={() => handleHover(null)}
          onClick={() => handleClick('academy')}
        >
          {/* Scout Regiment Flag & Label */}
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleClick('academy'); }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer origin-bottom"
          >
            <div className="w-8 h-12 bg-blue-700 relative overflow-hidden shadow-lg border-2 border-white/50 group-hover:bg-blue-600 transition-colors" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
              <div className="absolute inset-0 flex items-center justify-center -translate-y-1">
                <BookOpen className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            </div>
            <div className="w-1 h-8 bg-zinc-400 border-x border-zinc-600"></div>
            {/* English Label */}
            <div className="mt-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 whitespace-nowrap">
              <span className="text-white font-black tracking-wider text-xs shadow-sm">Fin Academy</span>
            </div>
          </motion.div>
        </div>

        {/* --- MARKET CITY --- */}
        <div 
          className={cn(
            "absolute pointer-events-auto cursor-pointer rounded-full transition-all",
            DEBUG_MODE ? "border-[3px] border-blue-500 bg-blue-500/40" : "hover:bg-white/30 hover:scale-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          )} 
          style={{ left: '65%', top: '48%', width: '8%', aspectRatio: '1/1', transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => handleHover('market')}
          onMouseLeave={() => handleHover(null)}
          onClick={() => handleClick('market')}
        >
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleClick('market'); }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer origin-bottom"
          >
            <div className="w-8 h-12 bg-emerald-700 relative overflow-hidden shadow-lg border-2 border-white/50 group-hover:bg-emerald-600 transition-colors" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
              <div className="absolute inset-0 flex items-center justify-center -translate-y-1">
                <Shield className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            </div>
            <div className="w-1 h-8 bg-zinc-400 border-x border-zinc-600"></div>
            <div className="mt-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 whitespace-nowrap">
              <span className="text-white font-black tracking-wider text-xs shadow-sm">Market City</span>
            </div>
          </motion.div>
        </div>

        {/* --- INVESTMENT DISTRICT --- */}
        <div 
          className={cn(
            "absolute pointer-events-auto cursor-pointer rounded-full transition-all",
            DEBUG_MODE ? "border-[3px] border-green-500 bg-green-500/40" : "hover:bg-white/30 hover:scale-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          )} 
          style={{ left: '75%', top: '35%', width: '8%', aspectRatio: '1/1', transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => handleHover('investment')}
          onMouseLeave={() => handleHover(null)}
          onClick={() => handleClick('investment')}
        >
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleClick('investment'); }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer origin-bottom"
          >
            <div className="w-8 h-12 bg-purple-700 relative overflow-hidden shadow-lg border-2 border-white/50 group-hover:bg-purple-600 transition-colors" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
              <div className="absolute inset-0 flex items-center justify-center -translate-y-1">
                <Crosshair className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            </div>
            <div className="w-1 h-8 bg-zinc-400 border-x border-zinc-600"></div>
            <div className="mt-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 whitespace-nowrap">
              <span className="text-white font-black tracking-wider text-xs shadow-sm">Investment</span>
            </div>
          </motion.div>
        </div>

        {/* --- LIFE HUB --- */}
        <div 
          className={cn(
            "absolute pointer-events-auto cursor-pointer rounded-full transition-all",
            DEBUG_MODE ? "border-[3px] border-orange-500 bg-orange-500/40" : "hover:bg-white/30 hover:scale-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          )} 
          style={{ left: '85%', top: '45%', width: '8%', aspectRatio: '1/1', transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => handleHover('life')}
          onMouseLeave={() => handleHover(null)}
          onClick={() => handleClick('life')}
        >
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleClick('life'); }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer origin-bottom"
          >
            <div className="w-8 h-12 bg-rose-700 relative overflow-hidden shadow-lg border-2 border-white/50 group-hover:bg-rose-600 transition-colors" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
              <div className="absolute inset-0 flex items-center justify-center -translate-y-1">
                <Heart className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            </div>
            <div className="w-1 h-8 bg-zinc-400 border-x border-zinc-600"></div>
            <div className="mt-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 whitespace-nowrap">
              <span className="text-white font-black tracking-wider text-xs shadow-sm">Life Hub</span>
            </div>
          </motion.div>
        </div>

        {/* --- SECURITY CENTER --- */}
        <div 
          className={cn(
            "absolute pointer-events-auto cursor-pointer rounded-full transition-all",
            DEBUG_MODE ? "border-[3px] border-red-500 bg-red-500/40" : "hover:bg-white/30 hover:scale-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          )} 
          style={{ left: '48%', top: '15%', width: '8%', aspectRatio: '1/1', transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => handleHover('security')}
          onMouseLeave={() => handleHover(null)}
          onClick={() => handleClick('security')}
        >
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleClick('security'); }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer origin-bottom"
          >
            <div className="w-8 h-12 bg-yellow-600 relative overflow-hidden shadow-lg border-2 border-white/50 group-hover:bg-yellow-500 transition-colors" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
              <div className="absolute inset-0 flex items-center justify-center -translate-y-1">
                <Swords className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            </div>
            <div className="w-1 h-8 bg-zinc-400 border-x border-zinc-600"></div>
            <div className="mt-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 whitespace-nowrap">
              <span className="text-white font-black tracking-wider text-xs shadow-sm">Security</span>
            </div>
          </motion.div>
        </div>

        {/* --- SOCIAL HUB --- */}
        <div 
          className={cn(
            "absolute pointer-events-auto cursor-pointer rounded-full transition-all",
            DEBUG_MODE ? "border-[3px] border-pink-500 bg-pink-500/40" : "hover:bg-white/30 hover:scale-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          )} 
          style={{ left: '30%', top: '50%', width: '8%', aspectRatio: '1/1', transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => handleHover('social')}
          onMouseLeave={() => handleHover(null)}
          onClick={() => handleClick('social')}
        >
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleClick('social'); }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer origin-bottom"
          >
            <div className="w-8 h-12 bg-orange-600 relative overflow-hidden shadow-lg border-2 border-white/50 group-hover:bg-orange-500 transition-colors" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
              <div className="absolute inset-0 flex items-center justify-center -translate-y-1">
                <Users className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            </div>
            <div className="w-1 h-8 bg-zinc-400 border-x border-zinc-600"></div>
            <div className="mt-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 whitespace-nowrap">
              <span className="text-white font-black tracking-wider text-xs shadow-sm">Social Hub</span>
            </div>
          </motion.div>
        </div>

        {/* --- DAILY QUEST MARKERS (ONLY WHEN NOT MINI) --- */}
        {!mini && (
          <>
            {/* Market City Quest */}
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute pointer-events-none z-20"
              style={{ left: '55%', top: '40%', transform: 'translate(-50%, -50%)' }}
            >
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border-2 border-primary shadow-lg flex flex-col items-center">
                <MapPin className="w-5 h-5 text-primary mb-1" />
                <span className="text-xs font-black text-text-primary uppercase whitespace-nowrap">Inflation Hunt</span>
                <span className="text-[10px] font-bold text-reward">+250 XP</span>
              </div>
            </motion.div>

            {/* Guide Character at Academy */}
            <motion.div 
              className="absolute pointer-events-none flex flex-col items-center z-20"
              style={{ left: '72%', top: '15%', transform: 'translate(-50%, -50%)' }}
            >
              {/* Speech Bubble */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="bg-white p-3 rounded-2xl border-2 border-border shadow-lg mb-2 relative"
              >
                <p className="text-xs font-bold text-text-primary">Bereit? 👋</p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-border rotate-45"></div>
              </motion.div>
              {/* Character */}
              <div className="w-16 h-16 bg-surface rounded-full border-4 border-border overflow-hidden shadow-lg">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hans&backgroundColor=E6F0F9" alt="Guide" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Wind / Leaves Particle Effect */}
            <motion.div
              animate={{ x: ['-20vw', '120vw'], y: ['10vh', '30vh'], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute top-[20%] left-0 w-4 h-4 bg-green-600/60 rounded-tl-full rounded-br-full rotate-45 pointer-events-none z-30"
            />
            <motion.div
              animate={{ x: ['-10vw', '110vw'], y: ['40vh', '20vh'], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 18, delay: 5, ease: "linear" }}
              className="absolute top-[50%] left-0 w-3 h-3 bg-green-500/50 rounded-tl-full rounded-br-full rotate-12 pointer-events-none z-30"
            />
          </>
        )}
      </div>
    </div>
    </div>
  );
}
