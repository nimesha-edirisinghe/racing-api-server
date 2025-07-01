import fs from "fs/promises";
import path from "path";

const INCIDENTS_PATH = path.resolve(
  __dirname,
  "../../storage/mockIncidents.json"
);

interface Incident {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "investigating" | "resolved" | "pending";
  location: string;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}

// Constants for consistent colors
const SEVERITY_COLORS = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
};

export async function getIncidents(): Promise<Incident[]> {
  const file = await fs.readFile(INCIDENTS_PATH, "utf-8");
  return JSON.parse(file);
}

export async function getDashboardStats() {
  const incidents = await getIncidents();

  const totalIncidents = incidents.length;
  const investigating = incidents.filter(
    (i) => i.status === "investigating"
  ).length;
  const resolved = incidents.filter((i) => i.status === "resolved").length;
  const pending = incidents.filter((i) => i.status === "pending").length;

  return {
    totalIncidents,
    investigating,
    resolved,
    pending,
  };
}

export async function getRecentIncidents() {
  const incidents = await getIncidents();
  // Sort by createdAt descending and take first 5
  return incidents
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);
}

export async function getSeverityData() {
  const incidents = await getIncidents();

  const severityCounts = incidents.reduce((acc, incident) => {
    acc[incident.severity] = (acc[incident.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(severityCounts).map(([name, value]) => ({
    name,
    value,
    fill: SEVERITY_COLORS[name as keyof typeof SEVERITY_COLORS] || "#64748b",
  }));
}

export const generateTrendData = () => {
  const data = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      fullDate: date.toISOString().split("T")[0],
      incidents: Math.floor(Math.random() * 12) + 3,
      resolved: Math.floor(Math.random() * 8) + 2,
      critical: Math.floor(Math.random() * 3) + 1,
      pending: Math.floor(Math.random() * 4) + 1,
      responseTime: Math.floor(Math.random() * 10) + 2,
    });
  }

  return data;
};

export const generateHourlyData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    incidents: Math.floor(Math.random() * 10) + 1,
    severity: Math.floor(Math.random() * 4) + 1,
  }));
};

export const generateCircuitData = () => {
  return [
    {
      circuit: "Monaco",
      incidents: 8,
      resolved: 6,
      avgResponseTime: 4.5,
      riskScore: 85,
    },
    {
      circuit: "Silverstone",
      incidents: 6,
      resolved: 5,
      avgResponseTime: 3.2,
      riskScore: 65,
    },
    {
      circuit: "Spa",
      incidents: 7,
      resolved: 4,
      avgResponseTime: 5.1,
      riskScore: 78,
    },
    {
      circuit: "Monza",
      incidents: 5,
      resolved: 5,
      avgResponseTime: 2.8,
      riskScore: 45,
    },
    {
      circuit: "Suzuka",
      incidents: 4,
      resolved: 3,
      avgResponseTime: 3.7,
      riskScore: 55,
    },
    {
      circuit: "COTA",
      incidents: 6,
      resolved: 4,
      avgResponseTime: 3.9,
      riskScore: 62,
    },
  ];
};

export async function getAllDashboardData() {
  const stats = await getDashboardStats();
  const recentIncidents = await getRecentIncidents();
  const severityData = await getSeverityData();
  const trendData = generateTrendData();
  const hourlyData = generateHourlyData();
  const circuitData = generateCircuitData();

  return {
    stats,
    recentIncidents,
    severityData,
    trendData,
    hourlyData,
    circuitData,
  };
}
