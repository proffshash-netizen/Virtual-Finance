import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Achievement = {
  id: string;
  name: string;
  unlocked: boolean;
};

type Mission = { id: string; title: string; reward: number; completed: boolean };

export type ToastMessage = {
  id: string;
  title: string;
  message: string;
  type: 'reward' | 'info' | 'success';
};

type GameState = {
  level: number;
  xp: number;
  nextLevelXp: number;
  health: number;
  streakDays: number;
  netWorth: number;
  achievements: Achievement[];
  missions: Mission[];
  toasts: ToastMessage[];
  addXp: (amount: number) => void;
  levelUp: () => void;
  unlockAchievement: (id: string) => void;
  completeMission: (id: string) => void;
  updateHealth: (value: number) => void;
  updateNetWorth: (delta: number) => void;
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
};

const GameStateContext = createContext<GameState | undefined>(undefined);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [level, setLevel] = useState(18);
  const [xp, setXp] = useState(4820);
  const [nextLevelXp, setNextLevelXp] = useState(5500);
  const [health, setHealth] = useState(78);
  const [streakDays] = useState(12);
  const [netWorth, setNetWorth] = useState(248500);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first', name: 'First Investment', unlocked: true },
    { id: 'saver', name: 'Smart Saver', unlocked: true },
    { id: 'survivor', name: 'Market Survivor', unlocked: false },
    { id: 'risk', name: 'Risk Manager', unlocked: false },
    { id: 'diversify', name: 'Diversification Master', unlocked: false },
  ]);

  const [missions, setMissions] = useState<Mission[]>([
    { id: 'inflation', title: 'Understanding Inflation', reward: 250, completed: false },
    { id: 'diversify', title: 'Diversify Portfolio', reward: 500, completed: false },
    { id: 'weekly', title: 'Weekly Challenge', reward: 1000, completed: false },
  ]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addXp = (amount: number) => {
    setXp((currentXp) => {
      const newXp = currentXp + amount;
      if (newXp >= nextLevelXp) {
        // Handle level up in a simple way for the demo
        setLevel((l) => l + 1);
        setNextLevelXp((prev) => prev + 500);
        return newXp - nextLevelXp;
      }
      return newXp;
    });
  };

  const levelUp = () => {
    setLevel((l) => l + 1);
    setXp(0);
    setNextLevelXp((prev) => prev + 500);
  };

  const unlockAchievement = (id: string) => {
    setAchievements((prev) => {
      const ach = prev.find(a => a.id === id);
      if (ach && !ach.unlocked) {
        showToast('Achievement Unlocked', ach.name, 'success');
      }
      return prev.map((a) => (a.id === id ? { ...a, unlocked: true } : a));
    });
  };

  const completeMission = (id: string) => {
    let rewarded = 0;
    let missionTitle = '';
    setMissions((prev) => {
      const isAlreadyCompleted = prev.find(m => m.id === id)?.completed;
      if (isAlreadyCompleted) return prev;
      
      return prev.map((m) => {
        if (m.id === id) {
          rewarded = m.reward;
          missionTitle = m.title;
          return { ...m, completed: true };
        }
        return m;
      });
    });
    
    setTimeout(() => {
      if (rewarded > 0) {
        addXp(rewarded);
        showToast('Mission Completed', `+${rewarded} XP for ${missionTitle}`, 'reward');
      }
    }, 50);
  };

  const updateHealth = (value: number) => setHealth(value);
  const updateNetWorth = (delta: number) => setNetWorth((prev) => prev + delta);

  return (
    <GameStateContext.Provider
      value={{
        level,
        xp,
        nextLevelXp,
        health,
        streakDays,
        netWorth,
        achievements,
        missions,
        toasts,
        addXp,
        levelUp,
        unlockAchievement,
        completeMission,
        updateHealth,
        updateNetWorth,
        showToast,
        removeToast,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error('useGameState must be used within GameStateProvider');
  return ctx;
};
