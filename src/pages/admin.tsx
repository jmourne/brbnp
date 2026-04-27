import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface AdminProps {
  onViewAthlete: (id: number, name: string) => void;
  onExit: () => void;
}

const AdminPanel: React.FC<AdminProps> = ({ onViewAthlete, onExit }) => {
  const [activeTab, setActiveTab] = useState<'Athletes' | 'Metrics' | 'Log Data'>('Athletes');
  const [athletes, setAthletes] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  
  // Form States
  const [athleteForm, setAthleteForm] = useState({ name: '', sport: '' });
  const [metricForm, setMetricForm] = useState({ name: '', category: '', unit: '', lower_is_better: false });
  const [logForm, setLogForm] = useState({ athlete_id: '', metric_id: '', value: '', notes: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: a } = await supabase.from('athletes').select('*').order('name');
    const { data: m } = await supabase.from('metrics').select('*').order('name');
    if (a) setAthletes(a);
    if (m) setMetrics(m);
  };

  const handleAddAthlete = async () => {
    if (!athleteForm.name) return;
    await supabase.from('athletes').insert([{ name: athleteForm.name, sport: athleteForm.sport }]);
    setAthleteForm({ name: '', sport: '' });
    fetchData();
  };

  const handleDeleteAthlete = async (id: number) => {
    if (window.confirm("Delete athlete and all their performance history?")) {
      await supabase.from('athletes').delete().eq('id', id);
      fetchData();
    }
  };

  const handleAddMetric = async () => {
    if (!metricForm.name) return;
    await supabase.from('metrics').insert([metricForm]);
    setMetricForm({ name: '', category: '', unit: '', lower_is_better: false });
    fetchData();
  };

  const handleDeleteMetric = async (id: number) => {
    if (window.confirm("Delete this metric? This cannot be undone.")) {
      await supabase.from('metrics').delete().eq('id', id);
      fetchData();
    }
  };

  const handleLogData = async () => {
    if (!logForm.athlete_id || !logForm.metric_id || !logForm.value) return;
    await supabase.from('entries').insert([{
      athlete_id: parseInt(logForm.athlete_id),
      metric_id: parseInt(logForm.metric_id),
      value: parseFloat(logForm.value),
      notes: logForm.notes
    }]);
    setLogForm({ ...logForm, value: '', notes: '' });
    alert("Data logged successfully.");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-zinc-900 font-sans">
      {/* HEADER */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold">Coach Admin Panel</h1>
        <button onClick={onExit} className="text-sm text-zinc-500 hover:text-orange-600 font-medium transition-colors">
          Exit Admin
        </button>
      </header>

      {/* NAV */}
      <nav className="bg-white px-6 border-b border-zinc-200 flex gap-1">
        {['Athletes', 'Metrics', 'Log Data'].map((tab: any) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-4 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab ? 'border-orange-600 text-orange-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        {/* ATHLETES TAB */}
        {activeTab === 'Athletes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm self-start">
              <h2 className="text-lg font-bold mb-6">Add Athlete</h2>
              <div className="space-y-4">
                <input className="w-full border border-zinc-200 p-3 rounded-lg outline-none focus:border-orange-600" placeholder="Full Name" value={athleteForm.name} onChange={e => setAthleteForm({...athleteForm, name: e.target.value})} />
                <input className="w-full border border-zinc-200 p-3 rounded-lg outline-none focus:border-orange-600" placeholder="Sport (optional)" value={athleteForm.sport} onChange={e => setAthleteForm({...athleteForm, sport: e.target.value})} />
                <button onClick={handleAddAthlete} className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors">Add Athlete</button>
              </div>
            </div>
            <div className="lg:col-span-8 bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-zinc-200 bg-zinc-50 font-bold text-sm">Roster ({athletes.length})</div>
              {athletes.map(a => (
                <div key={a.id} className="p-4 flex justify-between items-center border-b border-zinc-100 last:border-0 hover:bg-zinc-50 group">
                  <div>
                    <p className="font-bold">{a.name}</p>
                    <p className="text-xs text-zinc-500">{a.sport || 'General'} • Joined {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => onViewAthlete(a.id, a.name)} className="text-zinc-400 hover:text-zinc-900 font-bold text-xs flex items-center gap-1">
                      View <span className="text-lg leading-none">→</span>
                    </button>
                    <button onClick={() => handleDeleteAthlete(a.id)} className="text-zinc-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* METRICS TAB */}
        {activeTab === 'Metrics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm self-start">
              <h2 className="text-lg font-bold mb-6">Define Metric</h2>
              <div className="space-y-4">
                <input className="w-full border border-zinc-200 p-3 rounded-lg outline-none focus:border-orange-600" placeholder="e.g. Vertical Jump" value={metricForm.name} onChange={e => setMetricForm({...metricForm, name: e.target.value})} />
                <input className="w-full border border-zinc-200 p-3 rounded-lg outline-none focus:border-orange-600" placeholder="Category (e.g. Power)" value={metricForm.category} onChange={e => setMetricForm({...metricForm, category: e.target.value})} />
                <input className="w-full border border-zinc-200 p-3 rounded-lg outline-none focus:border-orange-600" placeholder="Unit (e.g. inches)" value={metricForm.unit} onChange={e => setMetricForm({...metricForm, unit: e.target.value})} />
                <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Lower is Better</span>
                    <span className="text-[10px] text-zinc-400 uppercase">For time/sprints</span>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-orange-600" checked={metricForm.lower_is_better} onChange={e => setMetricForm({...metricForm, lower_is_better: e.target.checked})} />
                </div>
                <button onClick={handleAddMetric} className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors">Add Metric</button>
              </div>
            </div>
            <div className="lg:col-span-8 bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-zinc-200 bg-zinc-50 font-bold text-sm flex justify-between">
                <span>Tracked Metrics ({metrics.length})</span>
              </div>
              <div className="divide-y divide-zinc-100">
                {metrics.map(m => (
                  <div key={m.id} className="p-4 flex justify-between items-center hover:bg-zinc-50 group transition-colors">
                    <div>
                      <p className="font-bold">{m.name}</p>
                      <p className="text-xs text-zinc-500 uppercase">{m.category} • {m.unit}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {m.lower_is_better && <span className="bg-zinc-100 text-zinc-500 text-[9px] font-black px-2 py-1 rounded">LOWER = BETTER</span>}
                      <button onClick={() => handleDeleteMetric(m.id)} className="text-zinc-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LOG DATA TAB */}
        {activeTab === 'Log Data' && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-xl border border-zinc-200 shadow-sm">
            <h2 className="text-xl font-bold mb-2 italic">Manual Data Entry</h2>
            <p className="text-sm text-zinc-500 mb-8 font-medium">Log a workout or test result on behalf of an athlete.</p>
            <div className="space-y-6">
              <select className="w-full border border-zinc-200 p-3 rounded-lg outline-none focus:border-orange-600 font-bold uppercase text-sm" value={logForm.athlete_id} onChange={e => setLogForm({...logForm, athlete_id: e.target.value})}>
                <option value="">Select athlete</option>
                {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <select className="w-full border border-zinc-200 p-3 rounded-lg outline-none focus:border-orange-600 font-bold uppercase text-sm" value={logForm.metric_id} onChange={e => setLogForm({...logForm, metric_id: e.target.value})}>
                <option value="">Select metric</option>
                {metrics.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <input type="number" step="0.1" className="w-full border border-zinc-200 p-3 rounded-lg outline-none focus:border-orange-600 font-bold text-lg" placeholder="Value (e.g. 24.5)" value={logForm.value} onChange={e => setLogForm({...logForm, value: e.target.value})} />
              <input className="w-full border border-zinc-200 p-3 rounded-lg outline-none focus:border-orange-600" placeholder="Notes (optional)" value={logForm.notes} onChange={e => setLogForm({...logForm, notes: e.target.value})} />
              <button onClick={handleLogData} className="w-full bg-orange-600 text-white font-bold py-4 rounded-lg hover:bg-orange-700 transition-all active:scale-[0.98]">Log Performance Data</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
