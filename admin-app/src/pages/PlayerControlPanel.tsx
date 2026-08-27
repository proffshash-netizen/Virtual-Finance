import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Save, AlertTriangle } from 'lucide-react';
import type { PlayerData } from './PlayerManagement';

export function PlayerControlPanel() {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [edits, setEdits] = useState<Partial<PlayerData>>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/players')
      .then(res => res.json())
      .then(data => {
        const found = (data.players || []).find((p: PlayerData) => p.id === id);
        setPlayer(found || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field: keyof PlayerData, value: number) => {
    setEdits(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (Object.keys(edits).length === 0) return;
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/admin/players/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edits)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('PLAYER DATA UPDATED SUCCESSFULLY');
        setPlayer(prev => prev ? { ...prev, ...edits } : null);
        setEdits({});
      } else {
        setErrorMsg(data.error || 'Failed to update');
      }
    } catch (e) {
      setErrorMsg('Connection error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse">LOADING PROFILE...</div>;
  if (!player) return <div className="text-danger">PLAYER NOT FOUND</div>;

  const fields: Array<{ key: keyof PlayerData, label: string }> = [
    { key: 'level', label: 'LEVEL' },
    { key: 'xp', label: 'XP' },
    { key: 'money', label: 'MONEY (₹)' },
    { key: 'net_worth', label: 'NET WORTH (₹)' },
    { key: 'health', label: 'HEALTH' },
    { key: 'streak_days', label: 'STREAK DAYS' },
  ];

  const hasChanges = Object.keys(edits).length > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center space-x-6 border-b border-border pb-6">
        <Link to="/players" className="admin-btn-secondary p-4 group">
          <ChevronLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h2 className="text-4xl font-black tracking-widest text-text-main mb-2">
            PLAYER CONTROL: <span className="text-text-main font-mono">{player.id}</span>
          </h2>
          <p className="text-lg text-text-muted tracking-wider font-sans font-bold">{player.display_name} | {player.email}</p>
        </div>
      </div>

      <div className="admin-panel p-10 font-sans">
        <h3 className="text-lg font-bold text-text-muted tracking-widest mb-8 uppercase border-b border-border pb-4">
          Mutable Attributes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {fields.map(({ key, label }) => {
            const currentValue = player[key] as number;
            const newValue = edits[key] !== undefined ? edits[key] : currentValue;
            const diff = (newValue as number) - currentValue;
            
            return (
              <div key={key} className="space-y-4">
                <label className="block text-base font-bold text-text-muted tracking-widest">{label}</label>
                <div className="flex items-center space-x-6">
                  <input 
                    type="number"
                    min="0"
                    className="admin-input flex-1 text-lg py-3 font-mono"
                    value={newValue}
                    onChange={(e) => handleChange(key, parseInt(e.target.value) || 0)}
                  />
                  <div className={`w-32 text-right text-base font-bold tabular-nums font-mono ${diff > 0 ? 'text-text-main' : diff < 0 ? 'text-text-muted' : 'text-text-muted'}`}>
                    {diff > 0 ? '+' : ''}{diff !== 0 ? diff : '-'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between font-sans">
          <div className="mb-6 md:mb-0">
            {successMsg && <span className="text-text-main text-lg font-bold">{successMsg}</span>}
            {errorMsg && <span className="text-text-main text-lg font-bold flex items-center"><AlertTriangle className="w-6 h-6 mr-3 text-text-muted"/> {errorMsg}</span>}
          </div>
          <button 
            className="admin-btn-primary flex items-center text-lg py-3 px-8"
            disabled={!hasChanges || saving}
            onClick={handleSave}
          >
            <Save className="w-6 h-6 mr-3" />
            {saving ? 'COMMITTING...' : 'COMMIT CHANGES'}
          </button>
        </div>
      </div>
    </div>
  );
}
