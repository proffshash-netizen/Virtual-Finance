import { useState, useEffect } from 'react';
import { useGameState } from '../../lib/gameState';
import { mockLeaderboardApi } from '../../lib/mockLeaderboardApi';
import type { LeaderboardPlayer } from '../../lib/mockLeaderboardApi';
import { Trophy, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export function Leaderboard() {
  const { user, netWorth } = useGameState();
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user?.userId || 'mock_user_1';
    const displayName = user?.displayName || 'You';
    
    mockLeaderboardApi.getLeaderboard(userId, netWorth, displayName).then(data => {
      // Sort by rank
      const sorted = [...data].sort((a, b) => a.rank - b.rank);
      setPlayers(sorted);
      setLoading(false);
    });
  }, [user, netWorth]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {players.map((player, i) => {
        const isCurrentUser = player.isCurrentUser;
        
        return (
          <motion.div 
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-2xl border-2 ${
              isCurrentUser 
                ? 'bg-primary/10 border-primary shadow-sm' 
                : 'bg-surface border-border/50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                player.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                player.rank === 2 ? 'bg-slate-200 text-slate-500' :
                player.rank === 3 ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-400'
              }`}>
                {player.rank === 1 ? <Trophy className="w-5 h-5" /> :
                 player.rank === 2 ? <Medal className="w-5 h-5" /> :
                 player.rank === 3 ? <Award className="w-5 h-5" /> :
                 `#${player.rank}`}
              </div>
              
              <div>
                <div className="font-bold text-text-primary flex items-center space-x-2">
                  <span>{player.displayName}</span>
                  {isCurrentUser && (
                    <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wider">You</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-black text-success">
                ₹{player.netWorth.toLocaleString()}
              </div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                Net Worth
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
