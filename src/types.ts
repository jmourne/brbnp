export interface Athlete {
  id: number;
  full_name: string | null;
  sport: string | null;
  created_at: string | null;
}

export interface Metric {
  id: number;
  name: string | null;
  category: string | null;
  unit: string | null;
  description: string | null;
  lower_is_better: boolean | null;
  created_at: string | null;
}

export interface Entry {
  id: number;
  athlete_id: number | null;
  metric_id: number | null;
  value: number | null;
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
  onCoachLogin: () => void;
}

export interface AthleteDashboardProps {
  athlete: Athlete;
  onBack: () => void;
  onLogout: () => void;
}

export interface CoachPanelProps {
  onExit: () => void;
  onViewAthlete: (a: Athlete) => void;
}

export {};
