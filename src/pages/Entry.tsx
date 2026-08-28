import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Heart, ChevronRight, Map } from 'lucide-react';
import { FinlitIcon } from '../components/ui/FinlitIcon';
import { VillageMap } from '../components/ui/VillageMap';
import { useGameState } from '../lib/gameState';
import { AnimatedClouds } from '../components/layout/AnimatedClouds';

const CountUpNumber = ({ value, delay = 0 }: { value: number, delay?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let frame: number;
    const timer = setTimeout(() => {
      const start = performance.now();
      const duration = 500;
      
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        setDisplayValue(Math.round(p * value));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, delay]);

  return <>{displayValue.toLocaleString()}</>;
};

export function Entry() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEntering, setIsEntering] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // Login Form State
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [ageConfirm, setAgeConfirm] = useState(false);

  const { login, register, user, level, xp, money, health } = useGameState();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isFirstVisit] = useState(() => {
    const hasVisited = sessionStorage.getItem('finlit_opened');
    if (!hasVisited) {
      sessionStorage.setItem('finlit_opened', 'true');
      return true;
    }
    return false;
  });

  useEffect(() => {
    if ((location.state as any)?.openLogin) {
      setIsLoginOpen(true);
    }
  }, [location.state]);

  const smoothBezier: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const isAnimating = useRef(false);
  const rafRef = useRef<number>(0);

  const animateMouse = useCallback(() => {
    if (!containerRef.current) return;
    
    // Lerp towards target
    currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.08;
    currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.08;
    
    containerRef.current.style.setProperty('--mouse-x', currentMouse.current.x.toString());
    containerRef.current.style.setProperty('--mouse-y', currentMouse.current.y.toString());

    // Continue animation if we haven't reached target
    if (
      Math.abs(targetMouse.current.x - currentMouse.current.x) > 0.001 || 
      Math.abs(targetMouse.current.y - currentMouse.current.y) > 0.001
    ) {
      rafRef.current = requestAnimationFrame(animateMouse);
    } else {
      isAnimating.current = false;
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const rawX = (e.clientX - rect.left) / rect.width;
    const rawY = (e.clientY - rect.top) / rect.height;

    const centerX = 0.5;
    const centerY = 0.5;
    
    targetMouse.current = {
      x: (rawX - centerX) * 2,
      y: (rawY - centerY) * 2
    };

    if (!isAnimating.current) {
      isAnimating.current = true;
      rafRef.current = requestAnimationFrame(animateMouse);
    }
  }, [animateMouse]);

  const handleMouseLeave = useCallback(() => {
    targetMouse.current = { x: 0, y: 0 };
    if (!isAnimating.current) {
      isAnimating.current = true;
      rafRef.current = requestAnimationFrame(animateMouse);
    }
  }, [animateMouse]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleEnter = () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    setIsEntering(true);
    setTimeout(() => {
      navigate('/world');
    }, 400); // Wait for transition
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    if (isRegistering) {
      // Use mock API from GameState for register logic
      if (!register) {
        setError("Registration is not available yet.");
        setIsSubmitting(false);
        return;
      }
      const success = await register(displayName, email, password, ageConfirm);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          setIsLoginOpen(false);
          setIsEntering(true);
          setTimeout(() => navigate('/world'), 400);
        }, 1000);
      } else {
        setError("Registration failed. Please check your inputs.");
        setIsSubmitting(false);
      }
    } else {
      const success = await login(userId, password);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          setIsLoginOpen(false);
          setIsEntering(true);
          setTimeout(() => navigate('/world'), 400);
        }, 1000);
      } else {
        setError("Those credentials don't match. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col bg-background overflow-hidden font-sans"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.35, ease: 'easeOut' } }}
    >
      {/* PHASE 5: Environment Comes Alive (AnimatedClouds handles its own fade-in at 1.0s via isFirstVisit prop modification) */}
      <AnimatedClouds isFirstVisit={isFirstVisit} />

      {/* PHASE 1: World Awakening - Radial Sunrise Sweep (0.00s) */}
      {isFirstVisit && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,230,150,0.15)_0%,transparent_50%)] animate-sunrise-sweep blur-[80px]" style={{ animationDelay: '0.0s' }}></div>
        </div>
      )}

      {/* PHASE 7: Micro-particle effect (CSS drift) */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-white/40 rounded-full blur-[2px] animate-mote-drift" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[60%] left-[70%] w-1.5 h-1.5 bg-white/30 rounded-full blur-[1px] animate-mote-drift" style={{ animationDuration: '15s', animationDelay: '-5s' }} />
        <div className="absolute top-[20%] left-[80%] w-3 h-3 bg-white/20 rounded-full blur-[4px] animate-mote-drift" style={{ animationDuration: '18s', animationDelay: '-10s' }} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col h-full overflow-y-auto overflow-x-hidden">
        
        {/* NAVBAR */}
        <nav className="w-full p-8 flex justify-between items-center max-w-7xl mx-auto">
          {/* PHASE 3: Logo Reveal (0.55s) */}
          <motion.div 
            initial={isFirstVisit ? { opacity: 0, y: 15 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isFirstVisit ? 0.55 : 0, duration: 0.8, ease: smoothBezier }}
            className="flex items-center space-x-4"
          >
            <FinlitIcon className="w-12 h-12 drop-shadow-md" />
            <span className={isFirstVisit ? "font-display text-3xl font-black tracking-[0.2em] text-text-primary drop-shadow-sm animate-metallic-sweep inline-block pr-2" : "font-display text-3xl font-black tracking-[0.2em] text-text-primary drop-shadow-sm inline-block pr-2"} style={{ animationDelay: '0.6s' }}>
              FINLIT
            </span>
          </motion.div>
          <motion.div
            initial={isFirstVisit ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: isFirstVisit ? 1.5 : 0, duration: 0.6 }}
          >
            {user ? (
              <Button variant="ghost" className="font-bold text-text-primary hover:bg-white/20 px-6 py-2 h-12 text-lg" onClick={handleEnter}>
                ENTER WORLD
              </Button>
            ) : (
              <Button variant="ghost" className="font-bold text-text-primary hover:bg-white/20 px-6 py-2 h-12 text-lg" onClick={() => setIsLoginOpen(true)}>
                LOG IN
              </Button>
            )}
          </motion.div>
        </nav>

        {/* HERO SECTION */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pt-6 pb-16 max-w-6xl mx-auto w-full text-center parallax-layer-hero">
          
          {/* Hero Central Sequence - Top-to-Bottom */}
          <div className="flex flex-col items-center">
            
            {/* 1. Coin Pulse (Delay 0s) */}
            <div className="animate-hero-rise" style={{ animationDelay: '0s' }}>
              <div className="animate-hero-pulse relative mb-6 inline-flex justify-center items-center w-28 h-28">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-[25px] animate-pulse"></div>
                <FinlitIcon className="w-28 h-28 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] relative z-10" />
              </div>
            </div>

            {/* 2. FINLIT Title (Delay 0.08s) */}
            <h1 
              className="animate-hero-rise text-7xl md:text-9xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-text-primary to-text-secondary drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] mb-4"
              style={{ animationDelay: '0.08s' }}
            >
              FINLIT
            </h1>

            {/* 3. Tagline (Delay 0.16s) */}
            <h2 
              className="animate-hero-rise text-3xl md:text-5xl font-display font-bold text-text-secondary drop-shadow-sm mb-12"
              style={{ animationDelay: '0.16s' }}
            >
              YOUR FINANCIAL WORLD AWAITS.
            </h2>
            
            {/* 4. Stat Pills HUD (Staggered Delays 0.24, 0.32, 0.40) */}
            <div className="animate-hero-rise flex flex-row justify-center items-stretch mb-10 bg-surface/90 backdrop-blur-md rounded-[32px] md:rounded-[40px] border-[4px] md:border-[6px] border-b-[8px] md:border-b-[10px] border-[#D2C4A7] shadow-xl overflow-hidden divide-x-[4px] md:divide-x-[6px] divide-[#D2C4A7]" style={{ animationDelay: '0.24s' }}>
              
              <div className="animate-hero-rise" style={{ animationDelay: '0.24s' }}>
                <div className="animate-hero-float relative flex items-center space-x-4 md:space-x-5 px-6 md:px-8 py-3 md:py-4 h-full" style={{ animationDelay: '0s' }}>
                  <div className="w-12 md:w-16 h-12 md:h-16 rounded-full bg-primary flex items-center justify-center text-white font-black shadow-inner border-[3px] md:border-4 border-[#448A27] text-xl md:text-3xl relative z-10">
                    <CountUpNumber value={level} delay={240} />
                  </div>
                  <div className="text-left relative z-10">
                    <div className="text-xs md:text-sm font-black text-text-secondary uppercase tracking-wider">Level</div>
                    <div className="text-base md:text-2xl font-black text-text-primary tabular-nums">
                      <CountUpNumber value={xp} delay={240} /> XP
                    </div>
                  </div>
                </div>
              </div>

              <div className="animate-hero-rise" style={{ animationDelay: '0.32s' }}>
                <div className="animate-hero-float relative flex items-center space-x-4 md:space-x-5 px-6 md:px-8 py-3 md:py-4 h-full" style={{ animationDelay: '0.15s' }}>
                  <div className="bg-success text-white p-2.5 md:p-3.5 rounded-full border-[3px] md:border-4 border-[#228C3B] relative z-10">
                    <FinlitIcon className="w-6 md:w-8 h-6 md:h-8" />
                  </div>
                  <div className="text-left relative z-10">
                    <div className="text-xs md:text-sm font-black text-text-secondary uppercase tracking-wider">Money</div>
                    <div className="text-base md:text-2xl font-black text-success tabular-nums">
                      ₹<CountUpNumber value={money} delay={320} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="animate-hero-rise hidden md:block" style={{ animationDelay: '0.40s' }}>
                <div className="animate-hero-float relative flex items-center space-x-4 md:space-x-5 px-6 md:px-8 py-3 md:py-4 h-full" style={{ animationDelay: '0.3s' }}>
                  <div className="bg-surface-alt text-danger p-2.5 md:p-3.5 rounded-full border-[3px] md:border-4 border-border/50 relative z-10 shadow-inner">
                    <Heart className="w-6 md:w-8 h-6 md:h-8 fill-danger" />
                  </div>
                  <div className="text-left relative z-10">
                    <div className="text-xs md:text-sm font-black text-text-secondary uppercase tracking-wider">Health</div>
                    <div className="text-base md:text-2xl font-black text-text-primary tabular-nums">
                      <CountUpNumber value={health} delay={400} />/100
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 5. CTA Buttons (Delay 0.5s) */}
            <div className="animate-hero-rise flex flex-col sm:flex-row items-center justify-center gap-6 mt-4 w-full" style={{ animationDelay: '0.5s' }}>
              <Button 
                size="lg" 
                className="game-btn-primary cta-btn h-24 px-14 text-2xl w-full sm:w-auto relative group overflow-hidden premium-glow"
                onClick={handleEnter}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent shine-sweep-layer pointer-events-none"></div>
                <span className="relative z-10 flex items-center shadow-black/20 drop-shadow-sm">
                  ENTER FINLIT <ChevronRight className="ml-3 w-10 h-10" strokeWidth={3} />
                </span>
              </Button>

              <Button 
                size="lg" 
                variant="ghost"
                onClick={() => {
                  const mapElement = document.getElementById('preview-map');
                  mapElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="cta-btn group h-24 px-10 text-xl font-bold text-text-secondary hover:text-primary bg-surface-alt hover:bg-white border-4 border-b-[6px] border-[#D2C4A7] hover:border-primary rounded-[24px] shadow-sm hover:shadow-xl"
              >
                <Map className="w-6 h-6 mr-3 text-text-secondary group-hover:text-primary group-hover:-rotate-12 transition-all duration-300" /> EXPLORE THE WORLD
              </Button>
            </div>
            
          </div>

        </main>

        {/* PHASE 6: World Reveal (Scroll into view) */}
        <div id="preview-map" className="w-full max-w-[960px] mx-auto px-6 pb-32 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: smoothBezier }}
            className="w-full h-[450px] relative cursor-pointer group rounded-[36px] transition-transform duration-500 hover:scale-[1.015]"
            onClick={handleEnter}
          >
            {/* Soft Ambient Glow Behind Map */}
            <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-[36px] -z-10 group-hover:bg-primary/30 transition-colors duration-500"></div>

            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-surface px-8 py-3 rounded-full border-4 border-[#D2C4A7] shadow-xl z-30 transform group-hover:-translate-y-1 transition-transform">
              <span className="font-display font-black text-base uppercase tracking-widest text-text-primary">Preview Your World</span>
            </div>
            
            <div className="w-full h-full rounded-[36px] border-[6px] border-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.15)] overflow-hidden bg-background relative">
              
              {/* Overlay HUD to cover map artwork's baked-in mock data and show REAL data */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-20">
                <div className="bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-border shadow-md">
                  <h1 className="font-display font-black text-sm text-text-primary uppercase tracking-widest">
                    FinLit Village
                  </h1>
                </div>
                
                <div className="flex flex-col items-end space-y-1">
                  <div className="bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border-2 border-border shadow-md flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white font-black text-[10px]">
                      {level}
                    </div>
                    <span className="font-bold text-text-primary text-xs">{xp.toLocaleString()} XP</span>
                  </div>
                  <div className="bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border-2 border-border shadow-md text-right">
                    <span className="font-black text-success text-sm">₹{money.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <VillageMap mini={true} />
              
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none animate-pulse z-30"></div>
            </div>
            
            <div className="absolute inset-0 bg-transparent hover:bg-white/10 transition-colors z-40 rounded-[36px] flex items-center justify-center pointer-events-none">
               <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white font-black px-8 py-4 rounded-2xl border-4 border-[#356D1F] shadow-2xl transform scale-90 group-hover:scale-100">
                  CLICK TO ENTER
               </div>
            </div>
          </motion.div>
        </div>

      </div>

      {isEntering && (
        <motion.div 
          className="absolute inset-0 z-[60] bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        />
      )}

      {/* Login Modal Overlay */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsLoginOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white border-4 border-primary rounded-[32px] p-10 shadow-[0_30px_60px_rgba(15,23,42,0.3)] flex flex-col items-center relative overflow-hidden"
            >
              {success ? (
                <div className="flex flex-col items-center text-center py-6">
                  <div className="w-24 h-24 rounded-full border-4 border-primary shadow-lg overflow-hidden bg-slate-50 mb-6">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatarId === 'avatar_01' ? 'Felix' : 'Aneka'}&backgroundColor=E6F0F9`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-3xl font-display font-black text-slate-800 mb-2 uppercase tracking-wide">
                    Welcome Back
                  </h2>
                  <h1 className="text-4xl font-black text-primary drop-shadow-sm mb-4">{user?.displayName}</h1>
                  <p className="text-slate-500 font-medium">Loading your financial world...</p>
                </div>
              ) : (
                <>
                  <h2 className="text-4xl font-display font-black text-slate-800 mb-3 uppercase tracking-wide">
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-slate-500 mb-8 font-medium text-lg">{isRegistering ? 'Start your financial journey.' : 'Log in to continue your journey.'}</p>
                  
                  <form onSubmit={handleLoginSubmit} className="w-full flex flex-col items-center">
                    <div className="w-full space-y-6 mb-6">
                      {!isRegistering ? (
                        <>
                          <div>
                            <label className="block text-sm font-black text-slate-500 uppercase tracking-wider mb-2">User ID</label>
                            <input 
                              type="text" 
                              placeholder="e.g. FIN001" 
                              value={userId}
                              onChange={(e) => setUserId(e.target.value)}
                              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:border-primary transition-colors text-lg" 
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-black text-slate-500 uppercase tracking-wider mb-2">Password</label>
                            <input 
                              type="password" 
                              placeholder="••••••••" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:border-primary transition-colors text-lg" 
                              required
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-black text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
                            <input 
                              type="text" 
                              placeholder="e.g. John Doe" 
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:border-primary transition-colors text-lg" 
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-black text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                            <input 
                              type="email" 
                              placeholder="you@example.com" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:border-primary transition-colors text-lg" 
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-black text-slate-500 uppercase tracking-wider mb-2">Password</label>
                            <input 
                              type="password" 
                              placeholder="••••••••" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:border-primary transition-colors text-lg" 
                              required
                            />
                          </div>
                          <div className="flex items-start space-x-3 mt-4">
                            <input 
                              type="checkbox" 
                              id="ageConfirm"
                              checked={ageConfirm}
                              onChange={(e) => setAgeConfirm(e.target.checked)}
                              className="mt-1 w-5 h-5 accent-primary cursor-pointer"
                            />
                            <label htmlFor="ageConfirm" className="text-sm font-bold text-slate-600 cursor-pointer leading-tight">
                              I confirm I have permission from a parent or guardian to use this app.
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-danger text-sm font-bold text-center bg-danger/10 py-2 px-4 rounded-lg w-full mb-6"
                      >
                        {error}
                      </motion.div>
                    )}

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-16 text-xl tracking-widest font-black uppercase game-btn-primary mb-4"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full mx-auto"
                        />
                      ) : (
                        isRegistering ? "Create Account" : "Log In"
                      )}
                    </Button>

                    <div className="text-center mt-2 w-full">
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsRegistering(!isRegistering);
                          setError('');
                        }}
                        className="text-primary font-bold hover:underline"
                      >
                        {isRegistering ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                      </button>
                    </div>
                    <Button type="button" variant="ghost" className="mt-4 text-slate-500 hover:text-slate-800 text-lg font-bold" onClick={() => setIsLoginOpen(false)}>
                      Cancel
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
