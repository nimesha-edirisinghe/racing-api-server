import { Router } from "express";
import {
  getStats,
  getRecentIncidentsList,
  getSeverityChartData,
  getTrendChartData,
  getHourlyChartData,
  getCircuitChartData,
  getAllDashboard,
} from "./dashboard.controller";

const router = Router();

// Individual endpoint routes
router.get("/stats", getStats);
router.get("/recent-incidents", getRecentIncidentsList);
router.get("/severity-data", getSeverityChartData);
router.get("/trend-data", getTrendChartData);
router.get("/hourly-data", getHourlyChartData);
router.get("/circuit-data", getCircuitChartData);

// Combined endpoint for all dashboard data
router.get("/", getAllDashboard);

export default router;
