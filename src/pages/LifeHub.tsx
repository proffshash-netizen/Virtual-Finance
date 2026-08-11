import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Lock, Zap, Flame, Play, Shield, Medal, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import { useGameState } from '../lib/gameState';



const achievementIcons: Record<string, React.ElementType> = {
  first: Star,
  saver: Zap,
  survivor: Flame,
  risk: Shield,
  diversify: Medal
};

export function LifeHub() {
  const { level, xp, nextLevelXp, health, netWorth, streakDays, achievements, missions, completeMission } = useGameState();
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

  const xpProgress = (xp / nextLevelXp) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto space-y-10 relative pb-20"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/80 uppercase">WELCOME BACK</h1>
          <div className="flex items-center space-x-2 mt-2">
            <Crown className="w-6 h-6 text-primary" />
            <span className="text-2xl font-bold text-white">Level {level}</span>
          </div>
        </div>
        {/* XP Bar */}
        <div className="w-full md:w-1/3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-textSecondary uppercase">XP</span>
            <span className="text-xs text-textSecondary">
              {xp.toLocaleString()} / {nextLevelXp.toLocaleString()}
            </span>
          </div>
          <div className="bg-surface rounded-full h-3 overflow-hidden border border-white/10">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Player Card */}
      <Card className="glass border-primary/20 glow-primary p-6 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-xl text-white">
            <Star className="w-5 h-5 text-reward" />
            <span>Financial Explorer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm text-textSecondary">
          <div>
            <span className="block uppercase text-xs text-textSecondary">Financial Health</span>
            <span className="text-lg font-bold text-white">{health}/100</span>
          </div>
          <div>
            <span className="block uppercase text-xs text-textSecondary">Streak</span>
            <span className="flex items-center space-x-1 text-lg font-bold text-white">
              <Flame className="w-5 h-5 text-warning" />
              <span>{streakDays} days</span>
            </span>
          </div>
          <div>
            <span className="block uppercase text-xs text-textSecondary">Net Worth</span>
            <span className="text-lg font-bold text-white">₹{netWorth.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Missions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-white mb-4">MISSIONS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missions.map(m => (
            <Card key={m.id} className="glass border-white/5 p-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-white">{m.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-textSecondary text-sm">Simulated curriculum training for {m.title}.</p>
                <div className="flex items-center justify-between mt-4">
                  <Badge variant="secondary" className="text-xs font-medium uppercase">Reward: +{m.reward} XP</Badge>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 text-background" 
                    onClick={() => handleMissionPlay(m.id)}
                    disabled={m.completed}
                  >
                    {m.completed ? (
                      <span className="flex items-center"><Check className="w-4 h-4 mr-1" /> DONE</span>
                    ) : (
                      <span className="flex items-center"><Play className="w-4 h-4 mr-1" /> PLAY</span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-display font-bold text-white mb-4">ACHIEVEMENTS</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {achievements.map(ach => {
            const unlocked = ach.unlocked;
            const IconComponent = achievementIcons[ach.id] || Star;
            return (
              <motion.div
                key={ach.id}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "relative p-4 rounded-xl border transition-all duration-300",
                  unlocked ? "glass border-primary/30" : "bg-surface/30 border-white/5 opacity-60 grayscale"
                )}
              >
                <div className="flex flex-col items-center space-y-2 text-center">
                  <IconComponent className={cn("w-8 h-8", unlocked ? "text-primary" : "text-textSecondary")} />
                  <span className={cn("text-xs font-medium", unlocked ? "text-white" : "text-textSecondary")}>{ach.name}</span>
                </div>
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                    <Lock className="w-6 h-6 text-textSecondary" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Level Up Overlay */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-surface/90 border border-primary/30 rounded-2xl p-8 text-center shadow-2xl glow-primary"
            >
              <h2 className="text-3xl font-display font-bold text-primary mb-4">LEVEL UP!</h2>
              <p className="text-xl text-white mb-2">{level - 1} → {level}</p>
              <p className="text-lg text-textSecondary">NEW AREA UNLOCKED</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
