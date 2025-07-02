import fs from "fs/promises";
import path from "path";
import { RacingIncident, IncidentFormData } from "./incident.types";

const INCIDENTS_PATH = path.resolve(__dirname, "../../storage/mockIncidents.json");

export async function getAllIncidents(): Promise<RacingIncident[]> {
  try {
    const file = await fs.readFile(INCIDENTS_PATH, "utf-8");
    const incidents = JSON.parse(file);
    return incidents;
  } catch (error) {
    console.error("Error reading incidents:", error);
    return [];
  }
}

export async function createIncident(formData: IncidentFormData): Promise<RacingIncident> {
  try {
    const incidents = await getAllIncidents();

    const newIncident: RacingIncident = {
      id: `incident-${Date.now()}`,
      type: formData.type as RacingIncident["type"],
      raceCategory: formData.raceCategory as RacingIncident["raceCategory"],
      location: formData.location,
      circuit: formData.circuit || formData.location,
      severity: formData.severity as RacingIncident["severity"],
      drivers: formData.drivers ? formData.drivers.split(",").map((d) => d.trim()) : [],
      teams: formData.teams ? formData.teams.split(",").map((t) => t.trim()) : [],
      lapNumber: parseInt(formData.lapNumber) || 0,
      raceTime: formData.raceTime || "00:00:00",
      description: formData.description,
      timestamp: new Date().toISOString(),
      status: formData.status as RacingIncident["status"],
      stewardNotes: formData.stewardNotes,
    };

    incidents.unshift(newIncident);

    // Save back to file
    await fs.writeFile(INCIDENTS_PATH, JSON.stringify(incidents, null, 2), "utf-8");

    return newIncident;
  } catch (error) {
    console.error("Error creating incident:", error);
    throw new Error("Failed to create incident");
  }
}

export async function getIncidentById(id: string): Promise<RacingIncident | null> {
  try {
    const incidents = await getAllIncidents();
    return incidents.find((incident) => incident.id === id) || null;
  } catch (error) {
    console.error("Error getting incident by ID:", error);
    return null;
  }
}

export async function deleteIncidentById(id: string): Promise<boolean> {
  try {
    const incidents = await getAllIncidents();
    const initialLength = incidents.length;

    const filteredIncidents = incidents.filter((incident) => incident.id !== id);

    if (filteredIncidents.length === initialLength) {
      return false; // No incident was found to delete
    }

    // Save back to file
    await fs.writeFile(INCIDENTS_PATH, JSON.stringify(filteredIncidents, null, 2), "utf-8");

    return true;
  } catch (error) {
    console.error("Error deleting incident:", error);
    throw new Error("Failed to delete incident");
  }
}
