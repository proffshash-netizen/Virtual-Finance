import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Users, Swords } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BadgeCase } from '../components/social/BadgeCase';
import { Leaderboard } from '../components/social/Leaderboard';
import { AppLaunchTransition } from '../components/ui/AppLaunchTransition';

type Tab = 'badges' | 'leaderboard' | 'pvp';

export function SocialHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('leaderboard');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate launch loading
  setTimeout(() => setIsLoading(false), 800);

  return (
    <AppLaunchTransition isLoading={isLoading}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-4xl mx-auto pb-32 pt-8 px-4"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/world')}
              className="w-12 h-12 bg-surface rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="medieval-wood-plaque px-6 py-2 rounded-xl text-3xl md:text-4xl font-display font-black tracking-widest uppercase shadow-lg inline-block">Social Hub</h1>
              <p className="text-[#E8DFCD] font-medium mt-2 drop-shadow-md">Connect, compete, and show off your progress.</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 md:space-x-4 mb-8 bg-[#E8DFCD] border-2 border-[#8D6E63]/50 p-2 rounded-2xl shadow-inner overflow-x-auto">
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 ${activeTab === 'leaderboard' ? 'medieval-wood-plaque shadow-md scale-[1.02] border-[#271510]' : 'text-[#5D4037] bg-[#F4E4BC]/50 hover:bg-[#F4E4BC] border-2 border-[#8D6E63]/30 shadow-sm'}`}
          >
            <Trophy className="w-5 h-5" />
            <span>Rankings</span>
          </button>
          <button 
            onClick={() => setActiveTab('badges')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 ${activeTab === 'badges' ? 'medieval-wood-plaque shadow-md scale-[1.02] border-[#271510]' : 'text-[#5D4037] bg-[#F4E4BC]/50 hover:bg-[#F4E4BC] border-2 border-[#8D6E63]/30 shadow-sm'}`}
          >
            <Medal className="w-5 h-5" />
            <span>Badges</span>
          </button>
          <button 
            onClick={() => setActiveTab('pvp')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 ${activeTab === 'pvp' ? 'medieval-wood-plaque shadow-md scale-[1.02] border-[#271510]' : 'text-[#5D4037] bg-[#F4E4BC]/50 hover:bg-[#F4E4BC] border-2 border-[#8D6E63]/30 shadow-sm'}`}
          >
            <Swords className="w-5 h-5" />
            <span>Challenges</span>
          </button>
        </div>

        {/* Content */}
        <div className="medieval-parchment rounded-[2rem] p-6 shadow-2xl">
          <AnimatePresence mode="wait">
            {activeTab === 'leaderboard' && (
              <motion.div key="leaderboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-2xl font-black mb-6 flex items-center text-[#3E2723] uppercase tracking-wide"><Users className="w-6 h-6 mr-2 text-primary" /> Top Net Worth</h2>
                <Leaderboard />
              </motion.div>
            )}
            
            {activeTab === 'badges' && (
              <motion.div key="badges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-2xl font-black mb-6 flex items-center text-[#3E2723] uppercase tracking-wide"><Medal className="w-6 h-6 mr-2 text-indigo-600" /> Your Badge Case</h2>
                <BadgeCase />
              </motion.div>
            )}
            
            {activeTab === 'pvp' && (
              <motion.div key="pvp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center py-16">
                <div className="w-24 h-24 bg-[#FFFAEE] border-2 border-danger/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Swords className="w-12 h-12 text-danger" />
                </div>
                <h2 className="text-3xl font-black mb-4 text-[#3E2723] uppercase tracking-widest">PvP Challenges</h2>
                <p className="text-[#5D4037] font-bold mb-8 max-w-md mx-auto leading-relaxed">
                  Challenge your friends to stock market simulation battles and quiz duels to win their XP!
                </p>
                <div className="bg-[#E8DFCD] rounded-2xl p-6 border-2 border-dashed border-[#8D6E63] max-w-sm mx-auto shadow-inner">
                  <span className="font-black text-[#8D6E63] uppercase tracking-widest text-sm">Coming in V2</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AppLaunchTransition>
  );
}
