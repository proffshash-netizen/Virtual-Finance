import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function WorldInteractionRipple({ children }: { children: React.ReactNode }) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't spawn ripples if clicking on a button or interactive HUD element
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('.hud-element')) {
        return;
      }
      
      const newRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 1000);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="relative w-full h-full">
      {children}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute w-12 h-12 border-2 border-white/50 bg-white/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              style={{ left: ripple.x - 24, top: ripple.y - 24 }}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
