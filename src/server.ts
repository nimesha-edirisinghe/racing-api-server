import express, { Request, Response } from "express";
import cors from "cors";

// Import module routes
import authRoutes from "./modules/auth/auth.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import incidentRoutes from "./modules/incident/incident.routes";

const app = express();
const PORT: number = parseInt(process.env.PORT || "4000", 10);

// Middleware
app.use(cors());
app.use(express.json());

// Health check routes
app.get("/", (req: Request, res: Response): void => {
  res.send("Hello from Node.js TypeScript server!");
});

app.get("/api/status", (req: Request, res: Response): void => {
  res.json({
    status: "Server is running",
    time: new Date().toISOString(),
    typescript: true,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/incidents", incidentRoutes);

// TODO: Add more module routes when they are created
// app.use("/api/live", liveRoutes);

app.listen(PORT, (): void => {
  console.log(`✅ Server is listening on http://localhost:${PORT}`);
});
