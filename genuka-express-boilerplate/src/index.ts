import authRoutes from "@/routes/auth.routes.js";
import cookieParser from "cookie-parser";
import express from "express";
import { env, validateEnv } from "./config/env.js";

// Validate environment variables
validateEnv();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  });
});

// API routes
app.use("/api/auth", authRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Genuka Express Boilerplate",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      callback: "/api/auth/callback",
      webhook: "/api/auth/webhook",
      me: "/api/auth/me",
      logout: "/api/auth/logout",
      check: "/api/auth/check",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.path,
  });
});

// Error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: env.nodeEnv === "development" ? err.message : undefined,
    });
  },
);

// Start server
app.listen(env.port, () => {
  console.log(`
  🚀 Genuka Express Boilerplate

  Server running on: http://localhost:${env.port}
  Environment: ${env.nodeEnv}

  Endpoints:
  - Health:   GET  http://localhost:${env.port}/health
  - Callback: GET  http://localhost:${env.port}/api/auth/callback
  - Webhook:  POST http://localhost:${env.port}/api/auth/webhook
  - Me:       GET  http://localhost:${env.port}/api/auth/me
  - Logout:   POST http://localhost:${env.port}/api/auth/logout
  - Check:    GET  http://localhost:${env.port}/api/auth/check
  `);
});

export default app;
