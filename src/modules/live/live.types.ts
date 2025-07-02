export type AlertType = "critical" | "warning" | "info";

export interface LiveAlert {
  id: string;
  type: AlertType;
  message: string;
  location: string;
  timestamp: Date;
}

export interface RemoveAlertParams {
  alertId: string;
}

export interface RaceDetails {
  raceTime: string;
  currentLap: number;
}

export interface RealTimeMetrics {
  incidentRate: number;
  responseTime: number;
  resolutionRate: {
    value: number;
    change: number;
  };
}

export interface TimelineDataPoint {
  time: string;
  incidents: number;
  responseTime: number;
  severity: number;
  resolved: number;
}

export interface LiveData {
  metrics: RealTimeMetrics;
  timelineData: TimelineDataPoint[];
}

// New types for chart data
export interface ChartDataPoint {
  time: string;
  incidents: number;
  responseTime: number;
  severity: number;
  resolved: number;
}

export interface LiveChartData {
  currentMetrics: {
    incidentRate: number;
    responseTime: number;
    resolutionRate: {
      value: number;
      change: number;
    };
  };
  timelineData: ChartDataPoint[];
}

export interface TrackIncident {
  id: string;
  location: string;
  severity: "low" | "medium" | "high" | "critical";
  type: string;
  timestamp: Date;
  x: number;
  y: number;
}

export interface TrackMapResponse {
  incidents: TrackIncident[];
  selectedIncident: TrackIncident | null;
  trackInfo: {
    name: string;
    locations: Array<{
      name: string;
      x: number;
      y: number;
    }>;
  };
}
