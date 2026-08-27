import { Activity, Users, ShieldAlert, Database } from 'lucide-react';
import { useAdminAuth } from '../lib/auth';

export function Dashboard() {
  const { user } = useAdminAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h2 className="text-4xl font-black tracking-widest text-text-main mb-2">SYSTEM DASHBOARD</h2>
          <p className="text-lg text-text-muted tracking-wider">Welcome back, Administrator <span className="font-mono text-text-main">{user?.id}</span>.</p>
        </div>
        <div className="flex items-center text-secondary text-lg font-bold tracking-widest">
          <span className="w-3 h-3 rounded-full border-2 border-secondary mr-3"></span>
          ALL SYSTEMS NOMINAL
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="admin-panel p-8 border-t-4 border-t-border">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-bold text-text-muted tracking-widest">ACTIVE PLAYERS</h3>
            <Users className="text-text-main w-8 h-8" />
          </div>
          <div className="text-6xl font-black text-text-main tabular-nums font-mono">2</div>
          <div className="text-sm text-text-main mt-4 flex items-center font-bold">
            <span>+0% FROM LAST HOUR</span>
          </div>
        </div>

        <div className="admin-panel p-8 border-t-4 border-t-border">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-bold text-text-muted tracking-widest">SYSTEM HEALTH</h3>
            <Activity className="text-text-main w-8 h-8" />
          </div>
          <div className="text-6xl font-black text-text-main tabular-nums font-mono">100%</div>
          <div className="text-sm text-text-muted mt-4 flex items-center font-bold">
            <span>OPTIMAL</span>
          </div>
        </div>

        <div className="admin-panel p-8 border-t-4 border-t-border">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-bold text-text-muted tracking-widest">DB LATENCY</h3>
            <Database className="text-text-main w-8 h-8" />
          </div>
          <div className="text-6xl font-black text-text-main tabular-nums font-mono">4ms</div>
          <div className="text-sm text-text-muted mt-4 flex items-center font-bold">
            <span>LOCAL CONNECTION</span>
          </div>
        </div>

        <div className="admin-panel p-8 border-t-4 border-t-border">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-bold text-text-muted tracking-widest">SECURITY EVENTS</h3>
            <ShieldAlert className="text-text-main w-8 h-8" />
          </div>
          <div className="text-6xl font-black text-text-main tabular-nums font-mono">0</div>
          <div className="text-sm text-text-muted mt-4 flex items-center font-bold">
            <span>NO ANOMALIES DETECTED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
