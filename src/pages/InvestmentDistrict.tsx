import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Activity, Lock, Wallet, PieChart, 
  Coins, Pickaxe, ShieldCheck, X, CheckCircle, 
  BarChart4, ArrowUpRight, ArrowDownRight, Layers
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useGameState } from '../lib/gameState';
import { cn } from '../lib/utils';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';

type Asset = {
  id: string;
  name: string;
  icon: React.ElementType;
  value: string;
  return: string;
  isPositive: boolean;
  risk: 'Low' | 'Medium' | 'High';
  isLocked: boolean;
  color: string;
};

const assets: Asset[] = [
  { id: 'stocks', name: 'Stocks', icon: Activity, value: '₹1,04,370', return: '+8.4%', isPositive: true, risk: 'High', isLocked: false, color: 'text-primary' },
  { id: 'mf', name: 'Mutual Funds', icon: PieChart, value: '₹69,580', return: '+12.1%', isPositive: true, risk: 'Medium', isLocked: false, color: 'text-success' },
  { id: 'etf', name: 'ETFs', icon: Layers, value: '₹0', return: '0.0%', isPositive: true, risk: 'Medium', isLocked: true, color: 'text-textSecondary' },
  { id: 'gold', name: 'Gold', icon: Coins, value: '₹37,275', return: '+4.2%', isPositive: true, risk: 'Low', isLocked: false, color: 'text-reward' },
  { id: 'fd', name: 'Fixed Deposits', icon: ShieldCheck, value: '₹24,850', return: '+6.5%', isPositive: true, risk: 'Low', isLocked: false, color: 'text-secondary' },
  { id: 'rd', name: 'Recurring Deposits', icon: Wallet, value: '₹0', return: '0.0%', isPositive: true, risk: 'Low', isLocked: true, color: 'text-textSecondary' },
  { id: 'ppf', name: 'PPF', icon: ShieldCheck, value: '₹0', return: '0.0%', isPositive: true, risk: 'Low', isLocked: true, color: 'text-textSecondary' },
  { id: 'crypto', name: 'Crypto Sandbox', icon: Pickaxe, value: '₹0', return: '0.0%', isPositive: true, risk: 'High', isLocked: true, color: 'text-textSecondary' },
];

const allocation = [
  { label: 'Equity', percent: 42, color: 'bg-primary', shadow: 'shadow-[0_0_10px_rgba(124,92,255,0.8)]' },
  { label: 'Mutual Funds', percent: 28, color: 'bg-success', shadow: 'shadow-[0_0_10px_rgba(34,197,94,0.8)]' },
  { label: 'Gold', percent: 15, color: 'bg-reward', shadow: 'shadow-[0_0_10px_rgba(245,185,66,0.8)]' },
  { label: 'Fixed Deposits', percent: 10, color: 'bg-secondary', shadow: 'shadow-[0_0_10px_rgba(0,212,255,0.8)]' },
  { label: 'Cash', percent: 5, color: 'bg-white', shadow: 'shadow-[0_0_10px_rgba(255,255,255,0.8)]' },
];

