import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, LogOut, Star } from 'lucide-react';
import { useGameState } from '../../lib/gameState';
import { FinlitIcon } from '../ui/FinlitIcon';
import { WorldInteractionRipple } from '../ui/WorldInteractionRipple';
import { MoneyBirdLayer } from './MoneyBirdLayer';
import { PageTransitionCover } from '../ui/PageTransitionCover';
import { AIAssistant } from '../ui/AIAssistant';

export function GlobalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isWorldMap = location.pathname === '/world' || location.pathname === '/world-3d';
  const { user, logout, toasts, removeToast, showToast } = useGameState();
  const outlet = useOutlet();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleTransition = (e: Event) => {
      const customEvent = e as CustomEvent<{ path: string }>;
      setIsTransitioning(true);
      
      // Wait for banner to unfurl, then navigate
      setTimeout(() => {
        navigate(customEvent.detail.path);
        
        // Wait a tiny bit for the new route to render, then retract the banner
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 600);
    };

    window.addEventListener('trigger-transition', handleTransition);
    return () => window.removeEventListener('trigger-transition', handleTransition);
  }, [navigate]);


  return (
    <div className="h-[100dvh] w-full bg-gradient-to-b from-[#1C2C16] via-[#2F4827] to-[#4A6741] flex flex-col text-text-primary overflow-hidden relative">
      <PageTransitionCover isVisible={isTransitioning} />
      
      {/* Toast Notifications */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center space-y-2 pointer-events-none w-full max-w-md">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, filter: 'blur(4px)' }}
              className={`pointer-events-auto p-4 rounded-[24px] border-4 border-b-[6px] shadow-xl min-w-[300px] flex items-start space-x-3 bg-surface ${
                toast.type === 'success' ? 'border-[#35C759]' : 
                toast.type === 'reward' ? 'border-[#FFD13B]' : 'border-secondary'
              }`}
            >
              <div className="flex-1">
                <h4 className="font-bold text-sm uppercase tracking-wider">{toast.title}</h4>
                <p className="text-text-secondary font-medium text-xs mt-1">{toast.message}</p>
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-text-secondary hover:text-text-primary transition-colors bg-surface-alt p-1 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Background Decorative Elements removed to fix ghost blob issue */}

      {/* Top HUD (Floating Game UI) */}
      <header className="absolute top-0 left-0 w-full pt-6 px-6 md:px-8 flex flex-wrap items-center gap-4 md:gap-6 z-[150] pointer-events-none max-w-[1920px] mx-auto right-0">
        {/* Sibling 1: Brand Pill */}
        <div className="flex items-center space-x-3 cursor-pointer group medieval-wood-plaque px-6 md:px-8 py-2 md:py-3 rounded-full shrink-0" onClick={() => navigate('/world')}>
          <FinlitIcon className="w-8 h-8 drop-shadow-md group-hover:scale-110 active:scale-95 transition-all" />
          <span className="font-display text-xl font-black tracking-[0.2em] hidden sm:block">
            FINLIT
          </span>
        </div>
 
        {/* Central space filler to keep left/right aligned */}
        <div className="hidden lg:block flex-1 min-w-[20px]"></div>

        {/* Actions Sibling */}
        <div className="flex items-center gap-3 pointer-events-auto shrink-0">
          <button 
            className="w-10 md:w-12 h-10 md:h-12 rounded-full medieval-wood-plaque flex items-center justify-center hover:brightness-110 hover:scale-105 active:scale-95 transition-all relative group shrink-0"
            onClick={() => showToast('New Market Event', 'Inflation data has been released', 'info')}
          >
              <Bell className="w-5 md:w-6 h-5 md:h-6 group-hover:animate-shake" />
              <span className="absolute top-0 right-0 w-2.5 md:w-3 h-2.5 md:h-3 bg-danger rounded-full shadow-sm border-2 border-white"></span>
            </button>
            {/* Rank / Star Badge */}
            <div className="flex items-center space-x-2 medieval-wood-plaque px-3 md:px-4 py-1.5 md:py-2 rounded-full shrink-0" title="Rank 24">
              <Star className="w-4 md:w-5 h-4 md:h-5 text-blue-400 fill-blue-400 drop-shadow-sm" />
              <span className="text-sm md:text-base font-black whitespace-nowrap drop-shadow-sm">24</span>
            </div>

            {/* Profile / Hub Access */}
            <button 
              onClick={() => navigate('/life')}
              className="group relative shrink-0 medieval-wood-plaque rounded-full w-10 md:w-12 h-10 md:h-12 overflow-hidden hover:scale-105 active:scale-95 transition-all p-1"
              title="View Profile"
            >
              <div className="w-full h-full rounded-full overflow-hidden border border-[#271510]">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatarId === 'avatar_01' ? 'Felix' : 'Aneka'}&backgroundColor=E6F0F9`} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </button>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-10 md:w-12 h-10 md:h-12 rounded-full medieval-wood-plaque flex items-center justify-center text-danger hover:bg-danger/20 hover:text-white hover:scale-105 active:scale-95 transition-all shrink-0"
            title="Logout"
          >
            <LogOut className="w-5 md:w-6 h-5 md:h-6 drop-shadow-sm" />
          </button>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 w-full h-full relative overflow-hidden flex flex-col pointer-events-none">
        {/* If we are NOT on the world map, we might want to add ambient backgrounds inside the domains */}
        {!isWorldMap && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-transparent">
            {/* Soft sunny glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[100px]"></div>
          </div>
        )}
        
        {/* Dynamic Content */}
        <div className={`flex-1 w-full h-full relative pointer-events-auto ${!isWorldMap ? 'overflow-y-auto pt-32 px-8 pb-8' : ''}`}>
           {isWorldMap && <MoneyBirdLayer />}
           <AnimatePresence mode="wait">
             <motion.div key={location.pathname} className="w-full h-full min-h-full flex flex-col">
               <WorldInteractionRipple>
                 {outlet}
               </WorldInteractionRipple>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Docked Stats Bar removed by user request */}
      </main>

      <AIAssistant />
    </div>
  );
}
