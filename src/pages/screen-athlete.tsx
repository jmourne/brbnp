import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  LogOut, 
  Award, 
  Clock 
} from 'lucide-react';
import { supabase } from '../lib/supabaseclient';
import type { 
  Athlete, 
  Metric, 
  HistoryEntry, 
  LogEntryInput, 
  AthleteDashboardProps 
} from '../types';

// --- Sub-Component: Individual Metric Card ---
const MetricCard: React.FC<{ m: any }> = ({ m }) => {
  const isTime = m.lower_is_better;
  const isImproved = m.delta === 0 ? null : isTime ? m.delta < 0 : m.delta > 0;
  
  return (
    <div className="metric-card">
      <div className="top">
        <div className="name font-bold uppercase tracking-tight">{m.name}</div>
        {m.delta !== 0 && (
          <span className={`delta-chip ${isImproved ? 'good' : 'warn'}`}>
            {isImproved ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
            {Math.abs(m.delta).toFixed(1)}
          </span>
        )}
      </div>
      <div className="metric-latest mt-4">
        <div className="lbl text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Latest</div>
        <div className="val text-3xl font-black font-mono">
          {m.latest} <span className="unit text-sm font-normal text-zinc-400">{m.unit}</span>
          {m.isBest && <span className="best-tag ml-2 bg-[var(--red)] text-[10px] px-1.5 py-0.5 text-white">PB</span>}
        </div>
      </div>
      <div className="metric-foot mt-4 pt-4 border-t border-zinc-100 grid grid-cols-2 gap-4">
        <div className="blk">
          <div className="lbl text-[9px] text-zinc-400 uppercase">Personal Best</div>
          <div className="v font-bold text-xs">{m.best} {m.unit}</div>
        </div>
        <div className="blk text-right">
          <div className="lbl text-[9px] text-zinc-400 uppercase">First Log</div>
          <div className="v text-xs">{m.original}</div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Sticky Bottom Log Bar ---
const LogEntryBar: React.FC<{ metrics: Metric[], onLog: (e: any) => void }> = ({ metrics, onLog }) => {
  const [metricId, setMetricId] = useState('');
  const [value, setValue] = useState('');

  const submit = () => {
    if (!metricId || !value) return;
    onLog({ metric_id: parseInt(metricId), value: parseFloat(value) });
    setMetricId('');
    setValue('');
  };

  return (
    <div className="log-bar shadow-2xl">
      <div className="log-bar-inner max-w-4xl mx-auto flex items-end gap-4 p-4">
        <div className="flex-1">
          <label className="lbl text-[10px] mb-1 block opacity-60">SELECT METRIC</label>
          <select value={metricId} onChange={(e) => setMetricId(e.target.value)} className="w-full">
            <option value="">-- Choose --</option>
            {metrics.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="w-24">
          <label className="lbl text-[10px] mb-1 block opacity-60">VALUE</label>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="0.0" />
        </div>
        <button onClick={submit} className="btn-red h-[42px] px-6 flex items-center gap-2">
          LOG <Plus size={16}/>
        </button>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
export const AthleteDashboard: React.FC<AthleteDashboardProps> = ({ athlete, onBack, onLogout }) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAthleteData();
  }, [athlete.id]);

  const loadAthleteData = async () => {
    // 1. Fetch available metrics
    const { data: metricsData } = await supabase.from('metrics').select('*').order('name');
    
    // 2. Fetch athlete's entries
    const { data: entriesData } = await supabase
      .from('entries')
      .select(`*, metrics(name, unit, category, lower_is_better)`)
      .eq('athlete_id', athlete.id)
      .order('recorded_at', { ascending: false });

    if (metricsData) setMetrics(metricsData);
    if (entriesData) setHistory(entriesData);
    setLoading(false);
  };

  const handleLog = async (entry: { metric_id: number, value: number }) => {
    const { error } = await supabase.from('entries').insert([{
      athlete_id: athlete.id,
      metric_id: entry.metric_id,
      value: entry.value,
      recorded_at: new Date().toISOString()
    }]);

    if (!error) loadAthleteData(); // Refresh data
  };

  if (loading) return <div className="p-20 text-center font-oswald animate-pulse">SYNCING PERFORMANCE DATA...</div>;

  return (
    <div className="min-h-screen bg-[var(--paper-2)] pb-32">
      <header className="brandbar">
        <div className="brandbar-inner">
          <div className="brand-wordmark font-oswald uppercase text-xl italic">
            BARBARIAN <span className="text-[var(--red)]">PERFORMANCE</span>
          </div>
          <button onClick={onLogout} className="ml-auto text-xs font-bold opacity-60 hover:opacity-100 flex items-center gap-2">
            LOGOUT <LogOut size={14}/>
          </button>
        </div>
      </header>

      <main className="shell p-6">
        <div className="athlete-strip flex items-center gap-6 bg-white p-6 rounded-lg border border-zinc-200">
          <button onClick={onBack} className="iconbtn p-2 hover:bg-zinc-100 rounded"><ChevronLeft/></button>
          <div className="athlete-id flex-1">
            <h1 className="text-3xl font-black font-oswald uppercase tracking-tighter italic">{athlete.full_name}</h1>
            <p className="text-xs font-bold text-[var(--red)] uppercase tracking-widest">{athlete.sport}</p>
          </div>
          <div className="stats flex gap-8">
            <div className="text-center">
              <div className="text-[10px] text-zinc-400 font-bold uppercase">Logs</div>
              <div className="text-xl font-black">{history.length}</div>
            </div>
          </div>
          <div className="avatar w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold">
            {athlete.full_name.charAt(0)}
          </div>
        </div>

        <div className="sec-head mt-12 mb-6 flex items-center gap-4">
          <div className="accent-bar w-1 h-8 bg-[var(--red)]"></div>
          <h2 className="text-2xl font-black font-oswald uppercase italic">Performance Metrics</h2>
        </div>

        {/* This is a simplified grid. You can group these by category if needed. */}
        <div className="metric-grid grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map(m => {
            const mEntries = history.filter(h => h.metric_id === m.id);
            if (mEntries.length === 0) return null;
            
            const latest = mEntries[0].value;
            const best = m.lower_is_better ? Math.min(...mEntries.map(e => e.value)) : Math.max(...mEntries.map(e => e.value));
            
            return (
              <MetricCard key={m.id} m={{
                ...m,
                latest,
                best,
                isBest: latest === best,
                delta: mEntries.length > 1 ? latest - mEntries[1].value : 0,
                original: mEntries[mEntries.length-1].value
              }}/>
            );
          })}
        </div>
      </main>

      <LogEntryBar metrics={metrics} onLog={handleLog}/>
    </div>
  );
};
