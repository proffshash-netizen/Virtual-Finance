import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Play, Sparkles } from 'lucide-react';

export function Entry() {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(false);

  const handleEnter = () => {
    setIsEntering(true);
    // Add a slight delay to allow the exit animation to play before navigating
    setTimeout(() => {
      navigate('/world');
    }, 1000);
  };

  // Generate random particles
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <motion.div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Background Layer with the generated city */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/bg-city.png)', backgroundPosition: 'center bottom' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-transparent"></div>
      </div>

      {/* Grid Overlay for cyber aesthetic */}
      <div 
        className="absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          perspective: '1000px',
          transform: 'rotateX(60deg) scale(2.5) translateY(20%)',
          transformOrigin: 'bottom center',
        }}
      ></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/50 glow-primary"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -1000],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Hologram Light Bleeds */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center text-center max-w-4xl px-6"
        animate={isEntering ? { scale: 1.5, opacity: 0, y: -50, filter: "blur(5px)" } : { scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-7xl md:text-9xl font-display font-black tracking-[0.15em] mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-textPrimary to-primary/50 drop-shadow-[0_0_30px_rgba(124,92,255,0.3)]">
            FINLIT
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-xl md:text-3xl font-medium tracking-wide text-textPrimary mb-3 drop-shadow-md">
            Your Financial Life. Your Decisions. Your Future.
          </h2>
          <p className="text-textSecondary text-lg md:text-xl tracking-[0.2em] uppercase mb-16">
            Learn finance by experiencing it.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        >
          <Button 
            size="lg" 
            className="h-16 px-10 text-lg font-bold tracking-[0.2em] uppercase rounded border border-primary/50 bg-primary/10 hover:bg-primary/30 text-white shadow-[0_0_40px_rgba(124,92,255,0.4)] hover:shadow-[0_0_60px_rgba(124,92,255,0.6)] transition-all duration-500 overflow-hidden relative group backdrop-blur-sm"
            onClick={handleEnter}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            <Sparkles className="w-5 h-5 mr-3 text-primary group-hover:text-white transition-colors relative z-10" />
            <span className="relative z-10">Enter The Simulation</span>
          </Button>

          <Button 
            size="lg" 
            variant="ghost"
            className="h-16 px-8 text-sm font-semibold tracking-widest uppercase text-textSecondary hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <Play className="w-4 h-4 mr-2" />
            Explore How It Works
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
