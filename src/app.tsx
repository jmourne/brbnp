import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import type { Athlete, Route } from './types';

import { LoginScreen } from './pages/screen-login'; 
import { AthleteDashboard } from './pages/screen-athlete';
import { CoachPanel } from './pages/screen-coach';

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>({ name: 'login' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setRoute({ name: 'coach' });
    }
  }, []);

const handleAthleteLogin = (athleteData: Athlete) => {
    setError(null);
    setRoute({ name: 'athlete', athlete: athleteData });
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

      {route.name === 'athlete' && route.athlete && (
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
