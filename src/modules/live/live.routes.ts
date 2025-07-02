import { Router } from "express";
import {
  getAlerts,
  removeAlert,
  getRaceDetails,
  getLiveData,
  getLiveChartData,
  getTrackMapData,
} from "./live.controller";

const router = Router();

router.get("/alerts", getAlerts);
router.delete("/alerts/:alertId", removeAlert);
router.get("/race-details", getRaceDetails);
router.get("/data", getLiveData);
router.get("/chart-data", getLiveChartData);
router.get("/track-map", getTrackMapData);

export default router;