export function InvestmentDistrict() {
  const navigate = useNavigate();
  const location = useLocation();
  const { netWorth, updateNetWorth, unlockAchievement, health, completeMission } = useGameState();
  
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [purchaseState, setPurchaseState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [mockChange, setMockChange] = useState(4280);

  // If arriving from Market City, simulate a temporary dip visually
  useEffect(() => {
    if (location.state?.portfolioImpacted) {
      setMockChange(1120);
    }
  }, [location.state]);

  const handleAssetClick = (asset: Asset) => {
    if (asset.isLocked) return;
    setSelectedAsset(asset);
    setPurchaseState('idle');
  };

  const closeDialog = () => {
    setSelectedAsset(null);
    setPurchaseState('idle');
  };

  const simulatePurchase = () => {
    setPurchaseState('processing');
    setTimeout(() => {
      setPurchaseState('success');
      updateNetWorth(5000); // Simulate mock bump
      setMockChange(prev => prev + 120);
      completeMission('diversify');
      unlockAchievement('diversify');
    }, 1500);
  };

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
          <div className="flex items-center space-x-4 mb-2">
            <TrendingUp className="w-8 h-8 text-success shadow-[0_0_15px_rgba(34,197,94,0.3)] rounded-full" />
            <h1 className="text-4xl font-display font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-success/80 uppercase">
              Investment District
            </h1>
          </div>
          <p className="text-textSecondary text-lg tracking-wide">Build your financial future.</p>
        </div>
      </div>

      {/* Top Financial HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass px-8 py-6 rounded-2xl border border-success/30 glow-success flex flex-col justify-center">
          <span className="text-sm text-textSecondary uppercase tracking-widest mb-1">Total Net Worth</span>
          <AnimatedNumber value={netWorth} className="text-4xl font-display font-bold text-white tracking-wider" prefix="₹" />
        </div>
        
        <div className="glass px-8 py-6 rounded-2xl border border-white/5 flex flex-col justify-center">
          <span className="text-sm text-textSecondary uppercase tracking-widest mb-1">Today's Change</span>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-mono font-bold text-success">+₹{mockChange.toLocaleString()}</span>
            <Badge variant="success" className="text-xs py-1"><ArrowUpRight className="w-3 h-3 mr-1" />+1.76%</Badge>
          </div>
        </div>

        <div className="glass px-8 py-6 rounded-2xl border border-primary/20 shadow-[0_0_15px_rgba(124,92,255,0.2)] flex flex-col justify-center relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-primary/10 to-transparent"></div>
          <span className="text-sm text-textSecondary uppercase tracking-widest mb-1">Financial Health</span>
          <div className="flex items-end space-x-2">
            <span className="text-4xl font-display font-bold text-white">{health}</span>
            <span className="text-lg text-textSecondary mb-1">/100</span>
          </div>
        </div>
      </div>

      {/* Portfolio Allocation */}
      <Card className="glass border-white/5 relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart4 className="w-5 h-5 text-textSecondary" />
            <CardTitle className="text-xl text-white tracking-wider">Portfolio Allocation</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
           {/* Visual Stacked Bar */}
           <div className="h-4 w-full bg-surface rounded-full flex overflow-hidden border border-white/10 shadow-inner">
             {allocation.map((item, idx) => (
               <motion.div 
                 key={item.label}
                 initial={{ width: 0 }}
                 animate={{ width: `${item.percent}%` }}
                 transition={{ duration: 1.5, delay: idx * 0.1, ease: "easeOut" }}
                 className={cn("h-full", item.color, item.shadow)}
                 title={`${item.label} ${item.percent}%`}
               ></motion.div>
             ))}
           </div>
           
           {/* Legend Cards */}
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
             {allocation.map((item, idx) => (
               <motion.div 
                 key={item.label}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: idx * 0.1 + 0.5 }}
                 className="flex flex-col items-center p-3 rounded-xl bg-black/40 border border-white/5"
               >
                 <div className="flex items-center space-x-2 mb-2">
                   <div className={cn("w-3 h-3 rounded-full", item.color, item.shadow)}></div>
                   <span className="text-xs text-textSecondary font-semibold uppercase">{item.label}</span>
                 </div>
                 <span className="text-lg font-mono font-bold text-white">{item.percent}%</span>
               </motion.div>
             ))}
           </div>
        </CardContent>
      </Card>

      {/* Asset Universe */}
      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center">
          <Activity className="w-5 h-5 text-success mr-3" />
          Your Asset Universe
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assets.map((asset, idx) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => handleAssetClick(asset)}
              className={cn(
                "p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-48 hover:scale-105 hover:shadow-xl",
                asset.isLocked 
                  ? "bg-surface/30 border-white/5 cursor-not-allowed opacity-60 grayscale" 
                  : "glass border-white/10 cursor-pointer hover:border-success/50 hover:bg-success/5 hover:-translate-y-1 shadow-lg"
              )}
            >
              {asset.isLocked && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 text-textSecondary" />
                </div>
              )}
              <div className="flex items-center space-x-3 mb-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  asset.isLocked ? "bg-white/5 text-textSecondary" : `bg-white/10 ${asset.color}`
                )}>
                  <asset.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white tracking-wide">{asset.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] uppercase tracking-widest text-textSecondary">Risk:</span>
                    <span className={cn(
                      "text-[10px] font-bold uppercase",
                      asset.risk === 'High' ? 'text-danger' : asset.risk === 'Medium' ? 'text-reward' : 'text-success'
                    )}>{asset.risk}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <div className="text-xs text-textSecondary mb-1">Current Value</div>
                  <div className="text-xl font-mono font-bold text-white">{asset.value}</div>
                </div>
                {!asset.isLocked && (
                  <div className={cn("flex items-center text-sm font-bold", asset.isPositive ? "text-success" : "text-danger")}>
                    {asset.isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {asset.return}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Simulated Buy Dialog (Overlay) */}
      <AnimatePresence>
        {selectedAsset && (
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
              className="w-full max-w-md glass-elevated border border-success/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.15)] relative"
            >
              {/* Close Button */}
              <button 
                onClick={closeDialog}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-textSecondary hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {purchaseState === 'idle' && (
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className={cn("p-4 rounded-2xl bg-white/5", selectedAsset.color)}>
                      <selectedAsset.icon className="w-8 h-8 drop-shadow-md" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-white">{selectedAsset.name}</h2>
                      <Badge variant="outline" className="mt-1 border-white/20">Simulated Asset</Badge>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl border border-white/5">
                      <span className="text-sm text-textSecondary uppercase tracking-widest">Expected Return</span>
                      <span className="font-mono font-bold text-success">8-12% p.a.</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl border border-white/5">
                      <span className="text-sm text-textSecondary uppercase tracking-widest">Risk Profile</span>
                      <span className={cn(
                        "font-bold uppercase tracking-wider",
                        selectedAsset.risk === 'High' ? 'text-danger' : selectedAsset.risk === 'Medium' ? 'text-reward' : 'text-success'
                      )}>{selectedAsset.risk}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl border border-white/5">
                      <span className="text-sm text-textSecondary uppercase tracking-widest">Portfolio Impact</span>
                      <span className="font-bold text-primary">Diversification ++</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-14 text-sm tracking-widest font-bold bg-success text-background hover:bg-success/90 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all"
                    onClick={simulatePurchase}
                  >
                    SIMULATE INVESTMENT
                  </Button>
                </div>
              )}

              {purchaseState === 'processing' && (
                <div className="p-16 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                     <div className="absolute inset-0 border-4 border-t-success border-r-success border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                     <TrendingUp className="w-8 h-8 text-success animate-pulse" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-success tracking-widest uppercase">Processing Order</h2>
                  <p className="text-textSecondary font-mono text-sm">Executing simulated transaction...</p>
                </div>
              )}

              {purchaseState === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 flex flex-col items-center text-center relative overflow-hidden min-h-[400px] justify-center"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-success/20 via-background to-background pointer-events-none"></div>
                  
                  <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6 glow-success border border-success/50 relative z-10">
                    <CheckCircle className="w-10 h-10 text-success" />
                  </div>
                  
                  <h2 className="text-2xl font-display font-bold text-white mb-2 relative z-10">Investment Successful</h2>
                  <p className="text-textSecondary mb-8 text-sm relative z-10">
                    Your simulated portfolio has been updated.
                  </p>
                  
                  <div className="px-6 py-3 rounded-xl bg-black/50 border border-success/30 flex items-center space-x-3 shadow-[0_0_15px_rgba(34,197,94,0.2)] mb-8 relative z-10">
                    <span className="text-xs text-textSecondary uppercase tracking-widest">Reward</span>
                    <span className="text-xl font-mono font-bold text-success">+500 XP</span>
                  </div>
                  
                  <div className="px-6 py-3 rounded-xl bg-black/50 border border-primary/30 flex flex-col items-center shadow-[0_0_15px_rgba(124,92,255,0.3)] mb-8 relative z-10 w-full">
                    <span className="text-xs text-textSecondary uppercase tracking-widest mb-1">Unlocked</span>
                    <span className="text-lg font-bold text-primary">Diversification Master</span>
                  </div>

                  <Button 
                    className="w-full h-12 tracking-widest font-bold relative z-10"
                    variant="default"
                    onClick={() => {
                      closeDialog();
                      navigate('/life');
                    }}
                  >
                    Return to Life Hub
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
