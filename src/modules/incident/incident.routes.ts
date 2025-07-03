import { Router } from "express";
import {
  getIncidents,
  postIncident,
  getIncident,
  deleteIncident,
  updateIncident,
} from "./incident.controller";

const router = Router();

// GET /api/incidents - Get all incidents
router.get("/", getIncidents);

// POST /api/incidents - Create a new incident
router.post("/", postIncident);

// GET /api/incidents/:id - Get a specific incident by ID
router.get("/:id", getIncident);

// PUT /api/incidents/:id - Update a specific incident by ID
router.put("/:id", updateIncident);

// DELETE /api/incidents/:id - Delete a specific incident by ID
router.delete("/:id", deleteIncident);

export default router;
