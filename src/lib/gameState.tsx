/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';

export type Player = {
  userId: string;
  displayName: string;
  email: string;
  avatarId: string;
};

// Backend acts as the single source of truth now. DEMO_USERS are migrated to SQLite.

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

export type District = {
  id: string;
  name: string;
  description: string;
  progress: string;
  reward: string;
  path: string;
  locked: boolean;
  marketValue: string; // New field for district economic value
};

type GameState = {
  user: Player | null;
  money: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  health: number;
  streakDays: number;
  netWorth: number;
  achievements: Achievement[];
  missions: Mission[];
  toasts: ToastMessage[];
  districts: District[];
  login: (userId: string, password?: string) => Promise<boolean>;
  register: (displayName: string, email: string, password?: string, ageConfirm?: boolean) => Promise<boolean>;
  logout: () => void;
  updateMoney: (delta: number) => void;
  addXp: (amount: number) => void;
  levelUp: () => void;
  unlockAchievement: (id: string) => void;
  completeMission: (id: string) => void;
  updateHealth: (value: number) => void;
  updateNetWorth: (delta: number) => void;
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  isLoadingAuth: boolean;
};

const GameStateContext = createContext<GameState | undefined>(undefined);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Player | null>(null);
  const [money, setMoney] = useState(245000);
  const [level, setLevel] = useState(18);
  const [xp, setXp] = useState(4820);
  const [nextLevelXp, setNextLevelXp] = useState(5500);
  const [health, setHealth] = useState(78);
  const [streakDays, setStreakDays] = useState(12);
  const [netWorth, setNetWorth] = useState(248500);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Sync from backend
  const syncState = async () => {
    try {
      const res = await fetch('/api/player/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.player);
        setLevel(data.state.level);
        setXp(data.state.xp);
        setMoney(data.state.money);
        setNetWorth(data.state.netWorth);
        setHealth(data.state.health);
        setStreakDays(data.state.streakDays);
        // Note: achievements and unlockedDistricts can also be updated here
      } else {
        // If unauthorized, clear user
        if (res.status === 401) {
          setUser(null);
        }
      }
    } catch (e) {
      console.error("Failed to sync state from backend", e);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Initial sync
  useEffect(() => {
    syncState(); // Check if already logged in via cookie on mount
  }, []);

  const login = async (userId: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/player/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password })
      });
      if (res.ok) {
        await syncState();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const register = async (displayName: string, email: string, password?: string, ageConfirm?: boolean): Promise<boolean> => {
    if (!ageConfirm) return false;
    try {
      const res = await fetch('/api/player/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password })
      });
      if (res.ok) {
        await syncState();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const logout = async () => {
    try {
      await fetch('/api/player/logout', { method: 'POST' });
    } catch {}
    setUser(null);
  };

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
    { id: 'study_stocks', title: 'Stock Explorer', reward: 150, completed: false },
    { id: 'study_bonds', title: 'Bond Builder', reward: 150, completed: false },
  ]);

  const districts = useMemo<District[]>(() => [
    { id: 'study', name: 'Study 🎓', description: 'Understand money. Make smarter decisions. Build your world.', progress: '0%', reward: '+XP', path: '/study', locked: false, marketValue: '₹0' },
    { id: 'academy', name: 'Fin Academy', description: 'Learn how money works.', progress: '80%', reward: '+250 XP', path: '/academy', locked: false, marketValue: '₹4.2M' },
    { id: 'investment', name: 'Investment District', description: 'Grow your wealth through smart decisions.', progress: level >= 20 ? '20%' : 'Locked', reward: level >= 20 ? '+500 XP' : 'Level 20 Req', path: '/investment', locked: level < 20, marketValue: '₹12.5M' },
    { id: 'market', name: 'Market City', description: 'Experience supply, demand, and economics.', progress: level >= 20 ? 'Active' : 'Locked', reward: 'Level 20 Req', path: '/market', locked: level < 20, marketValue: '₹8.9M' },
    { id: 'life', name: 'Life Hub', description: 'Build your life, set goals, and thrive.', progress: '50%', reward: '+100 XP', path: '/life', locked: false, marketValue: '₹1.1M' },
    { id: 'security', name: 'Security Center', description: 'Spot frauds, earn badges, stay safe.', progress: '0%', reward: 'Fraud Spotter Badge', path: '/security', locked: false, marketValue: '₹500K' },
    { id: 'social', name: 'Social Hub', description: 'Connect, compete, and show off your progress.', progress: 'Active', reward: 'Rank #24', path: '/social', locked: false, marketValue: '₹0' },
  ], [level]);

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
  const updateMoney = (delta: number) => setMoney((prev) => prev + delta);

  // Sync local changes to backend
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (user) {
      fetch('/api/player/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, xp, money, netWorth, health, streakDays, achievements })
      }).catch(console.error);
    }
  }, [level, xp, money, netWorth, health, streakDays, achievements, user]);

  return (
    <GameStateContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        money,
        level,
        xp,
        nextLevelXp,
        health,
        streakDays,
        netWorth,
        achievements,
        missions,
        toasts,
        districts,
        addXp,
        levelUp,
        unlockAchievement,
        completeMission,
        updateHealth,
        updateNetWorth,
        updateMoney,
        showToast,
        removeToast,
        isLoadingAuth,
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
