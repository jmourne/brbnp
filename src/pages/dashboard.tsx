import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface PerformanceSummary {
  metric_id: number;
  metric_name: string;
  category: string;
  unit: string;
  latest_value: number;
  original_value: number;
  best_value: number;
  original_date: string;
  lower_is_better: boolean;
}

const AthleteDashboard: React.FC<{ athleteId: number; athleteName: string }> = ({ athleteId, athleteName }) => {
  const [stats, setStats] = useState<PerformanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLogId, setActiveLogId] = useState<number | null>(null);

  const fetchStats = async () => {
    const { data } = await supabase
      .from('athlete_performance_summary')
      .select('*')
      .eq('athlete_id', athleteId);
    if (data) setStats(data);
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, [athleteId]);

  const handleQuickLog = async (metricId: number, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    await supabase.from('entries').insert([{ 
      athlete_id: athleteId, 
      metric_id: metricId, 
      value: numValue 
    }]);
    
    setActiveLogId(null);
    fetchStats(); // Refresh values
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      {/* HEADER */}
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-black italic uppercase italic leading-none">
            {athleteName.split(' ')[0]}<span className="text-barbarian-red">.</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-tighter text-xs">Performance Hub</p>
        </div>
        <div className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          Barbarian Status: Active
        </div>
      </header>

      {/* STAT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((s) => (
          <div 
            key={s.metric_id}
            onClick={() => setActiveLogId(s.metric_id)}
            className={`group relative bg-zinc-950 border ${activeLogId === s.metric_id ? 'border-barbarian-red' : 'border-zinc-900'} p-5 rounded-2xl transition-all hover:bg-zinc-900 cursor-pointer`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">{s.category}</p>
                <h3 className="text-xl font-bold uppercase italic tracking-tighter">{s.metric_name}</h3>
              </div>
              {s.latest_value === s.best_value && (
                <div className="bg-barbarian-red text-[9px] font-black px-2 py-0.5 rounded italic">PR</div>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter">{s.latest_value}</span>
              <span className="text-zinc-500 font-bold text-sm uppercase">{s.unit}</span>
            </div>

            {/* QUICK LOG OVERLAY */}
            {activeLogId === s.metric_id && (
              <div className="mt-4 animate-in slide-in-from-top-1 fade-in duration-200" onClick={(e) => e.stopPropagation()}>
                <input 
                  autoFocus
                  type="number"
                  step="0.1"
                  placeholder="NEW RESULT..."
                  className="w-full bg-black border-2 border-barbarian-red p-4 rounded-xl font-black text-center text-xl outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleQuickLog(s.metric_id, (e.target as HTMLInputElement).value)}
                />
                <p className="text-[9px] text-center mt-2 font-bold text-zinc-500 uppercase tracking-widest">Tap Enter to Save</p>
              </div>
            )}

            {/* FOOTER STATS */}
            <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
              <span>Original: <span className="text-white">{s.original_value}</span></span>
              {s.latest_value !== s.best_value && (
                <span className="text-barbarian-red">Best: {s.best_value}</span>
              )}
              <span>{new Date(s.original_date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AthleteDashboard;
