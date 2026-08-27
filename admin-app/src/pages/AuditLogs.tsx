import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

type AuditLog = {
  id: number;
  timestamp: string;
  admin_id: string;
  target_id: string;
  action: string;
  field: string;
  old_value: string;
  new_value: string;
};

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/audit')
      .then(res => res.json())
      .then(data => setLogs(data.logs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h2 className="text-4xl font-black tracking-widest text-text-main mb-2">SYSTEM AUDIT LOGS</h2>
          <p className="text-lg text-text-muted tracking-wider">Immutable record of administrative actions.</p>
        </div>
      </div>

      <div className="admin-panel border-t-4 border-t-border p-0 overflow-hidden font-sans">
        <div className="bg-surface p-6 border-b border-border flex items-center">
          <Terminal className="w-7 h-7 text-text-main mr-4" />
          <span className="text-lg font-bold text-text-main tracking-widest">REALTIME LOG STREAM</span>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-lg text-text-muted animate-pulse">FETCHING LOGS...</div>
        ) : (
          <div className="max-h-[800px] overflow-y-auto p-6 space-y-4 font-mono text-base">
            {logs.length === 0 ? (
              <div className="text-text-muted p-6 text-lg font-sans font-bold">NO AUDIT LOGS FOUND.</div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="flex flex-col md:flex-row md:items-start p-5 bg-background border border-border rounded hover:border-text-main transition-colors">
                  <div className="text-text-muted shrink-0 md:w-64 mb-2 md:mb-0 font-mono text-sm mt-1">
                    {new Date(log.timestamp).toISOString().replace('T', ' ').slice(0, 19)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap gap-3 text-sm font-sans font-bold">
                      <span className="bg-border text-text-main px-3 py-1 rounded">ADMIN: <span className="font-mono">{log.admin_id}</span></span>
                      <span className="text-text-muted">→</span>
                      <span className="bg-surface border border-border text-text-main px-3 py-1 rounded">TARGET: <span className="font-mono">{log.target_id}</span></span>
                      <span className="bg-text-main text-background px-3 py-1 rounded ml-auto uppercase">{log.action}</span>
                    </div>
                    <div className="pt-3 text-text-main text-lg font-sans">
                      Modified <span className="font-bold">{log.field}</span>: <span className="text-text-muted line-through font-mono text-base">{log.old_value}</span> <span className="text-text-main font-bold font-mono text-base">{log.new_value}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
