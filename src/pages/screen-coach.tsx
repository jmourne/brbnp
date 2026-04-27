import React, { useState, useEffect } from 'react';
import { 
  Plus, Users, ArrowRight, Trash, Activity, 
  Upload, Check, Shield, Search, Zap, X 
} from 'lucide-react';
import { supabase } from '../lib/supabaseclient';
import type { Athlete, Metric, CoachPanelProps } from '../types';

// --- Sub-Component: Athlete Roster Management ---
interface AdminAthletesProps {
  onView: (a: Athlete) => void;
}

const AdminAthletes: React.FC<AdminAthletesProps> = ({ onView }) => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [name, setName] = useState('');
  const [sport, setSport] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAthletes();
  }, []);

  const fetchAthletes = async () => {
    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .order('full_name', { ascending: true });
    if (!error && data) setAthletes(data);
    setLoading(false);
  };

  const addAthlete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const { data, error } = await supabase
      .from('athletes')
      .insert([{ full_name: name.trim(), sport: sport.trim() || 'Unassigned' }])
      .select()
      .single();

    if (!error && data) {
      setAthletes([...athletes, data]);
      setName('');
      setSport('');
    }
  };

  const removeAthlete = async (id: number) => {
    const { error } = await supabase.from('athletes').delete().eq('id', id);
    if (!error) setAthletes(athletes.filter(a => a.id !== id));
  };

  return (
    <div className="admin-grid">
      <form className="panel" onSubmit={addAthlete}>
        <h3>ADD ATHLETE</h3>
        <div className="panel-sub">Onboard a new athlete to the roster.</div>
        <div className="field">
          <label>FULL NAME</label>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. John Smith"
          />
        </div>
        <div className="field">
          <label>SPORT (OPTIONAL)</label>
          <input 
            value={sport} 
            onChange={(e) => setSport(e.target.value)} 
            placeholder="e.g. Football"
          />
        </div>
        <button type="submit" className="btn-red w-full">
          <Plus size={14} className="inline mr-2"/> ADD ATHLETE
        </button>
      </form>

      <div className="panel p-0">
        <div className="p-6 border-b border-[var(--paper-line)]">
          <h3 className="flex items-center gap-2">
            <Users size={20}/> ROSTER 
            <span className="text-xs text-[var(--ink-4)] font-mono">({athletes.length})</span>
          </h3>
        </div>
        <div className="max-h-[500px] overflow-y-auto scrollbox">
          {loading ? <div className="p-10 text-center text-[var(--ink-4)]">Loading Roster...</div> : 
            athletes.map((a) => (
            <div key={a.id} className="list-row">
              <div className="avatar mr-4">{a.full_name.charAt(0)}</div>
              <div className="flex-1">
                <div className="name">{a.full_name}</div>
                <div className="meta">{a.sport?.toUpperCase()}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={() => onView(a)}>
                  VIEW <ArrowRight size={14}/>
                </button>
                <button className="del-btn" onClick={() => removeAthlete(a.id)}>
                  <Trash size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Metric Definitions ---
const AdminMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [name, setName] = useState('');
  const [cat, setCat] = useState('');
  const [lower, setLower] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data } = await supabase.from('metrics').select('*');
      if (data) setMetrics(data);
    };
    fetchMetrics();
  }, []);

  const addMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const { data, error } = await supabase
      .from('metrics')
      .insert([{ name: name.trim(), category: cat.trim(), lower_is_better: lower }])
      .select().single();
    if (!error && data) {
      setMetrics([...metrics, data]);
      setName(''); setCat(''); setLower(false);
    }
  };

  return (
    <div className="admin-grid">
      <form className="panel" onSubmit={addMetric}>
        <h3>DEFINE METRIC</h3>
        <div className="field">
          <label>METRIC NAME</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 40yd Dash"/>
        </div>
        <div className="field">
          <label>CATEGORY</label>
          <input value={cat} onChange={(e) => setCat(e.target.value)} placeholder="e.g. Speed"/>
        </div>
        <div className="toggle-row">
          <span>LOWER IS BETTER (e.g. Times)</span>
          <button 
            type="button" 
            className={`switch ${lower ? 'on' : ''}`} 
            onClick={() => setLower(!lower)}
          />
        </div>
        <button type="submit" className="btn-red w-full">CREATE METRIC</button>
      </form>
      <div className="panel p-0">
        <div className="p-6 border-b border-[var(--paper-line)] font-oswald uppercase">Active Metrics</div>
        {metrics.map(m => (
          <div key={m.id} className="list-row px-6 py-4 border-b border-[var(--paper-line)]">
            <div className="font-bold">{m.name}</div>
            <div className="text-xs text-[var(--ink-4)] uppercase">{m.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Coach Panel ---
export const CoachPanel: React.FC<CoachPanelProps> = ({ onExit, onViewAthlete }) => {
  const [tab, setTab] = useState<'athletes' | 'metrics' | 'log' | 'import'>('athletes');

  return (
    <div className="bg-[var(--paper-2)] min-h-screen">
      <header className="brandbar">
        <div className="brandbar-inner">
          <div className="brand-wordmark">BARBARIAN <span className="text-[var(--red)]">PERFORMANCE</span></div>
          <div className="ml-auto flex items-center gap-4 font-oswald text-xs tracking-widest">
            <span className="text-[var(--red)] flex items-center gap-1"><Shield size={14}/> ADMIN</span>
            <button onClick={onExit} className="btn-ghost">LOGOUT</button>
          </div>
        </div>
      </header>

      <main className="shell">
        <div className="sec-head">
          <div className="accent-bar"></div>
          <h2 className="font-oswald italic">COACH ADMIN PANEL</h2>
        </div>

        <div className="admin-tabs">
          {['athletes', 'metrics', 'log', 'import'].map((t) => (
            <button 
              key={t} 
              className={tab === t ? 'active' : ''} 
              onClick={() => setTab(t as any)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {tab === 'athletes' && <AdminAthletes onView={onViewAthlete} />}
        {tab === 'metrics' && <AdminMetrics />}
        {tab === 'log' && <div className="panel text-center p-20">Manual Log Interface Under Construction</div>}
        {tab === 'import' && <div className="panel text-center p-20">CSV Import Interface Under Construction</div>}
      </main>
    </div>
  );
};
