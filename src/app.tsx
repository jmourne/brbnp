import React, { useState } from 'react';
import LandingPage from './pages/home';
import AthleteDashboard from './pages/dashboard';
import { supabase } from './lib/supabaseClient';

function App() {
  const [athlete, setAthlete] = useState<{ id: number; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (inputName: string) => {
    setError(null);
    
    // Search for athlete by name
   const { data, error: sbError } = await supabase
    .from('athletes')
    .select('id, name')
    .ilike('name', inputName.trim()) 
    .single();

    if (sbError || !data) {
      setError("Athlete not found.");
      return;
    }

    // Success: Switch to Dashboard
    setAthlete({ id: data.id, name: data.name });
  };

  return (
    <main className="min-h-screen bg-black">
      {athlete ? (
        <AthleteDashboard 
          athleteId={athlete.id} 
          athleteName={athlete.name} 
        />
      ) : (
        <LandingPage 
          onLogin={handleLogin} 
          loginError={error}
        />
      )}
    </main>
  );
}

export default App;
