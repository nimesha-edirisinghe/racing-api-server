import { Request, Response } from "express";
import {
  getDashboardStats,
  getRecentIncidents,
  getSeverityData,
  generateTrendData,
  generateHourlyData,
  generateCircuitData,
  getAllDashboardData,
} from "./dashboard.service";

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecentIncidentsList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const recentIncidents = await getRecentIncidents();
    res.json(recentIncidents);
  } catch (error) {
    console.error("Error fetching recent incidents:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSeverityChartData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const severityData = await getSeverityData();
    res.json(severityData);
  } catch (error) {
    console.error("Error fetching severity data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTrendChartData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const trendData = generateTrendData();
    res.json(trendData);
  } catch (error) {
    console.error("Error generating trend data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getHourlyChartData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hourlyData = generateHourlyData();
    res.json(hourlyData);
  } catch (error) {
    console.error("Error generating hourly data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCircuitChartData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const circuitData = generateCircuitData();
    res.json(circuitData);
  } catch (error) {
    console.error("Error generating circuit data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dashboardData = await getAllDashboardData();
    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching all dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
