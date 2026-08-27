import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface VillageMapProps {
  mini?: boolean;
  onLocationClick?: (id: string) => void;
  activeHover?: string | null;
  setActiveHover?: (id: string | null) => void;
}

// Temporarily set to true if you need to debug the hotspot alignments
const DEBUG_MODE = false;

export function VillageMap({ mini = false, onLocationClick, setActiveHover }: VillageMapProps) {
  
  const handleHover = (id: string | null) => {
    if (setActiveHover && !mini) setActiveHover(id);
  };

  const handleClick = (id: string) => {
    if (onLocationClick && !mini) onLocationClick(id);
  };

  return (
    <div 
      className={cn(
        "relative mx-auto overflow-hidden", 
        mini ? "rounded-[32px] border-4 border-border shadow-lg w-full bg-background" : "w-full h-auto bg-transparent mx-auto"
      )}
    >
      
      {/* 1. Map Image (drives container height, ensuring percentage coordinates always align) */}
      <img 
        src="/map_artwork.png" 
        className="w-full h-auto block pointer-events-none" 
        alt="FinLit City Map" 
      />

      {/* 1.5 Animated Map Characters Overlay */}
      {!mini && (
        <div className="absolute inset-0 pointer-events-none z-[5]">
          {/* Academy Student (Bobbing) */}
          <div className="absolute animate-bob" style={{ left: '26%', top: '35%', animationDelay: '0s' }}>
            <div className="relative">
              <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-[1px]"></div>
              <div className="w-3.5 h-5 bg-indigo-500 rounded-t-full rounded-b-sm shadow-sm border border-black/10"></div>
            </div>
          </div>



          {/* Market Shopper (Bobbing) */}
          <div className="absolute animate-bob" style={{ left: '71%', top: '36%', animationDelay: '0.4s' }}>
            <div className="relative">
              <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-[1px]"></div>
              <div className="w-3.5 h-5 bg-amber-500 rounded-t-full rounded-b-sm shadow-sm border border-black/10"></div>
            </div>
          </div>

          {/* Investment Banker (Bobbing) */}
          <div className="absolute animate-bob" style={{ left: '25%', top: '68%', animationDelay: '0.8s' }}>
            <div className="relative">
              <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-[1px]"></div>
              <div className="w-3.5 h-5 bg-slate-700 rounded-t-full rounded-b-sm shadow-sm border border-black/10"></div>
            </div>
          </div>

          {/* Life Hub Walker (Walking) */}
          <div className="absolute animate-walk" style={{ left: '68%', top: '75%' }}>
            <div className="relative">
              <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-[1px]"></div>
              <div className="w-3 h-4 bg-emerald-500 rounded-t-full rounded-b-sm shadow-sm border border-black/10"></div>
            </div>
          </div>
          
          {/* Central Plaza Walker (Walking) */}
          <div className="absolute animate-walk" style={{ left: '48%', top: '55%', animationDelay: '2s' }}>
            <div className="relative">
              <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-[1px]"></div>
              <div className="w-3.5 h-5 bg-rose-500 rounded-t-full rounded-b-sm shadow-sm border border-black/10"></div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hotspot Overlay (shares exact dimensions of the image) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        
        {/* --- FIN ACADEMY (upper-left) --- */}
        <div 
          className={cn(
            "absolute pointer-events-auto cursor-pointer rounded-full transition-all",
            DEBUG_MODE ? "border-[3px] border-purple-500 bg-purple-500/40" : "hover:bg-white/30 hover:scale-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          )} 
          style={{ left: '29%', top: '32%', width: '8%', aspectRatio: '1/1', transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => handleHover('academy')}
          onMouseLeave={() => handleHover(null)}
          onClick={() => handleClick('academy')}
        />

        {/* --- MARKET CITY (upper-right) --- */}
        <div 
          className={cn(
            "absolute pointer-events-auto cursor-pointer rounded-full transition-all",
            DEBUG_MODE ? "border-[3px] border-blue-500 bg-blue-500/40" : "hover:bg-white/30 hover:scale-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          )} 
          style={{ left: '74%', top: '32%', width: '8%', aspectRatio: '1/1', transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => handleHover('market')}
          onMouseLeave={() => handleHover(null)}
          onClick={() => handleClick('market')}
        />

        {/* --- INVESTMENT DISTRICT (lower-left) --- */}
        <div 
          className={cn(
            "absolute pointer-events-auto cursor-pointer rounded-full transition-all",
            DEBUG_MODE ? "border-[3px] border-green-500 bg-green-500/40" : "hover:bg-white/30 hover:scale-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          )} 
          style={{ left: '21%', top: '72%', width: '8%', aspectRatio: '1/1', transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => handleHover('investment')}
          onMouseLeave={() => handleHover(null)}
          onClick={() => handleClick('investment')}
        />

        {/* --- LIFE HUB (lower-right) --- */}
        <div 
          className={cn(
            "absolute pointer-events-auto cursor-pointer rounded-full transition-all",
            DEBUG_MODE ? "border-[3px] border-orange-500 bg-orange-500/40" : "hover:bg-white/30 hover:scale-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          )} 
          style={{ left: '78%', top: '72%', width: '8%', aspectRatio: '1/1', transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => handleHover('life')}
          onMouseLeave={() => handleHover(null)}
          onClick={() => handleClick('life')}
        />

        {/* --- SECURITY CENTER (top-center) --- */}
        <div 
          className={cn(
            "absolute pointer-events-auto cursor-pointer rounded-full transition-all",
            DEBUG_MODE ? "border-[3px] border-red-500 bg-red-500/40" : "hover:bg-white/30 hover:scale-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          )} 
          style={{ left: '50%', top: '20%', width: '8%', aspectRatio: '1/1', transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => handleHover('security')}
          onMouseLeave={() => handleHover(null)}
          onClick={() => handleClick('security')}
        />

        {/* --- SOCIAL HUB (top-right) --- */}
        <div 
          className={cn(
            "absolute pointer-events-auto cursor-pointer rounded-full transition-all",
            DEBUG_MODE ? "border-[3px] border-pink-500 bg-pink-500/40" : "hover:bg-white/30 hover:scale-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          )} 
          style={{ left: '80%', top: '20%', width: '8%', aspectRatio: '1/1', transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => handleHover('social')}
          onMouseLeave={() => handleHover(null)}
          onClick={() => handleClick('social')}
        />

        {/* --- DAILY QUEST MARKERS (ONLY WHEN NOT MINI) --- */}
        {!mini && (
          <>
            {/* Market City Quest */}
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute pointer-events-none"
              style={{ left: '74%', top: '22%', transform: 'translate(-50%, -50%)' }}
            >
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border-2 border-primary shadow-lg flex flex-col items-center">
                <MapPin className="w-5 h-5 text-primary mb-1" />
                <span className="text-xs font-black text-text-primary uppercase whitespace-nowrap">Inflation Hunt</span>
                <span className="text-[10px] font-bold text-reward">+250 XP</span>
              </div>
            </motion.div>

            {/* Guide Character at Academy */}
            <motion.div 
              className="absolute pointer-events-none flex flex-col items-center"
              style={{ left: '22%', top: '28%', transform: 'translate(-50%, -50%)' }}
            >
              {/* Speech Bubble */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="bg-white p-3 rounded-2xl border-2 border-border shadow-lg mb-2 relative"
              >
                <p className="text-xs font-bold text-text-primary">Ready to study? 👋</p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-border rotate-45"></div>
              </motion.div>
              {/* Character */}
              <div className="w-16 h-16 bg-surface rounded-full border-4 border-border overflow-hidden shadow-lg">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=E6F0F9" alt="Guide" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Ambient Elements */}
            <motion.div
              animate={{ x: [0, 100, 0] }}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              className="absolute top-[10%] left-[40%] w-32 h-16 bg-white/30 rounded-full blur-xl pointer-events-none"
            />
            <motion.div
              animate={{ x: [0, -80, 0] }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="absolute top-[60%] right-[30%] w-40 h-20 bg-white/20 rounded-full blur-xl pointer-events-none"
            />
          </>
        )}
      </div>
    </div>
  );
}
