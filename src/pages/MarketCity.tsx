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
      <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Globe className="w-8 h-8 text-secondary shadow-[0_0_15px_rgba(0,212,255,0.3)] rounded-full" />
            <h1 className="text-4xl font-display font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary/80 uppercase">
              Market City
            </h1>
          </div>
          <div className="flex items-center space-x-3 mt-3">
            <div className="w-2 h-2 rounded-full bg-success animate-ping"></div>
            <p className="text-textSecondary text-sm tracking-[0.2em] uppercase font-semibold">Live Economic Environment</p>
          </div>
        </div>

        {/* Market Mood */}
        <div className="glass px-8 py-5 rounded-2xl border border-warning/30 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-warning/5 group-hover:bg-warning/10 transition-colors"></div>
          <span className="text-xs text-textSecondary uppercase tracking-widest mb-2 relative z-10">Market Mood</span>
          <div className="flex items-center space-x-2 relative z-10">
            <AlertCircle className="w-5 h-5 text-warning" />
            <span className="text-2xl font-display font-bold text-warning tracking-widest uppercase">
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
                  className="glass p-5 rounded-xl border border-white/5 flex flex-col relative overflow-hidden"
                >
                  {isPostEvent && <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 2 }} className="absolute inset-0 bg-secondary/20 z-0"></motion.div>}
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <ind.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="text-xs text-textSecondary uppercase tracking-widest relative z-10">{ind.label}</span>
                  <span className={cn(
                    "text-2xl font-mono font-bold mt-1 relative z-10 transition-colors duration-500",
                    isPostEvent ? "text-white" : "text-textPrimary"
                  )}>{ind.value}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sector Performance */}
          <Card className="glass border-secondary/20 glow-none">
            <CardHeader>
              <CardTitle className="text-xl flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-secondary" />
                <span>Sector Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {sectors.map((sector, i) => {
                const isPositive = sector.value >= 0;
                // Calculate an arbitrary width for visualization based on the max value
                const width = Math.min(Math.abs(sector.value) * 15 + 10, 100);

                return (
                  <div key={sector.name} className="flex items-center justify-between group">
                    <div className="w-1/4 flex items-center space-x-3">
                      <sector.icon className="w-4 h-4 text-textSecondary group-hover:text-white transition-colors" />
                      <span className="text-sm font-medium text-textSecondary group-hover:text-white transition-colors">{sector.name}</span>
                    </div>
                    
                    {/* Animated Bar Graph */}
                    <div className="w-2/4 h-2 bg-surface rounded-full overflow-hidden relative">
                       {/* Center line for positive/negative */}
                       <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 z-10"></div>
                       
                       <AnimatePresence>
                         {isPositive ? (
                           <motion.div 
                             key={`pos-${sector.name}-${isPostEvent}`}
                             initial={{ width: 0 }}
                             animate={{ width: `${width}%` }}
                             transition={{ duration: 1.5, delay: i * 0.1, type: "spring", bounce: 0.4 }}
                             className="absolute left-1/2 h-full bg-success rounded-r-full shadow-[0_0_15px_rgba(34,197,94,0.5)] origin-left"
                           ></motion.div>
                         ) : (
                           <motion.div 
                             key={`neg-${sector.name}-${isPostEvent}`}
                             initial={{ width: 0 }}
                             animate={{ width: `${width}%`, x: '-100%' }}
                             transition={{ duration: 1.5, delay: i * 0.1, type: "spring", bounce: 0.4 }}
                             className="absolute left-1/2 h-full bg-danger rounded-l-full shadow-[0_0_15px_rgba(239,68,68,0.5)] origin-right"
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
                          "flex items-center space-x-1 font-mono font-bold text-sm",
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
          <Card className="glass border-warning/30 relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-warning">
              <AlertCircle className="w-32 h-32" />
            </div>
            
            <CardHeader className="relative z-10 border-b border-white/5 pb-6">
              <Badge variant="outline" className="w-fit mb-4 border-warning text-warning uppercase tracking-widest text-[10px]">Active Economic Event</Badge>
              <CardTitle className="text-3xl text-white">Interest Rate Increase</CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 flex-1 flex flex-col pt-6">
              <p className="text-textSecondary mb-8 text-lg">
                "The Central Bank has announced a 50 basis point increase in benchmark interest rates to combat inflation."
              </p>

              <div className="space-y-4 mb-8">
                <h4 className="text-xs uppercase tracking-widest text-textSecondary font-semibold">Simulated Effects</h4>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-sm font-medium">Borrowing Costs</span>
                  <div className="flex items-center text-danger font-bold">
                    <ArrowUpRight className="w-4 h-4 mr-1" /> High
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-sm font-medium">Savings Returns</span>
                  <div className="flex items-center text-success font-bold">
                    <ArrowUpRight className="w-4 h-4 mr-1" /> Rising
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-sm font-medium">Equity Pressure</span>
                  <div className="flex items-center text-danger font-bold">
                    <ArrowDownRight className="w-4 h-4 mr-1" /> Falling
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                {eventState === 'idle' && (
                  <Button 
                    className="w-full h-14 tracking-widest font-bold bg-warning text-background hover:bg-warning/90 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                    onClick={handleExperienceEvent}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    EXPERIENCE EVENT
                  </Button>
                )}

                {eventState === 'simulating' && (
                  <div className="w-full h-14 flex items-center justify-center rounded border border-warning/50 bg-warning/10">
                    <div className="w-5 h-5 border-2 border-t-warning border-r-transparent border-b-warning border-l-transparent rounded-full animate-spin mr-3"></div>
                    <span className="text-warning font-bold tracking-widest uppercase text-sm">Simulating Impact...</span>
                  </div>
                )}

                {eventState === 'completed' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="p-3 bg-secondary/10 border border-secondary/30 rounded text-center shadow-[0_0_15px_rgba(0,212,255,0.2)]">
                      <span className="text-xs font-bold text-secondary tracking-widest uppercase">Market Conditions Updated</span>
                    </div>
                    <div className="p-3 bg-danger/10 border border-danger/30 rounded text-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                      <span className="text-xs font-bold text-danger tracking-widest uppercase">Portfolio Impact Detected</span>
                    </div>
                    <Button 
                      className="w-full h-12 mt-4 tracking-widest font-bold bg-secondary text-background hover:bg-secondary/90 shadow-[0_0_20px_rgba(0,212,255,0.4)]"
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
