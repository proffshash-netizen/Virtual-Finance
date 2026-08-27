import { motion } from 'framer-motion';
import { Target, CheckCircle2, Lock, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from './badge';

interface QuestCardProps {
  title: string;
  objective: string;
  rewardXP: number;
  progress: number; // 0 to 100
  status: 'active' | 'completed' | 'locked';
  onClick?: () => void;
  className?: string;
}

export function QuestCard({ title, objective, rewardXP, progress, status, onClick, className }: QuestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={status === 'active' ? { y: -4, scale: 1.02 } : {}}
      onClick={status === 'active' ? onClick : undefined}
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 transition-all duration-300",
        status === 'active' 
          ? "bg-white border-primary/30 shadow-md cursor-pointer hover:border-primary hover:shadow-[0_10px_30px_rgba(109,93,245,0.15)]"
          : status === 'completed'
          ? "bg-slate-50 border-success/30 opacity-80"
          : "bg-slate-100/50 border-slate-200 opacity-60 grayscale",
        className
      )}
    >
      {/* Background Glow for Active */}
      {status === 'active' && (
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>
      )}

      <div className="p-6 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              status === 'active' ? "bg-indigo-50 text-primary" : 
              status === 'completed' ? "bg-success/10 text-success" : "bg-slate-200 text-slate-400"
            )}>
              {status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : 
               status === 'locked' ? <Lock className="w-4 h-4" /> : <Target className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-sm tracking-wide uppercase">{title}</h4>
              <Badge 
                variant={status === 'active' ? 'default' : status === 'completed' ? 'success' : 'outline'}
                className="text-[8px] px-1.5 py-0 uppercase tracking-widest font-black mt-0.5"
              >
                {status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            <Zap className={cn("w-3 h-3", status === 'completed' ? 'text-success' : 'text-reward')} />
            <span className={cn("text-xs font-mono font-black", status === 'completed' ? 'text-success' : 'text-reward')}>+{rewardXP} XP</span>
          </div>
        </div>

        {/* Objective */}
        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-5 line-clamp-2">
          {objective}
        </p>

        {/* Progress Bar */}
        <div className="space-y-2 mt-auto">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                status === 'completed' ? "bg-success" : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
