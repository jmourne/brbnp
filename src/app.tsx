import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import type { Athlete, Route } from './types';

// Import your actual component files here
import { LoginScreen } from './components/LoginScreen'; 
import { AthleteDashboard } from './components/AthleteDashboard';
import { CoachPanel } from './components/CoachPanel';

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>({ name: 'login' });
  const [error, setError] = useState<string | null>(null);

  // Check for admin path on load
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setRoute({ name: 'coach' });
    }
  }, []);

  const handleAthleteLogin = async (inputName: string) => {
    setError(null);
    
    // Corrected query: Using 'full_name' to match your Supabase schema
    const { data, error: sbError } = await supabase
      .from('athletes')
      .select('*')
      .ilike('full_name', inputName.trim())
      .single();

    if (sbError || !data) {
      setError("Athlete not found. Please check spelling.");
      return;
    }

    setRoute({ name: 'athlete', athlete: data as Athlete });
  };

  const goLogin = () => {
    setError(null);
    setRoute({ name: 'login' });
    window.history.pushState({}, '', '/');
  };

  const goCoach = () => setRoute({ name: 'coach' });

  return (
    <main className="min-h-screen bg-black">
      {route.name === 'login' && (
        <LoginScreen 
          onAthleteLogin={handleAthleteLogin} 
          onCoachLogin={goCoach} 
          error={error} 
        />
      )}

      {route.name === 'athlete' && (
        <AthleteDashboard 
          athlete={route.athlete} 
          onBack={goLogin} 
          onLogout={goLogin} 
        />
      )}

      {route.name === 'coach' && (
        <CoachPanel 
          onExit={goLogin} 
          onViewAthlete={(a) => setRoute({ name: 'athlete', athlete: a })} 
        />
      )}
    </main>
  );
};

export default App;
