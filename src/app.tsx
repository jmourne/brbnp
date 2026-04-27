import React, { useState, useEffect } from 'react';
import LandingPage from './pages/home';
import AthleteDashboard from './pages/dashboard';
import AdminPanel from './pages/admin';
import { supabase } from './lib/supabaseClient';

function App() {
  const [athlete, setAthlete] = useState<{ id: number; name: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check URL on load for /admin path
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = async (inputName: string) => {
    setError(null);
    const { data, error: sbError } = await supabase
      .from('athletes')
      .select('id, name')
      .ilike('name', inputName.trim()) 
      .single();

    if (sbError || !data) {
      setError("Athlete not found.");
      return;
    }
    setAthlete({ id: data.id, name: data.name });
  };

  // Bridge function for Coach to view specific athlete
  const handleViewAthlete = (id: number, name: string) => {
    setAthlete({ id, name });
    setIsAdmin(false);
  };

  const handleExit = () => {
    setIsAdmin(false);
    setAthlete(null);
    window.history.pushState({}, '', '/');
  };

  return (
    <main className="min-h-screen bg-black">
      {isAdmin ? (
        <AdminPanel 
          onViewAthlete={handleViewAthlete} 
          onExit={handleExit} 
        />
      ) : athlete ? (
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
