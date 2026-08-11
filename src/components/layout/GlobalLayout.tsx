import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Zap, Shield, TrendingUp, ChevronLeft, Info, CheckCircle, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useGameState } from '../../lib/gameState';
import { AnimatedNumber } from '../ui/AnimatedNumber';

export function GlobalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isWorldMap = location.pathname === '/world';
  const { level, xp, nextLevelXp, health, netWorth, streakDays, toasts, removeToast } = useGameState();

  const xpProgress = (xp / nextLevelXp) * 100;

  return (
    <div className="h-screen bg-background flex flex-col text-textPrimary overflow-hidden">
      {/* Global Toast Notifications */}
      <div className="fixed top-24 right-6 z-[200] flex flex-col space-y-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`pointer-events-auto p-4 rounded-xl border glass-elevated min-w-[300px] flex items-start space-x-3 shadow-2xl ${
                toast.type === 'reward' ? 'border-primary/50 bg-primary/10 glow-primary' :
                toast.type === 'success' ? 'border-success/50 bg-success/10 glow-success' :
                'border-white/20'
              }`}
            >
              <div className="mt-0.5">
                {toast.type === 'reward' && <Zap className="w-5 h-5 text-primary" />}
                {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-success" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-secondary" />}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-sm ${
                  toast.type === 'reward' ? 'text-primary' :
                  toast.type === 'success' ? 'text-success' : 'text-white'
                }`}>{toast.title}</h4>
                <p className="text-textSecondary text-xs mt-1">{toast.message}</p>
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-textSecondary hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] animate-float"></div>
      </div>

      {/* Top HUD */}
      <header className="h-16 glass-elevated border-b border-white/10 flex items-center justify-between px-6 z-50 relative backdrop-blur-xl bg-surface/60">
        
        {/* Left: Logo & Navigation */}
        <div className="flex items-center space-x-6 w-1/3">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/world')}>
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center glow-primary group-hover:bg-primary/40 transition-colors">
              <span className="font-display font-bold text-primary group-hover:text-white transition-colors">F</span>
            </div>
            <span className="font-display text-xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary hidden sm:block">
              FINLIT
            </span>
          </div>

          <AnimatePresence>
            {!isWorldMap && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/world')}
                  className="text-textSecondary hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  City Map
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Player Progression */}
        <div className="flex-1 flex justify-center items-center">
          <div className="flex items-center space-x-4 bg-black/40 px-6 py-1.5 rounded-full border border-white/5">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-reward/20 flex items-center justify-center text-reward shadow-[0_0_10px_rgba(245,185,66,0.3)]">
                <span className="text-[10px] font-bold">{level}</span>
              </div>
              <span className="text-xs font-semibold tracking-wider text-textSecondary uppercase hidden md:inline-block">Level</span>
            </div>
            
            <div className="w-32 h-1.5 bg-surface rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-reward to-primary shadow-[0_0_10px_rgba(124,92,255,0.5)]" 
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <AnimatedNumber value={xp} className="text-xs font-mono text-textSecondary" />
          </div>
        </div>

        {/* Right: Core Stats & Actions */}
        <div className="flex items-center justify-end space-x-4 w-1/3">
          {/* Wealth */}
          <div className="hidden lg:flex items-center space-x-4 px-4 py-1.5 bg-black/40 rounded-full border border-white/5">
            <div className="flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              <span className="text-xs text-textSecondary">Net Worth</span>
              <span className="text-sm font-mono font-bold text-success">
                ₹<AnimatedNumber value={netWorth} />
              </span>
            </div>
          </div>

          {/* Health & Streak */}
          <div className="hidden xl:flex items-center space-x-3">
             <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20 text-primary">
               <Shield className="w-3.5 h-3.5" />
               <span className="text-xs font-bold">{health}</span>
             </div>
             <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-reward/10 rounded-full border border-reward/20 text-reward">
               <Zap className="w-3.5 h-3.5" />
               <span className="text-xs font-bold">{streakDays}</span>
             </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 border-l border-white/10 pl-4">
            <button className="p-2 rounded-full hover:bg-surface/80 transition-colors text-textSecondary hover:text-white relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              <User className="w-4 h-4 text-textSecondary" />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* If we are NOT on the world map, we might want to add ambient backgrounds inside the domains */}
        {!isWorldMap && (
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[140px]"></div>
          </div>
        )}
        
        {/* Dynamic Content */}
        <div className={`flex-1 relative ${!isWorldMap ? 'overflow-y-auto p-8' : ''}`}>
           <Outlet />
        </div>
      </main>
    </div>
  );
}
