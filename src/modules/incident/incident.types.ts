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

// New types for search, filtering, and pagination
export interface IncidentSearchParams {
  search?: string;
  category?: string;
  severity?: string;
  status?: string;
  type?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  filtered: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IncidentsResponse {
  incidents: RacingIncident[];
  pagination: PaginationInfo;
  counts: {
    total: number;
    filtered: number;
    showing: number;
  };
}
