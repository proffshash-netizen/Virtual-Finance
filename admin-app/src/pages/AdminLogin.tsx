import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../lib/auth';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminLogin() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAdminAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const trimmedUserId = userId.trim();
      const trimmedPassword = password.trim();
      
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: trimmedUserId, password: trimmedPassword }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUser({ id: data.user.id, displayName: data.user.displayName, role: data.user.role });
        navigate('/');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch {
      setError('Connection to secure server failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 bg-grid-pattern relative overflow-hidden">
      {/* Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10 font-sans"
      >
        <div className="text-center mb-10">
          <Shield className="w-20 h-20 text-text-main mx-auto mb-6" />
          <h1 className="text-5xl font-black text-text-main tracking-[0.2em] mb-4 font-mono">FINLIT<span className="text-text-muted">CORE</span></h1>
          <div className="flex items-center justify-center text-base text-text-muted tracking-widest font-bold">
            <span className="w-3 h-3 rounded-full border-2 border-text-muted mr-3"></span>
            ENCRYPTED CONNECTION
          </div>
        </div>

        <form onSubmit={handleLogin} className="admin-panel p-10 space-y-8">
          <div className="border-b border-border pb-6 mb-8">
            <h2 className="text-2xl font-bold text-text-main tracking-widest flex items-center">
              <Lock className="w-7 h-7 mr-3 text-text-main" />
              AUTHENTICATION REQUIRED
            </h2>
          </div>

          <div>
            <label className="block text-base font-bold text-text-muted tracking-widest mb-3">ADMIN ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="admin-input text-lg py-4 font-mono"
              placeholder="e.g. admin"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label className="block text-base font-bold text-text-muted tracking-widest mb-3">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input text-lg py-4 font-mono"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-surface border border-border p-4 flex items-start text-text-main text-lg rounded font-bold">
              <AlertTriangle className="w-7 h-7 mr-3 shrink-0 text-text-muted" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full admin-btn-primary h-16 text-xl mt-6 tracking-widest font-bold"
          >
            {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-text-muted opacity-50 tracking-widest font-bold">
          UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
        </div>
      </motion.div>
    </div>
  );
}
