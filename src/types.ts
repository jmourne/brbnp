export interface Athlete {
  id: number;
  full_name: string; // Removed | null as these are required for logic
  sport: string | null;
  created_at: string | null;
}

export interface Metric {
  id: number;
  name: string;
  category: string;
  unit: string | null;
  description: string | null;
  lower_is_better: boolean;
  created_at: string | null;
}

export interface Entry {
  id: number;
  athlete_id: number;
  metric_id: number;
  value: number;
  notes: string | null;
  recorded_at: string | null;
}

export type Route = 
  | { name: 'login' } 
  | { name: 'athlete'; athlete: Athlete } 
  | { name: 'coach' };

declare global {
  interface Window {
    ATHLETES: Athlete[];
    METRICS: Metric[];
    Icon: Record<string, React.FC<{ size?: number }>>;
  }
}

export interface LoginScreenProps {
  onAthleteLogin: (a: Athlete) => void;
  // Updated to accept the code from the login input
  onCoachLogin: (code: string) => void; 
}

export interface AthleteDashboardProps {
  athlete: Athlete;
  onBack: () => void;
  onLogout: () => void;
}

export interface CoachPanelProps {
  onExit: () => void;
  onViewAthlete: (a: Athlete) => void;
  // This is the key that will be used in .setHeaders() 
  coachCode: string; 
}

export {};
