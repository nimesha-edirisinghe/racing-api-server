import { Request, Response } from "express";
import { liveService } from "./live.service";
import { RemoveAlertParams } from "./live.types";

export const getAlerts = async (_req: Request, res: Response): Promise<void> => {
  try {
    liveService.generateRandomAlert();
    const alerts = liveService.getAlerts();
    res.status(200).json(alerts);
  } catch (error) {
    console.error("Error getting alerts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeAlert = async (
  req: Request<RemoveAlertParams>,
  res: Response
): Promise<void> => {
  try {
    const { alertId } = req.params;
    if (!alertId) {
      res.status(400).json({ message: "Alert ID is required" });
      return;
    }
    liveService.removeAlert(alertId);
    res.status(200).json({ message: "Alert removed successfully" });
  } catch (error) {
    console.error("Error removing alert:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRaceDetails = async (_req: Request, res: Response): Promise<void> => {
  try {
    liveService.updateRaceTime();
    const details = liveService.getRaceDetails();
    res.status(200).json(details);
  } catch (error) {
    console.error("Error getting race details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLiveData = async (_req: Request, res: Response): Promise<void> => {
  try {
    const liveData = liveService.getLiveData();
    res.status(200).json(liveData);
  } catch (error) {
    console.error("Error getting live data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// New controller method for chart data
export const getLiveChartData = async (_req: Request, res: Response): Promise<void> => {
  try {
    const chartData = liveService.getLiveChartData();
    res.status(200).json(chartData);
  } catch (error) {
    console.error("Error getting chart data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTrackMapData = async (req: Request, res: Response): Promise<void> => {
  try {
    const selectedId = req.query.selectedId as string | undefined;
    const mapData = liveService.getTrackMapData(selectedId);
    res.status(200).json(mapData);
  } catch (error) {
    console.error("Error getting track map data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
