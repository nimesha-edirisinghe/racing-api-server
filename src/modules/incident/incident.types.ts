export interface RacingIncident {
  id: string;
  type:
    | "collision"
    | "penalty"
    | "mechanical"
    | "track_obstruction"
    | "rule_violation"
    | "dnf"
    | "unsafe_pit";
  raceCategory: "F1" | "MotoGP" | "Rally" | "IndyCar" | "NASCAR";
  location: string;
  circuit: string;
  severity: "low" | "medium" | "high" | "critical";
  drivers: string[];
  teams: string[];
  lapNumber: number;
  raceTime: string;
  description: string;
  timestamp: string;
  status: "pending" | "investigating" | "resolved";
  stewardNotes?: string;
}

export interface IncidentFormData {
  type: string;
  raceCategory: string;
  location: string;
  circuit?: string;
  severity: string;
  drivers?: string | string[];
  teams?: string | string[];
  lapNumber: string | number;
  raceTime?: string;
  description: string;
  status: string;
  stewardNotes?: string;
}
