import React, { useEffect, useState, useMemo } from 'react';
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

interface MetricOption {
  id: number;
  name: string;
}

const AthleteDashboard: React.FC<{ athleteId: number; athleteName: string }> = ({ athleteId, athleteName }) => {
  const [stats, setStats] = useState<PerformanceSummary[]>([]);
  const [allMetrics, setAllMetrics] = useState<MetricOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLogId, setActiveLogId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDashboardData = async () => {
    const { data: summary } = await supabase.from('athlete_performance_summary').select('*').eq('athlete_id', athleteId);
    const { data: list } = await supabase.from('metrics').select('id, name').order('name', { ascending: true });
    if (summary) setStats(summary);
    if (list) setAllMetrics(list);
    setLoading(false);
  };

  useEffect(() => { fetchDashboardData(); }, [athleteId]);

  // Search logic for the footer
  const filteredMetrics = useMemo(() => 
    searchQuery.length > 0 
      ? allMetrics.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
      : [],
    [allMetrics, searchQuery]
  );

  const handleQuickLog = async (metricId: number, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    await supabase.from('entries').insert([{ athlete_id: athleteId, metric_id: metricId, value: numValue }]);
    setActiveLogId(null);
    setSearchQuery('');
    fetchDashboardData();
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-display text-barbarian-red italic font-black">LOADING...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-40">
      {/* BRANDED HEADER */}
      <header className="mb-10 flex justify-between items-end border-b border-zinc-900 pb-4 font-display">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
          {athleteName.split(' ')[0]}<span className="text-barbarian-red">.</span>
        </h1>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Performance Hub</p>
      </header>

      {/* DASHBOARD CARDS: CLICK TO UPDATE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div 
            key={s.metric_id} 
            onClick={() => setActiveLogId(s.metric_id)} 
            className={`bg-zinc-950 border ${activeLogId === s.metric_id ? 'border-barbarian-red scale-[1.02]' : 'border-zinc-900'} p-6 rounded-2xl hover:bg-zinc-900 transition-all cursor-pointer relative overflow-hidden`}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold uppercase italic tracking-tighter">{s.metric_name}</h3>
              {s.latest_value === s.best_value && <span className="bg-barbarian-red text-[9px] font-black px-2 py-1 rounded italic uppercase">Best</span>}
            </div>
            
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter">{s.latest_value}</span>
              <span className="text-zinc-500 font-bold text-sm uppercase italic">{s.unit}</span>
            </div>

            {/* INLINE LOGGING INPUT (Triggers from Card Click OR Search) */}
            {activeLogId === s.metric_id && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2" onClick={e => e.stopPropagation()}>
                <input 
                  autoFocus 
                  type="number" 
                  step="0.1" 
                  placeholder="NEW RESULT..." 
                  className="w-full bg-black border-2 border-barbarian-red p-4 rounded-xl font-black text-center text-xl outline-none placeholder:text-zinc-800" 
                  onKeyDown={e => e.key === 'Enter' && handleQuickLog(s.metric_id, (e.target as HTMLInputElement).value)} 
                />
                <div className="flex justify-between mt-2 px-1">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Enter to Save</p>
                  <button onClick={() => setActiveLogId(null)} className="text-[9px] font-black text-barbarian-red uppercase tracking-widest">Cancel</button>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
              <span>Original: <span className="text-zinc-300">{s.original_value}</span></span>
              {s.latest_value !== s.best_value && <span className="text-barbarian-red italic">Best: {s.best_value}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* SEARCHABLE STICKY FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full bg-zinc-950/90 backdrop-blur-md border-t border-zinc-900 p-6 z-50">
        <div className="max-w-md mx-auto relative">
          {/* Search Results Dropup */}
          {filteredMetrics.length > 0 && (
            <div className="absolute bottom-full mb-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
              {filteredMetrics.map(m => (
                <button 
                  key={m.id} 
                  onClick={() => { 
                    setActiveLogId(m.id); 
                    setSearchQuery('');
                    window.scrollTo({ top: 0, behavior: 'smooth' }); 
                  }}
                  className="w-full text-left p-4 text-xs font-black uppercase border-b border-zinc-800 hover:bg-barbarian-red transition-colors"
                >
                  {m.name}
                </button>
              ))}
            </div>
          )}
          
          <input 
            type="text" 
            placeholder="SEARCH ALL TESTS..." 
            className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-sm font-bold uppercase outline-none focus:border-barbarian-red transition-colors italic tracking-widest"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </footer>
    </div>
  );
};

export default AthleteDashboard;
