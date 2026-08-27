import { useState, useEffect } from 'react';
import { Search, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export type PlayerData = {
  id: string;
  display_name: string;
  email: string;
  avatar_id: string;
  level: number;
  xp: number;
  money: number;
  net_worth: number;
  health: number;
  streak_days: number;
};

export function PlayerManagement() {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/players')
      .then(res => res.json())
      .then(data => setPlayers(data.players || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = players.filter(p => 
    p.id.toLowerCase().includes(search.toLowerCase()) || 
    p.display_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h2 className="text-4xl font-black tracking-widest text-text-main mb-2">PLAYER DATABASE</h2>
          <p className="text-lg text-text-muted tracking-wider">Search and manage registered users.</p>
        </div>
      </div>

      <div className="admin-panel p-8">
        <div className="flex items-center mb-8 max-w-xl relative">
          <Search className="w-7 h-7 absolute left-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search by ID or Name..." 
            className="admin-input pl-14 py-3 text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-lg text-text-muted animate-pulse tracking-widest">
            QUERYING DATABASE...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-sm text-text-muted tracking-widest uppercase font-sans">
                  <th className="p-6 font-bold">User ID</th>
                  <th className="p-6 font-bold">Display Name</th>
                  <th className="p-6 font-bold">Level</th>
                  <th className="p-6 font-bold">Net Worth</th>
                  <th className="p-6 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-base font-sans">
                {filtered.map(player => (
                  <tr key={player.id} className="border-b border-border hover:bg-surface/50 transition-colors">
                    <td className="p-6 font-bold text-text-main font-mono">{player.id}</td>
                    <td className="p-6 flex items-center font-bold">
                      <User className="w-6 h-6 mr-3 text-text-muted" />
                      {player.display_name}
                    </td>
                    <td className="p-6 tabular-nums font-mono">LVL {player.level}</td>
                    <td className="p-6 text-text-main font-bold tabular-nums font-mono">₹{player.net_worth.toLocaleString()}</td>
                    <td className="p-6 text-right">
                      <Link to={`/players/${player.id}`} className="admin-btn-secondary py-2 px-4 text-sm inline-flex items-center group">
                        MANAGE
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-lg text-text-muted tracking-widest">
                      NO RECORDS FOUND
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
