import {
  LiveAlert,
  RaceDetails,
  RealTimeMetrics,
  TimelineDataPoint,
  LiveData,
  LiveChartData,
  TrackIncident,
  TrackMapResponse,
} from "./live.types";

// In-memory storage for alerts (in a real app, this would be a database)
let alerts: LiveAlert[] = [];

// In-memory storage for race details
let raceDetails: RaceDetails = {
  raceTime: "01:23:45",
  currentLap: 67,
};

// In-memory storage for timeline data
let timelineData: TimelineDataPoint[] = [];

// In-memory storage for metrics
let metrics: RealTimeMetrics = {
  incidentRate: 0,
  responseTime: 0,
  resolutionRate: {
    value: 87,
    change: 5,
  },
};

// In-memory storage for chart data
let chartData: TimelineDataPoint[] = [];

// Track configuration
const TRACK_LOCATIONS = [
  { name: "Turn 1", x: 15, y: 20 },
  { name: "Turn 3", x: 45, y: 35 },
  { name: "Pit Lane", x: 80, y: 70 },
  { name: "Sector 2", x: 60, y: 50 },
  { name: "Chicane", x: 30, y: 80 },
];

const INCIDENT_TYPES = ["Collision", "Debris", "Mechanical", "Flag", "Safety"];
const SEVERITY_LEVELS: Array<"low" | "medium" | "high" | "critical"> = [
  "low",
  "medium",
  "high",
  "critical",
];

// In-memory storage for track incidents
let trackIncidents: TrackIncident[] = [];
let lastSelectedIncidentId: string | null = null;

const alertMessages = [
  {
    type: "critical" as const,
    message: "Multi-car collision at Turn 3",
    location: "Monaco GP - Turn 3",
  },
  {
    type: "warning" as const,
    message: "Yellow flag deployed in Sector 2",
    location: "Monaco GP - Sector 2",
  },
  {
    type: "info" as const,
    message: "Safety car deployed",
    location: "Monaco GP - Track",
  },
  {
    type: "critical" as const,
    message: "Red flag - Session stopped",
    location: "Monaco GP - Control",
  },
  {
    type: "warning" as const,
    message: "Debris reported on track",
    location: "Monaco GP - Turn 1",
  },
];

// Initialize with a random alert
alerts = [
  {
    id: Date.now().toString(),
    ...alertMessages[Math.floor(Math.random() * alertMessages.length)],
    timestamp: new Date(),
  },
];

// Initialize timeline data
const generateTimelinePoint = (time: Date): TimelineDataPoint => ({
  time: time.toLocaleTimeString(),
  incidents: Math.floor(Math.random() * 8) + 1,
  responseTime: Math.floor(Math.random() * 10) + 2,
  severity: Math.floor(Math.random() * 4) + 1,
  resolved: Math.floor(Math.random() * 6) + 1,
});

// Initialize with 20 data points
const now = new Date();
for (let i = 19; i >= 0; i--) {
  const time = new Date(now.getTime() - i * 3000);
  timelineData.push(generateTimelinePoint(time));
  chartData.push(generateTimelinePoint(time));
}

export const liveService = {
  getAlerts: (): LiveAlert[] => {
    return alerts;
  },

  removeAlert: (alertId: string): void => {
    alerts = alerts.filter((alert) => alert.id !== alertId);
  },

  // Helper function to simulate new alerts (called internally)
  generateRandomAlert: (): void => {
    if (Math.random() > 0.6) {
      // 30% chance of new alert
      const randomAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
      const newAlert: LiveAlert = {
        id: Date.now().toString(),
        ...randomAlert,
        timestamp: new Date(),
      };

      alerts = [newAlert, ...alerts.slice(0, 4)]; // Keep only last 5 alerts
    }
  },

  getRaceDetails: (): RaceDetails => {
    return raceDetails;
  },

  updateRaceTime: (): void => {
    const [hours, minutes, seconds] = raceDetails.raceTime.split(":").map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds + 1;
    const newHours = Math.floor(totalSeconds / 3600);
    const newMinutes = Math.floor((totalSeconds % 3600) / 60);
    const newSeconds = totalSeconds % 60;

    raceDetails.raceTime = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")}`;
  },

  getLiveData: (): LiveData => {
    const newPoint = generateTimelinePoint(new Date());
    timelineData = [...timelineData.slice(-19), newPoint];

    metrics = {
      incidentRate: newPoint.incidents,
      responseTime: newPoint.responseTime,
      resolutionRate: {
        value: 87,
        change: 5,
      },
    };

    return {
      metrics,
      timelineData,
    };
  },

  // New method for chart data
  getLiveChartData: (): LiveChartData => {
    const newPoint = generateTimelinePoint(new Date());
    chartData = [...chartData.slice(-19), newPoint];

    const currentMetrics = {
      incidentRate: newPoint.incidents,
      responseTime: newPoint.responseTime,
      resolutionRate: {
        value: 87,
        change: 5,
      },
    };

    return {
      currentMetrics,
      timelineData: chartData,
    };
  },

  getTrackMapData: (selectedId?: string): TrackMapResponse => {
    // Generate new incident with 40% probability
    if (Math.random() > 0.6) {
      const location = TRACK_LOCATIONS[Math.floor(Math.random() * TRACK_LOCATIONS.length)];
      const newIncident: TrackIncident = {
        id: Date.now().toString(),
        location: location.name,
        severity: SEVERITY_LEVELS[Math.floor(Math.random() * SEVERITY_LEVELS.length)],
        type: INCIDENT_TYPES[Math.floor(Math.random() * INCIDENT_TYPES.length)],
        timestamp: new Date(),
        x: location.x + (Math.random() - 0.5) * 10, // Add some randomness
        y: location.y + (Math.random() - 0.5) * 10,
      };

      trackIncidents = [newIncident, ...trackIncidents.slice(0, 9)]; // Keep only 10 most recent

      // If this is the first incident or no incident is selected, select the new one
      if (!lastSelectedIncidentId) {
        lastSelectedIncidentId = newIncident.id;
      }
    }

    // Update selected incident ID if provided
    if (selectedId) {
      lastSelectedIncidentId = selectedId;
    }

    return {
      incidents: trackIncidents,
      selectedIncident: lastSelectedIncidentId
        ? trackIncidents.find((inc) => inc.id === lastSelectedIncidentId) || null
        : null,
      trackInfo: {
        name: "Monaco GP",
        locations: TRACK_LOCATIONS,
      },
    };
  },
};
