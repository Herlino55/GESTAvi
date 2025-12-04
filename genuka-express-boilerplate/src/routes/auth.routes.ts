import { Router } from "express";
import { callbackController } from "@/controllers/callback.controller.js";
import { webhookController } from "@/controllers/webhook.controller.js";
import { authController } from "@/controllers/auth.controller.js";
import { authMiddleware } from "@/middleware/auth.middleware.js";

const router = Router();

// OAuth callback - public
router.get("/callback", (req, res) => callbackController.handle(req, res));

// Webhook handler - public (uses HMAC validation)
router.post("/webhook", (req, res) => webhookController.handle(req, res));

// Auth check - public
router.get("/check", (req, res) => authController.check(req, res));

// Refresh session - public (uses companyId from body)
router.post("/refresh", (req, res) => authController.refresh(req, res));

// Get current user - protected
router.get("/me", authMiddleware, (req, res) => authController.me(req, res));

// Logout - protected
router.post("/logout", authMiddleware, (req, res) => authController.logout(req, res));

export default router;