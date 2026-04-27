import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
// Import shared professional UI components
import { BrandBar, SecHead, Icon } from '../components/ui';
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

  useEffect(() => { fetchAthletes(); }, []);

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
          <Icon.Plus size={14} className="inline mr-2"/> ADD ATHLETE
        </button>
      </form>

      <div className="panel p-0 shadow-sm border border-zinc-200">
        <div className="p-6 border-b border-[var(--paper-line)] bg-zinc-50">
          <h3 className="flex items-center gap-2">
            <Icon.Users size={20}/> ROSTER 
            <span className="text-xs text-[var(--ink-4)] font-mono uppercase tracking-widest">({athletes.length})</span>
          </h3>
        </div>
        <div className="max-h-[500px] overflow-y-auto scrollbox">
          {loading ? <div className="p-10 text-center text-[var(--ink-4)] font-oswald animate-pulse">Loading Roster...</div> : 
            athletes.map((a) => (
            <div key={a.id} className="list-row flex items-center p-4 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors">
              <div className="avatar w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center font-bold font-oswald italic mr-4">
                {a.full_name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="name font-bold uppercase">{a.full_name}</div>
                <div className="meta text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{a.sport?.toUpperCase()}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={() => onView(a)}>
                  VIEW <Icon.ArrowRight size={14}/>
                </button>
                <button className="del-btn p-2 text-zinc-300 hover:text-[var(--red)]" onClick={() => removeAthlete(a.id)}>
                  <Icon.Trash size={16}/>
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
      const { data } = await supabase.from('metrics').select('*').order('category');
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
        <div className="toggle-row flex items-center justify-between p-3 bg-zinc-50 rounded border border-zinc-100">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Lower is Better</span>
          <button 
            type="button" 
            className={`switch ${lower ? 'on' : ''}`} 
            onClick={() => setLower(!lower)}
          />
        </div>
        <button type="submit" className="btn-red w-full mt-4">CREATE METRIC</button>
      </form>
      <div className="panel p-0 border border-zinc-200">
        <div className="p-6 border-b border-[var(--paper-line)] bg-zinc-50 font-oswald uppercase italic font-bold">Active Library</div>
        <div className="max-h-[400px] overflow-y-auto scrollbox">
          {metrics.map(m => (
            <div key={m.id} className="px-6 py-4 border-b border-zinc-100 last:border-0 flex justify-between items-center">
              <div>
                <div className="font-bold uppercase tracking-tight">{m.name}</div>
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{m.category}</div>
              </div>
              {m.lower_is_better && <Icon.Shield size={12} className="text-[var(--red)] opacity-50" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Coach Panel ---
export const CoachPanel: React.FC<CoachPanelProps> = ({ onExit, onViewAthlete }) => {
  const [tab, setTab] = useState<'athletes' | 'metrics' | 'log' | 'import'>('athletes');

  return (
    <div className="bg-[var(--paper-2)] min-h-screen pb-20">
      <BrandBar user="COACH DREW" onLogout={onExit} isAdmin={true} />

      <main className="shell p-6">
        <SecHead title="Coach Admin Panel" meta="Internal Roster Management" />

        <div className="admin-tabs flex gap-6 border-b border-zinc-200 mb-8">
          {['athletes', 'metrics', 'log', 'import'].map((t) => (
            <button 
              key={t} 
              className={`pb-4 font-oswald text-sm tracking-widest uppercase transition-all ${tab === t ? 'border-b-2 border-[var(--red)] text-zinc-900 font-bold' : 'text-zinc-400 hover:text-zinc-600'}`} 
              onClick={() => setTab(t as any)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="tab-content animate-in fade-in slide-in-from-bottom-2 duration-300">
          {tab === 'athletes' && <AdminAthletes onView={onViewAthlete} />}
          {tab === 'metrics' && <AdminMetrics />}
          {tab === 'log' && <div className="panel text-center p-20 font-oswald italic text-zinc-400">Manual Log Interface Under Construction</div>}
          {tab === 'import' && <div className="panel text-center p-20 font-oswald italic text-zinc-400">CSV Import Interface Under Construction</div>}
        </div>
      </main>
    </div>
  );
};
