// ============ SHARED TYPE DEFINITIONS ============

export interface Athlete {
  id: number;
  name: string;
  sport: string;
  initials: string;
  joined: string;
}

export type MetricCategory = 'SPRINTS' | 'JUMPS' | 'STRENGTH' | string;

export interface Metric {
  id: string;
  name: string;
  cat: MetricCategory;
  unit: string;
  lowerBetter: boolean;
  latest: number;
  best: number;
  original: number;
  originalDate: string;
  isBest: boolean;
  delta: number;
}

export interface HistoryEntry {
  id: string;
  metric: string;
  date: string;
  value: number;
  unit: string;
}

export interface TrackedMetric {
  id?: string;
  name: string;
  cat: string;
  unit: string;
  lowerBetter: boolean;
}

export interface LogEntryInput {
  metric: string;
  value: number;
  unit: string;
  notes: string;
}

export type Route =
  | { name: 'login' }
  | { name: 'athlete'; athlete: Athlete }
  | { name: 'coach' };

// Globals attached to window
declare global {
  interface Window {
    ATHLETES: Athlete[];
    METRICS: Metric[];
    HISTORY: HistoryEntry[];
    TRACKED_METRICS: TrackedMetric[];

    Icon: Record<string, React.FC<{ size?: number }>>;
    BrandTriangle: React.FC<{ size?: number; color?: string }>;
    BrandBar: React.FC<BrandBarProps>;
    SecHead: React.FC<SecHeadProps>;
    Toast: React.FC<{ msg: string }>;
    fmtVal: (n: number | null | undefined) => string;
    fmtDelta: (d: number) => string;

    LoginScreen: React.FC<LoginScreenProps>;
    AthleteDashboard: React.FC<AthleteDashboardProps>;
    CoachPanel: React.FC<CoachPanelProps>;
  }
}

export interface BrandBarProps {
  user?: string;
  onLogout?: () => void;
  right?: React.ReactNode;
}

export interface SecHeadProps {
  title: string;
  meta?: string;
  num?: string;
  icon?: React.ReactNode;
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
