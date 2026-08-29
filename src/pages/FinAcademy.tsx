import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Check, Lock, Play, Zap, Trophy, ShieldAlert, ArrowRight, GraduationCap, Library, Scroll } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import { useGameState } from '../lib/gameState';
import { useNavigate } from 'react-router-dom';

type MissionState = 'idle' | 'intro' | 'scenario' | 'analyzing' | 'reward';

export function FinAcademy() {
  const [missionState, setMissionState] = useState<MissionState>('idle');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { completeMission, level, xp, streakDays } = useGameState();
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
      {/* Background Watermark */}
      <div className="fixed bottom-0 right-0 opacity-5 pointer-events-none -z-10 overflow-hidden translate-x-1/4 translate-y-1/4">
        <GraduationCap className="w-[600px] h-[600px] text-[#3E2723]" />
      </div>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between space-y-6 md:space-y-0">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <BookOpen className="w-8 h-8 text-[#E8DFCD]" />
            <h1 className="medieval-wood-plaque px-6 py-2 rounded-xl text-3xl font-display font-black tracking-widest text-center shadow-lg">
              Fin Academy
            </h1>
          </div>
          <p className="text-[#E8DFCD] text-lg tracking-wide font-medium drop-shadow-md">Financial knowledge becomes financial power.</p>
        </div>

        {/* Header Stats */}
        <div className="flex space-x-4">
          <div className="medieval-parchment px-6 py-3 rounded-xl flex flex-col items-center">
            <span className="text-xs text-[#8D6E63] uppercase tracking-widest font-black">Level</span>
            <span className="text-xl font-black text-[#3E2723]">{level}</span>
          </div>
          <div className="medieval-parchment px-6 py-3 rounded-xl border-primary glow-primary flex flex-col items-center">
            <span className="text-xs text-primary uppercase tracking-widest font-black">Progress</span>
            <span className="text-xl font-black text-[#3E2723]">34%</span>
          </div>
          <div className="medieval-parchment px-6 py-3 rounded-xl flex flex-col items-center">
            <span className="text-xs text-[#8D6E63] uppercase tracking-widest font-black">XP Earned</span>
            <span className="text-xl font-mono font-black text-success">{xp}</span>
          </div>
          <div className="medieval-parchment px-6 py-3 rounded-xl flex flex-col items-center">
            <span className="text-xs text-reward uppercase tracking-widest font-black">Streak</span>
            <span className="text-xl font-black text-[#3E2723]">{streakDays}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 relative z-10">
        
        {/* Visual Learning Roadmap (Left Column - Spans 2) */}
        <div className="lg:col-span-2 medieval-parchment p-10 relative overflow-hidden rounded-[32px]">
          <h2 className="text-2xl font-display font-black text-[#3E2723] mb-10 flex items-center uppercase tracking-wide">
            <Zap className="w-5 h-5 text-primary mr-3 animate-pulse" />
            Learning Pathway
          </h2>
          
          <div className="relative py-4 pl-8 md:pl-24">
            {/* SVG Connection Path */}
            <div className="absolute left-[39px] md:left-[103px] top-0 bottom-0 w-1.5 bg-slate-200 rounded-full">
               <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-secondary to-slate-200" style={{ height: '50%' }}></div>
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
                    node.status === 'completed' ? "bg-primary border-white shadow-[0_0_15px_rgba(109,93,245,0.4)]" : 
                    node.status === 'current' ? "bg-white border-secondary shadow-[0_0_20px_rgba(56,189,248,0.6)] scale-125 border-4 animate-pulse" : 
                    "bg-slate-100 border-slate-300"
                  )}>
                    {node.status === 'completed' && <Check className="w-5 h-5 text-white" />}
                    {node.status === 'current' && <div className="w-3 h-3 rounded-full bg-secondary"></div>}
                    {node.status === 'locked' && <Lock className="w-4 h-4 text-slate-400" />}
                  </div>

                  {/* Node Content */}
                  <div className={cn(
                    "ml-10 p-6 rounded-2xl w-full max-w-md transition-all duration-300 border-2",
                    node.status === 'completed' ? "bg-[#E8DFCD] border-[#8D6E63]/50 opacity-90" : 
                    node.status === 'current' ? "bg-[#FFFAEE] border-[#5D4037] shadow-md scale-[1.02]" : 
                    "bg-[#D2C4A7] border-[#8D6E63]/30 opacity-60 grayscale"
                  )}>
                    <div className="flex justify-between items-center">
                      <h3 className={cn("font-display font-black text-lg tracking-wide uppercase flex items-center", 
                        node.status === 'current' ? "text-primary" : "text-slate-700"
                      )}>
                        <Library className="w-5 h-5 mr-2 opacity-70" />
                        {node.title}
                      </h3>
                      {node.status === 'completed' && <Badge variant="success" className="text-[10px] uppercase font-bold tracking-wider">Mastered</Badge>}
                      {node.status === 'current' && <Badge variant="default" className="text-[10px] animate-pulse bg-secondary text-white uppercase font-bold tracking-wider">Active</Badge>}
                      {node.status === 'locked' && <Badge variant="outline" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Locked</Badge>}
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
            <Card className="medieval-parchment rounded-[32px] overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E8DFCD]/50 to-transparent pointer-events-none"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="outline" className="border-[#5D4037] text-[#5D4037] bg-[#E8DFCD] uppercase font-bold tracking-wider text-[10px]">Active Quest</Badge>
                  <Badge variant="glass" className="bg-[#FFFAEE]/80 text-[#3E2723] border border-[#8D6E63] uppercase font-bold tracking-wider text-[10px]">Beginner</Badge>
                </div>
                <CardTitle className="text-2xl font-black text-[#3E2723] uppercase tracking-wide flex items-center">
                  <Scroll className="w-6 h-6 mr-3 text-[#8D6E63]" />
                  Inflation Hunt
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-6">
                 <p className="text-sm text-[#5D4037] font-medium leading-relaxed">
                   Inflation erodes purchasing power over time. Can you adapt your strategy to protect your wealth?
                 </p>
                 
                 <div className="space-y-2">
                   <div className="flex justify-between text-xs font-black uppercase text-[#5D4037] tracking-wider">
                     <span>Quest Progress</span>
                     <span>80%</span>
                   </div>
                   <div className="h-3 w-full bg-[#E8DFCD] rounded-full overflow-hidden border border-[#8D6E63]/50">
                      <div className="h-full bg-gradient-to-r from-primary to-success w-[80%] rounded-full shadow-inner"></div>
                   </div>
                 </div>

                 <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#E8DFCD] border border-[#8D6E63]/50 shadow-sm">
                    <span className="text-[10px] font-black text-[#8D6E63] uppercase tracking-wider">Reward</span>
                    <span className="font-mono font-bold text-success flex items-center">
                      <Zap className="w-3.5 h-3.5 text-success mr-1 animate-pulse" />
                      +250 XP
                    </span>
                 </div>

                 <Button 
                   className="w-full h-12 text-xs tracking-widest font-black uppercase game-btn-secondary"
                   onClick={() => setMissionState('intro')}
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl medieval-parchment rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Intro State */}
              {missionState === 'intro' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-16 flex flex-col items-center text-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#E8DFCD]/50 to-transparent pointer-events-none"></div>
                  <div className="w-20 h-20 bg-[#E8DFCD] rounded-full flex items-center justify-center mb-6 shadow-inner border border-[#8D6E63] relative z-10">
                    <BookOpen className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-3xl font-display font-black text-[#3E2723] uppercase tracking-wide mb-4 relative z-10">
                    Mission: Inflation Hunt
                  </h2>
                  <p className="text-[#5D4037] font-medium mb-8 max-w-md relative z-10">
                    Inflation erodes purchasing power over time. In this simulation, you will learn to adapt your strategy to protect your wealth.
                  </p>
                  <Button 
                    className="w-full max-w-xs h-14 game-btn-primary uppercase tracking-widest relative z-10"
                    onClick={() => setMissionState('scenario')}
                  >
                    Start Scenario
                  </Button>
                </motion.div>
              )}

              {/* Scenario State */}
              {missionState === 'scenario' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-10"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <ShieldAlert className="w-6 h-6 text-warning animate-bounce" />
                    <span className="text-xs font-black tracking-widest text-warning uppercase">Scenario Simulation</span>
                  </div>
                  
                  <h2 className="text-3xl font-display font-black text-[#3E2723] mb-4 uppercase tracking-wide">
                    Inflation rises from 4% to 7%. What would you change?
                  </h2>
                  <p className="text-sm font-medium text-[#5D4037] mb-10 leading-relaxed">
                    The central bank has announced higher than expected inflation rates. Your current portfolio relies heavily on cash and low-yield bonds.
                  </p>
                  
                  <div className="space-y-4">
                    {['Increase savings', 'Diversify investments', 'Hold more cash', 'Ignore the change'].map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionSelect(i)}
                        className={cn(
                          "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 group flex items-center justify-between shadow-sm font-sans",
                          selectedOption === i 
                            ? "bg-[#FFFAEE] border-[#5D4037] text-primary scale-[1.02] shadow-md" 
                            : "bg-[#E8DFCD] border-[#8D6E63]/50 text-[#3E2723] hover:border-[#5D4037] hover:bg-[#FFFAEE] hover:-translate-y-1 hover:shadow-md"
                        )}
                      >
                        <span className="text-base font-bold transition-colors">{opt}</span>
                        <ArrowRight className="w-5 h-5 text-transparent group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Analyzing State */}
              {missionState === 'analyzing' && (
                <div className="p-24 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden bg-slate-900 text-white">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_100%)]"></div>
                  <div className="relative w-32 h-32 flex items-center justify-center">
                     <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin glow-primary"></div>
                     <Zap className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-black text-white tracking-widest uppercase mb-2">Decision Analysis</h2>
                    <p className="text-indigo-300 font-mono tracking-widest text-xs">RUNNING SIMULATION PARAMETERS...</p>
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
                  {/* Floating XP Animation */}
                  <motion.div 
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 1, 0], y: -80, scale: [0.5, 1.2, 1, 1] }}
                    transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
                    className="absolute top-1/4 right-1/4 flex items-center text-success font-black text-3xl drop-shadow-md z-50 pointer-events-none"
                  >
                    +250 XP
                  </motion.div>

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08)_0%,transparent_100%)] pointer-events-none"></div>
                  
                  <div className="w-24 h-24 rounded-full bg-[#E8DFCD] flex items-center justify-center mb-6 border border-[#8D6E63] relative z-10 shadow-inner animate-bounce">
                    <Trophy className="w-10 h-10 text-success" />
                  </div>
                  
                  <h2 className="text-4xl font-display font-black text-[#3E2723] mb-2 relative z-10 uppercase tracking-wide">Excellent Choice!</h2>
                  <p className="text-[#5D4037] font-medium mb-8 max-w-md relative z-10 text-sm leading-relaxed">
                    Diversifying investments into assets that historically outpace inflation (like equities or real estate) protects your purchasing power.
                  </p>
                  
                  <div className="flex space-x-6 mb-10 relative z-10">
                    <div className="px-6 py-4 rounded-2xl bg-[#E8DFCD] border border-[#8D6E63] flex flex-col items-center shadow-sm">
                      <span className="text-[10px] text-[#8D6E63] uppercase tracking-widest font-black mb-1">XP Reward</span>
                      <span className="text-xl font-mono font-black text-success flex items-center">
                        <Zap className="w-4 h-4 mr-1 text-success animate-pulse" />
                        +250 XP
                      </span>
                    </div>
                    <div className="px-6 py-4 rounded-2xl bg-[#E8DFCD] border border-[#8D6E63] flex flex-col items-center shadow-sm">
                      <span className="text-[10px] text-[#8D6E63] uppercase tracking-widest font-black mb-1">Unlocked</span>
                      <span className="text-sm font-black text-primary uppercase tracking-wider">Market Insight</span>
                    </div>
                  </div>
                  <div className="bg-[#E8DFCD] border-2 border-[#8D6E63] rounded-3xl p-6 mb-8 w-full max-w-md text-left shadow-sm relative z-10">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#8D6E63] animate-pulse"></div>
                      <h4 className="text-[#5D4037] font-black text-[10px] tracking-[0.2em] uppercase">Reflection</h4>
                    </div>
                    <p className="text-[#3E2723] text-base font-bold leading-relaxed italic">"What did your decision teach you about changing economic conditions?"</p>
                  </div>

                  <Button 
                    className="w-full max-w-sm h-14 tracking-widest font-black uppercase game-btn-primary relative z-10"
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
