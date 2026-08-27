import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../lib/auth';
import { Terminal, Users, LogOut, ShieldAlert, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AdminLayout() {
  const { user, setUser } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setUser(null);
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { name: 'DASHBOARD', icon: Activity, path: '/' },
    { name: 'PLAYERS', icon: Users, path: '/players' },
    { name: 'AUDIT LOGS', icon: Terminal, path: '/audit' },
  ];

  return (
    <div className="flex h-screen bg-background text-text-main font-sans overflow-hidden selection:bg-primary/30">
      {/* SIDEBAR */}
      <div className="w-80 bg-surface border-r border-border flex flex-col relative z-10">
        <div className="p-8 border-b border-border">
          <h1 className="text-3xl font-black text-text-main tracking-widest flex items-center">
            <ShieldAlert className="w-8 h-8 mr-3 text-primary" />
            FINLIT<span className="text-text-muted">CORE</span>
          </h1>
          <div className="mt-3 text-sm text-secondary flex items-center font-bold">
            <span className="w-3 h-3 rounded-full border-2 border-secondary mr-2"></span>
            SYSTEM SECURE
          </div>
        </div>

        <nav className="flex-1 py-8 px-6 space-y-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-6 py-4 rounded text-lg tracking-widest transition-colors font-bold ${
                  isActive || (item.path !== '/' && location.pathname.startsWith(item.path))
                    ? 'bg-border text-text-main border-l-4 border-text-main'
                    : 'text-text-muted hover:text-text-main hover:bg-white/5 border-l-4 border-transparent'
                }`
              }
            >
              <item.icon className="w-7 h-7 mr-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-border">
          <div className="text-sm text-text-muted mb-4 px-2 tracking-widest">
            ADMIN: <span className="text-text-main font-mono">{user?.id}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-3 text-base text-text-muted hover:text-danger hover:bg-danger/10 rounded transition-colors tracking-widest font-bold"
          >
            <LogOut className="w-6 h-6 mr-4" />
            DISCONNECT
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-grid-pattern">
        {/* Subtle scanline effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20"></div>

        {/* TOP BAR */}
        <header className="h-24 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-between px-10 relative z-20">
          <div className="text-lg tracking-widest text-text-muted flex items-center font-bold">
            PATH: <span className="text-text-main ml-4 font-mono">{location.pathname.toUpperCase()}</span>
          </div>
          <div className="text-lg tracking-widest text-text-main font-mono font-bold">
            {time.toISOString().replace('T', ' ').slice(0, 19)} UTC
          </div>
        </header>

        {/* SCROLLABLE OUTLET */}
        <main className="flex-1 overflow-auto p-12 relative z-20">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
