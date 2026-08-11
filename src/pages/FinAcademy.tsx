import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Check, Lock, Play, Zap, Trophy, ShieldAlert, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import { useGameState } from '../lib/gameState';
import { useNavigate } from 'react-router-dom';

type MissionState = 'idle' | 'active' | 'analyzing' | 'reward';

export function FinAcademy() {
  const [missionState, setMissionState] = useState<MissionState>('idle');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { completeMission, level, xp } = useGameState();
  const navigate = useNavigate();

  const roadmapNodes = [
    { id: 'basics', title: 'Money Basics', status: 'completed' },
    { id: 'saving', title: 'Saving', status: 'completed' },
    { id: 'investing', title: 'Investing', status: 'current' },
    { id: 'risk', title: 'Risk', status: 'locked' },
    { id: 'markets', title: 'Markets', status: 'locked' },
    { id: 'psych', title: 'Financial Psychology', status: 'locked' },
  ];

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setMissionState('analyzing');
    
    // Simulate analysis delay
    setTimeout(() => {
      setMissionState('reward');
    }, 2500);
  };

  const finishMission = () => {
    completeMission('inflation');
    // Go to Market City and trigger the inflation event
    navigate('/market', { state: { triggerEvent: 'inflation' } });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto space-y-10 relative"
    >
      {/* Header Area */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between space-y-6 md:space-y-0">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-display font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/80 uppercase">
              Fin Academy
            </h1>
          </div>
          <p className="text-textSecondary text-lg tracking-wide">Financial knowledge becomes financial power.</p>
        </div>

        {/* Header Stats */}
        <div className="flex space-x-4">
          <div className="glass px-6 py-3 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-xs text-textSecondary uppercase tracking-widest">Level</span>
            <span className="text-xl font-bold text-white">{level}</span>
          </div>
          <div className="glass px-6 py-3 rounded-xl border border-primary/30 glow-primary flex flex-col items-center">
            <span className="text-xs text-primary uppercase tracking-widest">Progress</span>
            <span className="text-xl font-bold text-white">34%</span>
          </div>
          <div className="glass px-6 py-3 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-xs text-textSecondary uppercase tracking-widest">XP Earned</span>
            <span className="text-xl font-mono font-bold text-success">{xp}</span>
          </div>
          <div className="glass px-6 py-3 rounded-xl border border-reward/30 shadow-[0_0_15px_rgba(245,185,66,0.3)] flex flex-col items-center">
            <span className="text-xs text-reward uppercase tracking-widest">Streak</span>
            <span className="text-xl font-bold text-white">12</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 relative z-10">
        
        {/* Visual Learning Roadmap (Left Column - Spans 2) */}
        <div className="lg:col-span-2 glass-elevated rounded-3xl p-10 border border-white/5 relative overflow-hidden">
          {/* Subtle Background Effects for Roadmap */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

          <h2 className="text-2xl font-display font-bold mb-10 flex items-center">
            <Zap className="w-5 h-5 text-primary mr-3" />
            Learning Pathway
          </h2>
          
          <div className="relative py-4 pl-8 md:pl-24">
            {/* SVG Connection Path */}
            <div className="absolute left-[39px] md:left-[103px] top-0 bottom-0 w-1 bg-surface rounded-full">
               <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-secondary to-transparent" style={{ height: '50%' }}></div>
            </div>

            {/* Nodes */}
            <div className="space-y-16">
              {roadmapNodes.map((node, index) => (
                <motion.div 
                  key={node.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="relative flex items-center"
                >
                  {/* Node Icon/Indicator */}
                  <div className={cn(
                    "absolute -left-10 w-12 h-12 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-500",
                    node.status === 'completed' ? "bg-primary border-background shadow-[0_0_15px_rgba(124,92,255,0.6)]" : 
                    node.status === 'current' ? "bg-background border-secondary shadow-[0_0_20px_rgba(0,212,255,0.8)] scale-125" : 
                    "bg-surface border-background"
                  )}>
                    {node.status === 'completed' && <Check className="w-5 h-5 text-white" />}
                    {node.status === 'current' && <div className="w-3 h-3 rounded-full bg-secondary animate-pulse-slow"></div>}
                    {node.status === 'locked' && <Lock className="w-4 h-4 text-textSecondary" />}
                  </div>

                  {/* Node Content */}
                  <div className={cn(
                    "ml-10 p-6 rounded-2xl w-full max-w-md transition-all duration-300 border backdrop-blur-sm",
                    node.status === 'completed' ? "glass border-primary/20 opacity-80" : 
                    node.status === 'current' ? "bg-surface/80 border-secondary/50 glow-secondary scale-[1.02]" : 
                    "bg-surface/30 border-white/5 opacity-50 grayscale"
                  )}>
                    <div className="flex justify-between items-center">
                      <h3 className={cn("font-display font-bold text-xl tracking-wide", 
                        node.status === 'current' ? "text-secondary" : "text-white"
                      )}>
                        {node.title}
                      </h3>
                      {node.status === 'completed' && <Badge variant="default" className="text-[10px]">Mastered</Badge>}
                      {node.status === 'current' && <Badge variant="secondary" className="text-[10px] animate-pulse">In Progress</Badge>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Mission Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="glass border-secondary/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent"></div>
              
              <CardHeader className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="outline" className="border-secondary text-secondary">Active Mission</Badge>
                  <Badge variant="glass" className="text-textSecondary">Beginner</Badge>
                </div>
                <CardTitle className="text-3xl text-white">Understanding Inflation</CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-6">
                 <p className="text-textSecondary">
                   Inflation erodes purchasing power over time. Can you adapt your strategy to protect your wealth?
                 </p>
                 
                 <div className="space-y-2">
                   <div className="flex justify-between text-sm font-semibold">
                     <span className="text-white">Progress</span>
                     <span className="text-secondary">80%</span>
                   </div>
                   <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary w-[80%] shadow-[0_0_10px_rgba(0,212,255,0.8)]"></div>
                   </div>
                 </div>

                 <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-xs text-textSecondary uppercase tracking-wider">Reward</span>
                    <span className="font-mono font-bold text-success">+250 XP</span>
                 </div>

                 <Button 
                   className="w-full h-12 text-sm tracking-widest font-bold mt-4 bg-secondary text-background hover:bg-secondary/90 shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                   onClick={() => setMissionState('active')}
                 >
                   <Play className="w-4 h-4 mr-2" />
                   Continue Mission
                 </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Interactive Mission Overlay */}
      <AnimatePresence>
        {missionState !== 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl glass-elevated border border-primary/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(124,92,255,0.2)]"
            >
              {/* Mission Content State */}
              {missionState === 'active' && (
                <div className="p-10">
                  <div className="flex items-center space-x-3 mb-8">
                    <ShieldAlert className="w-6 h-6 text-warning" />
                    <span className="text-sm font-bold tracking-widest text-warning uppercase">Scenario Simulation</span>
                  </div>
                  
                  <h2 className="text-3xl font-display font-bold text-white mb-6">
                    Inflation rises from 4% to 7%. What would you change?
                  </h2>
                  <p className="text-textSecondary mb-10">
                    The central bank has announced higher than expected inflation rates. Your current portfolio relies heavily on cash and low-yield bonds.
                  </p>
                  
                  <div className="space-y-4">
                    {['Increase savings', 'Diversify investments', 'Hold more cash', 'Ignore the change'].map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionSelect(i)}
                        className={cn(
                          "w-full text-left p-6 rounded-xl border transition-all duration-300 group flex items-center justify-between",
                          selectedOption === i 
                            ? "glass border-primary bg-primary/20" 
                            : "glass border-white/10 hover:border-primary/50 hover:bg-primary/10"
                        )}
                      >
                        <span className="text-lg text-textPrimary group-hover:text-white transition-colors">{opt}</span>
                        <ArrowRight className="w-5 h-5 text-transparent group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Analyzing State */}
              {missionState === 'analyzing' && (
                <div className="p-24 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
                  <div className="relative w-32 h-32 flex items-center justify-center">
                     <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin glow-primary"></div>
                     <Zap className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold text-primary tracking-widest uppercase mb-2">Decision Analysis</h2>
                    <p className="text-textSecondary font-mono tracking-widest text-sm">RUNNING SIMULATION PARAMETERS...</p>
                  </div>
                </div>
              )}

              {/* Reward State */}
              {missionState === 'reward' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 flex flex-col items-center text-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-success/20 via-background to-background pointer-events-none"></div>
                  
                  <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mb-6 glow-success border border-success/50 relative z-10">
                    <Trophy className="w-10 h-10 text-success" />
                  </div>
                  
                  <h2 className="text-4xl font-display font-bold text-white mb-2 relative z-10">Excellent Choice!</h2>
                  <p className="text-textSecondary mb-8 max-w-md relative z-10">
                    Diversifying investments into assets that historically outpace inflation (like equities or real estate) protects your purchasing power.
                  </p>
                  
                  <div className="flex space-x-4 mb-10 relative z-10">
                    <div className="px-6 py-4 rounded-xl bg-black/50 border border-success/30 flex flex-col items-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                      <span className="text-xs text-textSecondary uppercase tracking-widest mb-1">XP Reward</span>
                      <span className="text-2xl font-mono font-bold text-success">+250 XP</span>
                    </div>
                    <div className="px-6 py-4 rounded-xl bg-black/50 border border-primary/30 flex flex-col items-center shadow-[0_0_15px_rgba(124,92,255,0.3)]">
                      <span className="text-xs text-textSecondary uppercase tracking-widest mb-1">Unlocked</span>
                      <span className="text-lg font-bold text-primary">Market Insight</span>
                    </div>
                  </div>
                  <div className="bg-[#111827] border border-primary/30 rounded-2xl p-8 mb-8 w-full max-w-md text-left shadow-[0_0_30px_rgba(124,92,255,0.15)] relative z-10 glass-elevated">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <h4 className="text-primary font-bold text-xs tracking-[0.2em] uppercase">Reflection</h4>
                    </div>
                    <p className="text-white text-lg font-medium leading-relaxed italic">"What did your decision teach you about changing economic conditions?"</p>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full max-w-sm h-14 tracking-widest font-bold relative z-10"
                    onClick={finishMission}
                  >
                    Experience Market Impact
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
