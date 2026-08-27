import { useState, useEffect } from 'react';
import { useGameState } from '../../lib/gameState';
import { mockBadgesApi } from '../../lib/mockBadgesApi';
import type { Badge } from '../../lib/mockBadgesApi';
import { Star, Shield, AlertTriangle, TrendingUp, Diamond, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ElementType> = {
  star: Star,
  shield: Shield,
  alert: AlertTriangle,
  'trending-up': TrendingUp,
  diamond: Diamond
};

const rarityColors = {
  common: 'bg-slate-100 text-slate-500 border-slate-200',
  rare: 'bg-blue-100 text-blue-600 border-blue-200',
  epic: 'bg-purple-100 text-purple-600 border-purple-200',
  legendary: 'bg-amber-100 text-amber-600 border-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
};

export function BadgeCase() {
  const { user } = useGameState();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user?.userId || 'mock_user_1';
    mockBadgesApi.getBadges(userId).then(data => {
      setBadges(data);
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {badges.map((badge, i) => {
        const Icon = iconMap[badge.iconType] || Star;
        const isEarned = !!badge.earnedAt;
        const colorClass = isEarned ? rarityColors[badge.rarity] : 'bg-slate-50 text-slate-300 border-slate-200 opacity-60 grayscale';

        return (
          <motion.div 
            key={badge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`border-2 rounded-2xl p-4 flex flex-col items-center text-center relative ${colorClass}`}
          >
            {!isEarned && (
              <div className="absolute top-2 right-2">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
            )}
            
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isEarned ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
              {/* @ts-ignore */}
              <Icon className="w-6 h-6" />
            </div>
            
            <h4 className={`font-bold text-sm mb-1 ${isEarned ? 'text-slate-800' : 'text-slate-500'}`}>
              {badge.name}
            </h4>
            
            <p className={`text-[10px] font-medium leading-tight ${isEarned ? 'text-slate-600' : 'text-slate-400'}`}>
              {badge.description}
            </p>

            {isEarned && (
              <div className="mt-2 text-[9px] font-bold uppercase tracking-widest opacity-60">
                {badge.rarity}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
