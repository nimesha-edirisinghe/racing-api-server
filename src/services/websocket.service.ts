import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { RacingIncident } from "../modules/incident/incident.types";

let io: SocketServer;

export const initializeWebSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: "*", // In production, replace with your frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const emitIncidentCreated = (incident: RacingIncident) => {
  if (io) {
    io.emit("incidentCreated", incident);
  }
};

export const emitIncidentUpdated = (incident: RacingIncident) => {
  if (io) {
    io.emit("incidentUpdated", incident);
  }
};

export const emitIncidentDeleted = (incidentId: string) => {
  if (io) {
    io.emit("incidentDeleted", incidentId);
  }
};

export const getSocketServer = () => io;
