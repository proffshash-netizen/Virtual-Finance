import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useProgress, Html } from '@react-three/drei';
import { Scene } from '../components/world3d/Scene';
import { useGameState } from '../lib/gameState';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-surface p-6 rounded-2xl border-4 border-border shadow-xl">
        <h2 className="text-xl font-black tracking-widest text-text-main mb-4 font-mono">LOADING 3D WORLD</h2>
        <div className="w-64 h-4 bg-background rounded-full overflow-hidden border-2 border-border">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <p className="mt-2 text-text-muted font-bold">{Math.round(progress)}% loaded</p>
      </div>
    </Html>
  );
}

export function WorldMap3D() {
  const navigate = useNavigate();
  const { districts } = useGameState();

  const handleLocationClick = (id: string) => {
    const district = districts.find(d => d.id === id);
    if (district && !district.locked) {
      // Wait for a cinematic zoom (which we can add to Scene later, but for now just wait a beat)
      setTimeout(() => {
        navigate(district.path);
      }, 1000); 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute inset-0 w-full h-full bg-[#87CEEB] overflow-hidden flex flex-col font-sans"
    >
      {/* R3F Canvas filling the screen */}
      <div className="relative flex-1 w-full h-full">
        <Canvas shadows camera={{ position: [0, 25, 30], fov: 45 }}>
          <Suspense fallback={<Loader />}>
            <Scene onLocationClick={handleLocationClick} />
          </Suspense>
        </Canvas>
      </div>

      {/* Reused 2D Contextual Information Panel from the original map */}
      {/* We are currently missing hoveredLocation tracking from 3D (drei Html handles its own hover), 
          but we can display global stats or specific pinned UI here as requested.
          For this implementation, let's just render the fixed HUD elements. */}
      
      {/* Bottom Right Docked Element (Example from previous tasks) */}
      <div className="absolute bottom-6 right-6 z-50 pointer-events-none">
        <div className="bg-surface border-4 border-border rounded-[2rem] p-4 shadow-[0_20px_40px_rgba(0,0,0,0.2)] pointer-events-auto">
          <h3 className="font-display font-black text-sm text-text-primary uppercase tracking-widest text-center">
            3D PREVIEW MODE
          </h3>
          <p className="text-xs font-bold text-text-muted mt-1 text-center">Drag to rotate • Scroll to zoom</p>
        </div>
      </div>
    </motion.div>
  );
}
