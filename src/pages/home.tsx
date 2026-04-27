import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const LandingPage: React.FC = () => {
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
      {/* HEADER */}
      <div className="mb-12 text-center">
        <h1 className="text-6xl font-display font-black italic tracking-tighter uppercase text-white leading-none">
          Barbarian<span className="text-barbarian-red">Performance</span>
        </h1>
        <p className="mt-4 text-zinc-400 tracking-widest uppercase text-sm font-bold">
          Strength • Speed • Power
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-barbarian-zinc border border-zinc-800 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">ATHLETE LOGIN</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase mb-2">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. JULES MOURNE"
              className="w-full bg-black border border-zinc-700 p-4 rounded-lg focus:border-barbarian-red outline-none transition-all uppercase font-bold"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <button className="w-full bg-barbarian-red hover:bg-red-700 text-white font-black py-4 rounded-lg transition-transform active:scale-95 uppercase tracking-widest">
            Access Dashboard
          </button>
        </div>
      </div>

      {/* FOOTER (Coach Access) */}
      <footer className="mt-12">
        <button className="text-zinc-600 hover:text-barbarian-red text-xs font-bold uppercase tracking-widest transition-colors">
          Coach Access
        </button>
      </footer>
    </div>
  );
};

export default LandingPage;
