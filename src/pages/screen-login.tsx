import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Icon } from '../components/ui';
import type { LoginScreenProps } from '../types';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onAthleteLogin, onCoachLogin }) => {
  const [tab, setTab] = useState<'athlete' | 'coach'>('athlete');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'athlete') {
        const trimmedName = name.trim();
        if (!trimmedName) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }

        const { data, error: sbError } = await supabase
          .from('athletes')
          .select('*')
          .ilike('full_name', trimmedName)
          .single();

        if (sbError || !data) {
          setError('Athlete not found. Check your spelling or contact Coach Drew.');
        } else {
          onAthleteLogin(data);
        }
      } else {
        // --- SECURE COACH LOGIN ---
        const cleanCode = password.trim();
        
        // We MUST specify the 'private' schema here because we moved the function 
        // there to clear your Supabase Security Warnings.
        const { data: isValid, error: coachError } = await supabase.rpc(
          'check_is_coach', 
          { provided_code: cleanCode },
          { schema: 'private' } 
        );

        if (coachError) {
          console.error("Login Service Error:", coachError.message);
          setError('VERIFICATION SERVICE UNAVAILABLE.');
        } else if (!isValid) {
          setError('INVALID ACCESS CODE.');
        } else {
          // Pass the code so the CoachPanel can use it for RLS headers
          onCoachLogin(cleanCode);
        }
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-left">
        <div>
          <div className="kicker">
            <span className="bar" /> EST. 2023 — MELISSA, TX
          </div>
          <h1 className="font-oswald uppercase italic leading-[0.9] mt-6 text-white">
            STRENGTH.<br />
            SPEED.<br />
            <span className="text-[var(--red)]">POWER.</span>
          </h1>
          <p className="mt-8 text-zinc-400 max-w-sm leading-relaxed">
            Barbarian Performance Athlete Portal. Log every rep, sprint, and jump. 
            Track your progression. No gimmicks — just results.
          </p>
        </div>
        <div className="footer-row text-[10px] opacity-40 uppercase tracking-[0.2em] text-white">
          Portal v2.4 · Coach Drew Little · 900+ Athletes Trained
        </div>
      </div>

      <div className="login-right flex items-center justify-center p-8">
        <div className="login-card w-full max-w-md">
          <div className="sublabel text-[var(--red)] font-bold tracking-widest text-[10px]">
            PORTAL ACCESS
          </div>
          <h2 className="text-4xl font-black font-oswald uppercase italic mt-2 text-white">Sign In</h2>
          
          <div className="login-tabs flex border border-zinc-800 rounded mt-6 overflow-hidden">
            <button 
              type="button"
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all ${tab === 'athlete' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
              onClick={() => { setTab('athlete'); setError(''); }}
            >
              Athlete
            </button>
            <button 
              type="button"
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all ${tab === 'coach' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
              onClick={() => { setTab('coach'); setError(''); }}
            >
              Coach
            </button>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            {tab === 'athlete' ? (
              <div className="field">
                <label className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase ml-1">Athlete Name</label>
                <div className="relative mt-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
                    <Icon.Users size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="John Smith" 
                    className="w-full bg-white border border-zinc-200 p-4 pl-12 rounded outline-none focus:border-[var(--red)] transition-all text-black"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="field">
                <label className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase ml-1">Access Code</label>
                <div className="relative mt-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
                    <Icon.Shield size={18} />
                  </div>
                  <input 
                    type="password" 
                    placeholder="Enter Code" 
                    className="w-full bg-white border border-zinc-200 p-4 pl-12 rounded outline-none focus:border-[var(--red)] transition-all text-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-[var(--red)] text-[10px] font-bold uppercase p-3 rounded border border-red-100 flex items-center gap-2">
                <span className="animate-pulse">⚠</span> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-red w-full py-4 flex items-center justify-center gap-2 text-sm font-black italic tracking-widest"
            >
              {loading ? 'VERIFYING...' : tab === 'athlete' ? 'ACCESS DASHBOARD' : 'ENTER ADMIN'}
              {!loading && <Icon.ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <a 
              href="sms:+14054749227" 
              className="text-[10px] font-bold text-zinc-400 hover:text-[var(--red)] transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Icon.Pulse size={14} /> Need Help? Text Coach
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
