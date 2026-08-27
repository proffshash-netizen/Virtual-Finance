import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, AlertCircle, ArrowUpRight, ArrowDownRight, 
  TrendingUp, Activity, BarChart3, Building2, Server, 
  HeartPulse, Zap, ShoppingCart, Play
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';

type Indicator = {
  label: string;
  value: string;
  icon: React.ElementType;
};

const initialSectors = [
  { name: 'Technology', value: 4.2, icon: Server },
  { name: 'Banking', value: -1.8, icon: Building2 },
  { name: 'Healthcare', value: 2.1, icon: HeartPulse },
  { name: 'Energy', value: 3.6, icon: Zap },
  { name: 'Consumer', value: -0.9, icon: ShoppingCart },
];

export function MarketCity() {
  const location = useLocation();
  const navigate = useNavigate();
  const [eventState, setEventState] = useState<'idle' | 'simulating' | 'completed'>('idle');

  // Simulated state for after event
  const isPostEvent = eventState === 'completed';

  const indicators: Indicator[] = [
    { label: 'Inflation', value: isPostEvent ? '5.8%' : '6.2%', icon: TrendingUp },
    { label: 'Interest Rate', value: isPostEvent ? '7.5%' : '7.0%', icon: Activity },
    { label: 'GDP Growth', value: isPostEvent ? '6.5%' : '6.8%', icon: BarChart3 },
    { label: 'Market Index', value: isPostEvent ? '-1.2%' : '+2.4%', icon: Globe },
  ];

  const sectors = initialSectors.map(s => ({
    ...s,
    // Simulate market pressure: tech drops, banking rises, etc.
    value: isPostEvent ? (s.name === 'Banking' ? 2.5 : s.name === 'Technology' ? -2.1 : s.value - 1.5) : s.value
  }));

  const handleExperienceEvent = () => {
    setEventState('simulating');
    setTimeout(() => {
      setEventState('completed');
    }, 2500);
  };

  useEffect(() => {
    if (location.state?.triggerEvent === 'inflation') {
      handleExperienceEvent();
    }
  }, [location.state]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto space-y-10 relative pb-20"
    >
      {/* Background Ambience specific to Market City */}
      <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Globe className="w-8 h-8 text-secondary shadow-[0_0_15px_rgba(56,189,248,0.3)] rounded-full animate-spin" style={{ animationDuration: '20s' }} />
            <h1 className="text-4xl font-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary/80 uppercase">
              Market City
            </h1>
          </div>
          <div className="flex items-center space-x-3 mt-3">
            <div className="w-2.5 h-2.5 rounded-full bg-success animate-ping"></div>
            <p className="text-indigo-200 text-sm tracking-[0.2em] uppercase font-bold">Economic Weather Simulation</p>
          </div>
        </div>

        {/* Market Mood */}
        <div className="game-card px-8 py-5 rounded-2xl border-l-4 border-l-warning flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-warning/5 group-hover:bg-warning/10 transition-colors pointer-events-none"></div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-2 relative z-10">Market Mood</span>
          <div className="flex items-center space-x-2 relative z-10">
            <AlertCircle className="w-5 h-5 text-warning animate-pulse" />
            <span className="text-2xl font-display font-black text-warning tracking-widest uppercase">
              {isPostEvent ? 'Volatile' : 'Cautious'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Macro Indicators & Sectors */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Economic Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {indicators.map((ind, i) => (
                <motion.div
                  key={`${ind.label}-${isPostEvent}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="game-card p-5 rounded-xl flex flex-col relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    {/* @ts-ignore */}
                    <ind.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black relative z-10">{ind.label}</span>
                  <span className={cn(
                    "text-2xl font-mono font-black mt-1 relative z-10 transition-colors duration-500",
                    ind.label === 'GDP Growth' || ind.label === 'Market Index' && !isPostEvent ? "text-success" : "text-slate-800"
                  )}>{ind.value}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sector Performance */}
          <Card className="game-card">
            <CardHeader>
              <CardTitle className="text-xl font-black text-slate-800 flex items-center space-x-2 uppercase tracking-wide">
                <BarChart3 className="w-5 h-5 text-secondary" />
                <span>Sector Weather Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {sectors.map((sector, i) => {
                const isPositive = sector.value >= 0;
                // Calculate an arbitrary width for visualization based on the max value
                const width = Math.min(Math.abs(sector.value) * 15 + 10, 100);

                // Add playful weather labels
                const weatherStatus = isPositive 
                  ? (sector.value > 3.5 ? "Sunny Growth" : "Mild Breezes")
                  : (sector.value < -1.5 ? "Stormy Dip" : "Cloudy Overcast");

                return (
                  <div key={sector.name} className="flex items-center justify-between group py-1.5 border-b border-slate-100 last:border-b-0">
                    <div className="w-1/3 flex flex-col justify-center">
                      <div className="flex items-center space-x-2.5">
                        <sector.icon className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-bold text-slate-700">{sector.name}</span>
                      </div>
                      <span className={cn("text-[9px] uppercase tracking-wider font-black mt-1 pl-6", 
                        isPositive ? "text-emerald-500" : "text-rose-500"
                      )}>{weatherStatus}</span>
                    </div>
                    
                    {/* Animated Bar Graph */}
                    <div className="w-1/3 h-3 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/50 shadow-inner">
                       {/* Center line for positive/negative */}
                       <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 z-10"></div>
                       
                       <AnimatePresence>
                         {isPositive ? (
                           <motion.div 
                             key={`pos-${sector.name}-${isPostEvent}`}
                             initial={{ width: 0 }}
                             animate={{ width: `${width / 2}%` }}
                             transition={{ duration: 1.5, delay: i * 0.1, type: "spring", bounce: 0.4 }}
                             className="absolute left-1/2 h-full bg-gradient-to-r from-success to-emerald-400 rounded-r-full shadow-sm origin-left"
                           ></motion.div>
                         ) : (
                           <motion.div 
                             key={`neg-${sector.name}-${isPostEvent}`}
                             initial={{ width: 0 }}
                             animate={{ width: `${width / 2}%`, x: '-100%' }}
                             transition={{ duration: 1.5, delay: i * 0.1, type: "spring", bounce: 0.4 }}
                             className="absolute left-1/2 h-full bg-gradient-to-l from-danger to-rose-400 rounded-l-full shadow-sm origin-right"
                           ></motion.div>
                         )}
                       </AnimatePresence>
                    </div>

                    <div className="w-1/4 flex justify-end">
                      <motion.div
                        key={`${sector.value}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "flex items-center space-x-1 font-mono font-black text-sm",
                          isPositive ? "text-success" : "text-danger"
                        )}
                      >
                        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {Math.abs(sector.value).toFixed(1)}%
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Economic Event */}
        <div className="lg:col-span-1">
          <Card className="game-card border-warning/30 relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-warning">
              <AlertCircle className="w-32 h-32" />
            </div>
            
            <CardHeader className="relative z-10 border-b border-slate-100 pb-6">
              <Badge variant="outline" className="w-fit mb-4 border-warning text-warning bg-orange-50 uppercase tracking-widest font-black text-[9px]">Active Economic Event</Badge>
              <CardTitle className="text-2xl font-black text-slate-800 uppercase tracking-wide">Rate Hike Quest</CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 flex-1 flex flex-col pt-6 text-slate-600">
              <p className="text-slate-600 mb-8 text-base leading-relaxed italic border-l-4 border-indigo-200 pl-4 font-medium">
                "The Central Bank has announced a 50 basis point increase in benchmark interest rates to combat inflation."
              </p>

              <div className="space-y-4 mb-8">
                <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Simulated Effects</h4>
                
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-600">Borrowing Costs</span>
                  <div className="flex items-center text-danger font-black text-xs uppercase">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> High
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-600">Savings Returns</span>
                  <div className="flex items-center text-success font-black text-xs uppercase">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Rising
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-600">Equity Pressure</span>
                  <div className="flex items-center text-danger font-black text-xs uppercase">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> Falling
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                {eventState === 'idle' && (
                  <Button 
                    className="w-full h-14 text-xs tracking-widest font-black uppercase game-btn-reward"
                    onClick={handleExperienceEvent}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    EXPERIENCE EVENT
                  </Button>
                )}

                {eventState === 'simulating' && (
                  <div className="w-full h-14 flex items-center justify-center rounded-2xl border-2 border-warning/50 bg-orange-50/50">
                    <div className="w-5 h-5 border-2 border-t-warning border-r-transparent border-b-warning border-l-transparent rounded-full animate-spin mr-3"></div>
                    <span className="text-warning font-black tracking-widest uppercase text-xs">Simulating Impact...</span>
                  </div>
                )}

                {eventState === 'completed' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-center shadow-sm">
                      <span className="text-[10px] font-black text-indigo-600 tracking-widest uppercase">Market Conditions Updated</span>
                    </div>
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-center shadow-sm">
                      <span className="text-[10px] font-black text-danger tracking-widest uppercase">Portfolio Impact Detected</span>
                    </div>
                    <Button 
                      className="w-full h-12 mt-4 tracking-widest font-black uppercase game-btn-secondary"
                      onClick={() => navigate('/investment', { state: { portfolioImpacted: true } })}
                    >
                      View Portfolio Impact
                    </Button>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
