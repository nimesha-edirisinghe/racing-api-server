import fs from "fs/promises";
import path from "path";
import { RacingIncident, IncidentFormData } from "./incident.types";

const INCIDENTS_PATH = path.resolve(__dirname, "../../storage/mockIncidents.json");

// Helper function to process array or string inputs
const processArrayOrString = (value: any): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => item?.toString().trim())
      .filter((item) => item !== "" && item !== undefined);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  }
  return [];
};

// Helper function to validate and cast incident type
const validateIncidentType = (type: string): RacingIncident["type"] => {
  const validTypes: RacingIncident["type"][] = [
    "collision",
    "penalty",
    "mechanical",
    "track_obstruction",
    "rule_violation",
    "dnf",
    "unsafe_pit",
  ];
  if (!validTypes.includes(type as RacingIncident["type"])) {
    throw new Error(`Invalid incident type: ${type}`);
  }
  return type as RacingIncident["type"];
};

// Helper function to validate and cast race category
const validateRaceCategory = (category: string): RacingIncident["raceCategory"] => {
  const validCategories: RacingIncident["raceCategory"][] = [
    "F1",
    "MotoGP",
    "Rally",
    "IndyCar",
    "NASCAR",
  ];
  if (!validCategories.includes(category as RacingIncident["raceCategory"])) {
    throw new Error(`Invalid race category: ${category}`);
  }
  return category as RacingIncident["raceCategory"];
};

// Helper function to validate and cast severity
const validateSeverity = (severity: string): RacingIncident["severity"] => {
  const validSeverities: RacingIncident["severity"][] = ["low", "medium", "high", "critical"];
  if (!validSeverities.includes(severity as RacingIncident["severity"])) {
    throw new Error(`Invalid severity level: ${severity}`);
  }
  return severity as RacingIncident["severity"];
};

// Helper function to validate and cast status
const validateStatus = (status: string): RacingIncident["status"] => {
  const validStatuses: RacingIncident["status"][] = ["pending", "investigating", "resolved"];
  if (!validStatuses.includes(status as RacingIncident["status"])) {
    throw new Error(`Invalid status: ${status}`);
  }
  return status as RacingIncident["status"];
};

// Helper function to safely read incidents file
async function readIncidentsFile(): Promise<RacingIncident[]> {
  try {
    const file = await fs.readFile(INCIDENTS_PATH, "utf-8");
    const incidents = JSON.parse(file);
    if (!Array.isArray(incidents)) {
      throw new Error("Invalid incidents data format");
    }
    return incidents;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // File doesn't exist, return empty array
      return [];
    }
    throw error;
  }
}

// Helper function to safely write incidents file
async function writeIncidentsFile(incidents: RacingIncident[]): Promise<void> {
  try {
    await fs.writeFile(INCIDENTS_PATH, JSON.stringify(incidents, null, 2), "utf-8");
  } catch (error) {
    throw new Error(`Failed to write incidents file: ${(error as Error).message}`);
  }
}

export async function getAllIncidents(): Promise<RacingIncident[]> {
  try {
    return await readIncidentsFile();
  } catch (error) {
    console.error("Error reading incidents:", error);
    throw new Error(`Failed to get incidents: ${(error as Error).message}`);
  }
}

export async function createIncident(formData: IncidentFormData): Promise<RacingIncident> {
  try {
    const incidents = await readIncidentsFile();

    const newIncident: RacingIncident = {
      id: `incident-${Date.now()}`,
      type: validateIncidentType(formData.type),
      raceCategory: validateRaceCategory(formData.raceCategory),
      location: formData.location,
      circuit: formData.circuit || formData.location,
      severity: validateSeverity(formData.severity),
      drivers: processArrayOrString(formData.drivers),
      teams: processArrayOrString(formData.teams),
      lapNumber:
        typeof formData.lapNumber === "number"
          ? formData.lapNumber
          : parseInt(String(formData.lapNumber)) || 0,
      raceTime: formData.raceTime || "00:00:00",
      description: formData.description,
      timestamp: new Date().toISOString(),
      status: validateStatus(formData.status),
      stewardNotes: formData.stewardNotes,
    };

    incidents.unshift(newIncident);
    await writeIncidentsFile(incidents);

    return newIncident;
  } catch (error) {
    console.error("Error creating incident:", error);
    throw new Error(`Failed to create incident: ${(error as Error).message}`);
  }
}

export async function getIncidentById(id: string): Promise<RacingIncident | null> {
  try {
    if (!id) {
      throw new Error("Incident ID is required");
    }
    const incidents = await readIncidentsFile();
    return incidents.find((incident) => incident.id === id) || null;
  } catch (error) {
    console.error("Error getting incident by ID:", error);
    throw new Error(`Failed to get incident: ${(error as Error).message}`);
  }
}

export async function deleteIncidentById(id: string): Promise<boolean> {
  try {
    if (!id) {
      throw new Error("Incident ID is required");
    }
    const incidents = await readIncidentsFile();
    const initialLength = incidents.length;
    const filteredIncidents = incidents.filter((incident) => incident.id !== id);

    if (filteredIncidents.length === initialLength) {
      return false; // No incident was found to delete
    }

    await writeIncidentsFile(filteredIncidents);
    return true;
  } catch (error) {
    console.error("Error deleting incident:", error);
    throw new Error(`Failed to delete incident: ${(error as Error).message}`);
  }
}

export async function updateIncidentById(
  id: string,
  formData: IncidentFormData
): Promise<RacingIncident | null> {
  try {
    if (!id) {
      throw new Error("Incident ID is required");
    }
    const incidents = await readIncidentsFile();
    const incidentIndex = incidents.findIndex((incident) => incident.id === id);

    if (incidentIndex === -1) {
      return null;
    }

    const updatedIncident: RacingIncident = {
      ...incidents[incidentIndex],
      type: validateIncidentType(formData.type),
      raceCategory: validateRaceCategory(formData.raceCategory),
      location: formData.location,
      circuit: formData.circuit || formData.location,
      severity: validateSeverity(formData.severity),
      drivers: processArrayOrString(formData.drivers),
      teams: processArrayOrString(formData.teams),
      lapNumber:
        typeof formData.lapNumber === "number"
          ? formData.lapNumber
          : parseInt(String(formData.lapNumber)) || 0,
      raceTime: formData.raceTime || "00:00:00",
      description: formData.description,
      status: validateStatus(formData.status),
      stewardNotes: formData.stewardNotes,
    };

    incidents[incidentIndex] = updatedIncident;
    await writeIncidentsFile(incidents);

    return updatedIncident;
  } catch (error) {
    console.error("Error updating incident:", error);
    throw new Error(`Failed to update incident: ${(error as Error).message}`);
  }
}
