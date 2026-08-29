import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Lock, Zap, Flame, Shield, Medal, Check, Compass } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import { useGameState } from '../lib/gameState';

import { AppLaunchTransition } from '../components/ui/AppLaunchTransition';

const achievementIcons: Record<string, React.ElementType> = {
  first: Star,
  saver: Zap,
  survivor: Flame,
  risk: Shield,
  diversify: Medal
};

export function LifeHub() {
  const { level, xp, nextLevelXp, health, netWorth, money, streakDays, achievements, missions, completeMission } = useGameState();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(level);

  useEffect(() => {
    if (level > prevLevel) {
      setShowLevelUp(true);
      setPrevLevel(level);
    }
  }, [level, prevLevel]);

  const handleMissionPlay = (missionId: string) => {
    completeMission(missionId);
  };



  useEffect(() => {
    if (showLevelUp) {
      const timer = setTimeout(() => setShowLevelUp(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate data loading to allow the AppLaunchTransition to do its splash + skeleton
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const xpProgress = (xp / nextLevelXp) * 100;

  return (
    <AppLaunchTransition isLoading={isLoading}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto space-y-10 relative pb-20"
    >
      {/* Background Watermark */}
      <div className="fixed bottom-0 right-0 opacity-5 pointer-events-none -z-10 overflow-hidden translate-x-1/4 translate-y-1/4">
        <Compass className="w-[600px] h-[600px] text-[#3E2723]" />
      </div>

      {/* Background Ambience */}
      <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-primary rounded-[2rem] border-4 border-white shadow-[0_10px_20px_rgba(124,92,255,0.3)] flex items-center justify-center rotate-3 relative hover:rotate-0 transition-transform">
             <div className="absolute -top-3 -right-3 bg-reward text-white font-black text-xs px-2 py-1 rounded-full shadow-md">LVL {level}</div>
             <Crown className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="medieval-wood-plaque px-6 py-2 rounded-xl text-3xl md:text-4xl font-display font-black tracking-widest uppercase shadow-lg inline-block">Life Hub</h1>
            <div className="flex items-center space-x-3 mt-2">
              <span className="text-[#F4E4BC] text-sm tracking-[0.2em] uppercase font-bold drop-shadow-sm">Player Passport</span>
            </div>
          </div>
        </div>
        {/* XP Bar */}
        <div className="medieval-parchment p-4 rounded-2xl flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest">Experience (XP)</span>
            <span className="text-xs font-mono font-black text-[#3E2723]">
              {xp.toLocaleString()} / {nextLevelXp.toLocaleString()}
            </span>
          </div>
          <div className="bg-[#E8DFCD] rounded-full h-4 overflow-hidden border border-[#8D6E63]/50 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-success rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut', type: 'spring' }}
            />
          </div>
        </div>
      </div>

      {/* Player Stats Passport */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="medieval-parchment p-6 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Crown className="w-20 h-20 text-[#3E2723]" /></div>
           <span className="text-[10px] uppercase font-black text-[#8D6E63] tracking-widest mb-2">Financial Health</span>
           <div className="text-5xl font-display font-black text-[#3E2723] mb-1">{health}<span className="text-2xl text-[#8D6E63]">/100</span></div>
           <Badge variant="outline" className="border-success text-success bg-emerald-50 mt-2 font-bold uppercase tracking-wider text-[9px]">Excellent</Badge>
        </div>
        
        <div className="medieval-parchment p-6 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Flame className="w-20 h-20 text-[#3E2723]" /></div>
           <span className="text-[10px] uppercase font-black text-[#8D6E63] tracking-widest mb-2">Current Streak</span>
           <div className="flex items-center space-x-2">
             <Flame className="w-8 h-8 text-warning animate-bounce" />
             <div className="text-5xl font-display font-black text-[#3E2723] mb-1">{streakDays}</div>
           </div>
           <span className="text-xs font-bold text-warning uppercase mt-2 tracking-wider">Days Active</span>
        </div>

        <div className="medieval-parchment p-6 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Star className="w-20 h-20 text-[#3E2723]" /></div>
           <span className="text-[10px] uppercase font-black text-[#8D6E63] tracking-widest mb-2">Available Balance</span>
           <div className="text-4xl font-display font-black text-success tracking-tight mb-1">₹{money.toLocaleString()}</div>
           <span className="text-xs font-bold text-[#8D6E63] uppercase mt-2 tracking-wider">Net Worth: ₹{netWorth.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Missions */}
        <section className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-display font-black text-[#3E2723] flex items-center uppercase tracking-widest">
            <Zap className="w-5 h-5 text-warning mr-2" /> Daily Quests
          </h2>
          <div className="space-y-4">
            {missions.map(m => (
              <Card key={m.id} className={cn(
                "medieval-parchment rounded-[2rem] transition-all",
                m.completed ? "opacity-60 bg-[#D2C4A7] border-[#8D6E63]/50 grayscale-[0.5]" : "hover:-translate-y-1 hover:shadow-lg"
              )}>
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <div className={cn(
                      "p-2.5 rounded-xl border-2",
                      m.completed ? "bg-[#E8DFCD] border-[#8D6E63]/50 text-[#8D6E63]" : "bg-[#FFFAEE] border-[#8D6E63] text-warning"
                    )}>
                      <Zap className="w-5 h-5" />
                    </div>
                    {m.completed ? (
                      <Badge variant="outline" className="border-[#8D6E63]/50 text-[#8D6E63] bg-[#E8DFCD] font-bold tracking-wider text-[9px] uppercase"><Check className="w-3 h-3 mr-1" /> Done</Badge>
                    ) : (
                      <Badge variant="outline" className="border-[#8D6E63] text-success bg-[#E8DFCD] font-bold tracking-wider text-[9px] uppercase">+{m.reward} XP</Badge>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-[#3E2723] uppercase tracking-wide mb-1">{m.title}</h3>
                  <p className="text-xs text-[#5D4037] mb-5 font-medium leading-relaxed">Simulated curriculum training for {m.title}.</p>
                  
                  <div className="mt-auto">
                    <Button 
                      className={cn(
                        "w-full h-10 text-[10px] tracking-widest font-black uppercase",
                        m.completed ? "bg-[#E8DFCD] text-[#8D6E63] border-2 border-[#8D6E63]/30 hover:bg-[#E8DFCD]" : "game-btn-primary"
                      )} 
                      onClick={() => handleMissionPlay(m.id)}
                      disabled={m.completed}
                    >
                      {m.completed ? 'Completed' : 'Play Quest'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements Showcase */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-display font-black text-[#3E2723] flex items-center uppercase tracking-widest">
            <Medal className="w-5 h-5 text-reward mr-2" /> Achievement Badges
          </h2>
          <div className="medieval-parchment p-8 rounded-[2rem]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {achievements.map((ach, i) => {
                const unlocked = ach.unlocked;
                const IconComponent = achievementIcons[ach.id] || Star;
                return (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={unlocked ? { scale: 1.05, rotate: 2 } : {}}
                    className={cn(
                      "relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center group h-36 shadow-sm",
                      unlocked ? "bg-[#E8DFCD] border-[#8D6E63] hover:shadow-md" : "bg-[#D2C4A7] border-[#8D6E63]/30 opacity-70 grayscale"
                    )}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center mb-3 border-4 shadow-inner transition-colors",
                      unlocked ? "bg-[#FFFAEE] border-[#8D6E63]/50 text-primary group-hover:text-reward" : "bg-[#E8DFCD] border-[#8D6E63]/30 text-[#8D6E63]"
                    )}>
                      {/* @ts-ignore */}
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={cn(
                      "text-xs font-black uppercase tracking-wider",
                      unlocked ? "text-[#3E2723]" : "text-[#5D4037]"
                    )}>{ach.name}</span>

                    {!unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#1C2C16]/5 rounded-2xl backdrop-blur-[1px]">
                        <div className="p-2 bg-[#F4E4BC]/80 rounded-full shadow-sm"><Lock className="w-4 h-4 text-[#8D6E63]" /></div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Level Up Overlay */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.6 }}
              className="medieval-parchment border-[6px] border-reward rounded-[2rem] p-10 text-center shadow-[0_20px_60px_rgba(245,185,66,0.5)] max-w-sm w-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,185,66,0.1)_0%,transparent_100%)] pointer-events-none"></div>
              
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(245,185,66,0.2)_180deg,transparent_360deg)] pointer-events-none"
              />

              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-tr from-reward to-amber-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-[#F4E4BC] animate-bounce">
                  <Crown className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-4xl font-display font-black text-[#3E2723] mb-2 tracking-widest uppercase drop-shadow-sm">LEVEL UP!</h2>
                
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <span className="text-3xl font-mono font-black text-[#8D6E63] line-through">{level - 1}</span>
                  <span className="text-2xl text-[#5D4037]">→</span>
                  <span className="text-5xl font-mono font-black text-primary drop-shadow-sm">{level}</span>
                </div>
                
                <div className="inline-flex items-center justify-center px-4 py-2 bg-[#FFFAEE] border border-[#8D6E63]/50 rounded-xl shadow-inner">
                   <Star className="w-4 h-4 text-primary mr-2" />
                   <span className="text-xs font-black text-[#5D4037] uppercase tracking-widest">New Perks Unlocked</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </AppLaunchTransition>
  );
}
