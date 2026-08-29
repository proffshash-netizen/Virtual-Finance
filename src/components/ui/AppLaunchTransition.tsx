import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FinlitIcon } from './FinlitIcon';

interface AppLaunchTransitionProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export function AppLaunchTransition({ isLoading, children }: AppLaunchTransitionProps) {
  const [phase, setPhase] = useState<'splash' | 'skeleton' | 'content'>('splash');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    // If reduced motion, skip splash and just wait for loading
    if (reducedMotion) {
      setPhase(isLoading ? 'skeleton' : 'content');
      return;
    }

    if (phase === 'splash') {
      const timer = setTimeout(() => {
        setPhase(isLoading ? 'skeleton' : 'content');
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (phase === 'skeleton' && !isLoading) {
      setPhase('content');
    }
  }, [phase, isLoading, reducedMotion]);

  const handleInterrupt = () => {
    if (phase === 'splash') {
      setPhase(isLoading ? 'skeleton' : 'content');
    }
  };

  const smoothBezier: [number, number, number, number] = [0.25, 0.1, 0.25, 1]; // standard CSS ease, soft no-bounce

  if (reducedMotion) {
    return (
      <>
        {isLoading ? (
          <div className="w-full h-full flex flex-col p-8 opacity-50">
             <div className="text-xl">Loading...</div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        )}
      </>
    );
  }

  return (
    <div className="relative w-full h-full" onClick={handleInterrupt}>
      <AnimatePresence mode="wait">
        
        {/* PHASE 1: SPLASH */}
        {phase === 'splash' && (
          <motion.div 
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: smoothBezier }}
            className="absolute inset-0 z-[100] bg-[#0B1021] flex flex-col items-center justify-center cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: smoothBezier }}
              className="relative flex flex-col items-center justify-center"
            >
              <div className="relative flex items-center justify-center">
                 <FinlitIcon className="w-24 h-24 text-white drop-shadow-lg" />
                 {/* Glowing Ring Accent */}
                 <motion.div 
                   initial={{ scale: 0.5, opacity: 0 }}
                   animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
                   transition={{ duration: 1.2, ease: smoothBezier, repeat: Infinity }}
                   className="absolute inset-0 rounded-full border-[3px] border-primary pointer-events-none"
                 />
              </div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: smoothBezier }}
                className="text-white font-display font-black text-3xl tracking-[0.2em] mt-6"
              >
                FINLIT
              </motion.h1>
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 2: SKELETON */}
        {phase === 'skeleton' && (
          <motion.div 
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: smoothBezier }}
            className="absolute inset-0 z-50 bg-background overflow-y-auto pt-32 px-8 pb-8"
          >
             <div className="max-w-7xl mx-auto space-y-10">
               {/* Header Skeleton */}
               <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                 <div className="flex items-center space-x-6">
                   <div className="w-20 h-20 rounded-[2rem] bg-slate-200/20 animate-pulse border-4 border-slate-200/10"></div>
                   <div className="space-y-3">
                     <div className="h-8 w-48 bg-slate-200/20 rounded animate-pulse"></div>
                     <div className="h-4 w-32 bg-slate-200/20 rounded animate-pulse"></div>
                   </div>
                 </div>
                 <div className="w-full md:w-1/3 h-16 bg-slate-200/10 rounded-2xl animate-pulse"></div>
               </div>
               
               {/* Tier Cards Skeleton */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="h-40 bg-slate-200/10 rounded-[2rem] animate-pulse flex flex-col items-center justify-center p-6 space-y-4">
                     <div className="h-4 w-24 bg-slate-200/20 rounded"></div>
                     <div className="h-10 w-32 bg-slate-200/20 rounded"></div>
                     <div className="h-4 w-40 bg-slate-200/20 rounded"></div>
                   </div>
                 ))}
               </div>

               {/* Bottom Section Skeleton */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-1 space-y-4">
                   <div className="h-6 w-32 bg-slate-200/20 rounded animate-pulse"></div>
                   <div className="h-32 bg-slate-200/10 rounded-[2rem] animate-pulse"></div>
                   <div className="h-32 bg-slate-200/10 rounded-[2rem] animate-pulse"></div>
                 </div>
                 <div className="lg:col-span-2 space-y-4">
                   <div className="h-6 w-48 bg-slate-200/20 rounded animate-pulse"></div>
                   <div className="h-64 bg-slate-200/10 rounded-[2rem] animate-pulse"></div>
                 </div>
               </div>
             </div>
          </motion.div>
        )}

        {/* PHASE 3: CONTENT */}
        {phase === 'content' && (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: smoothBezier }}
            className="w-full"
          >
            {children}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
