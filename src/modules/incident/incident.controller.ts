import { Request, Response } from "express";
import { getAllIncidents, createIncident, getIncidentById } from "./incident.service";
import { IncidentFormData } from "./incident.types";

export const getIncidents = async (req: Request, res: Response): Promise<void> => {
  try {
    const incidents = await getAllIncidents();
    res.json(incidents);
  } catch (error) {
    console.error("Error fetching incidents:", error);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
};

export const postIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    // Add a small delay to simulate API behavior like in the mock
    await new Promise((resolve) => setTimeout(resolve, 500));

    const formData = req.body as IncidentFormData;

    // Basic validation
    if (!formData.type || !formData.raceCategory || !formData.location || !formData.description) {
      res.status(400).json({
        error: "Missing required fields: type, raceCategory, location, description",
      });
      return;
    }

    const newIncident = await createIncident(formData);
    res.status(201).json(newIncident);
  } catch (error) {
    console.error("Error creating incident:", error);
    res.status(400).json({ error: `Failed to create incident: ${error}` });
  }
};

export const getIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const incident = await getIncidentById(id);

    if (!incident) {
      res.status(404).json({ error: "Incident not found" });
      return;
    }

    res.json(incident);
  } catch (error) {
    console.error("Error fetching incident:", error);
    res.status(500).json({ error: "Failed to fetch incident" });
  }
};
