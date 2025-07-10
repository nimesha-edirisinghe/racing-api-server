import { Request, Response } from "express";
import {
  getAllIncidents,
  getIncidentsWithFilters,
  createIncident,
  getIncidentById,
  deleteIncidentById,
  updateIncidentById,
} from "./incident.service";
import { IncidentFormData, IncidentSearchParams } from "./incident.types";

export const getIncidents = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if any query parameters are provided
    const queryParams = req.query;
    const hasFilters = Object.keys(queryParams).length > 0;

    if (hasFilters) {
      // Parse query parameters for search and filtering
      const searchParams: IncidentSearchParams = {
        search: queryParams.search as string,
        category: queryParams.category as string,
        severity: queryParams.severity as string,
        status: queryParams.status as string,
        type: queryParams.type as string,
        location: queryParams.location as string,
        page: queryParams.page ? parseInt(queryParams.page as string, 10) : 1,
        limit: queryParams.limit ? parseInt(queryParams.limit as string, 10) : 10,
      };

      // Get filtered and paginated incidents
      const response = await getIncidentsWithFilters(searchParams);
      res.json(response);
    } else {
      // Backward compatibility: return all incidents without pagination
      const incidents = await getAllIncidents();
      res.json(incidents);
    }
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

export const deleteIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Incident ID is required" });
      return;
    }

    const success = await deleteIncidentById(id);

    if (!success) {
      res.status(404).json({ error: "Incident not found" });
      return;
    }

    res.status(200).json({ message: "Incident deleted successfully" });
  } catch (error) {
    console.error("Error deleting incident:", error);
    res.status(500).json({ error: "Failed to delete incident" });
  }
};

export const updateIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const formData = req.body as IncidentFormData;

    // Basic validation
    if (!formData.type || !formData.raceCategory || !formData.location || !formData.description) {
      res.status(400).json({
        error: "Missing required fields: type, raceCategory, location, description",
      });
      return;
    }

    const updatedIncident = await updateIncidentById(id, formData);

    if (!updatedIncident) {
      res.status(404).json({ error: "Incident not found" });
      return;
    }

    res.json(updatedIncident);
  } catch (error) {
    console.error("Error updating incident:", error);
    res.status(500).json({ error: "Failed to update incident" });
  }
};
