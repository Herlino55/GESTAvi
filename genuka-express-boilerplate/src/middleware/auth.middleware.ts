import type { Request, Response, NextFunction } from "express";
import { sessionService } from "@/services/auth/session.service.js";
import { HTTP_STATUS } from "@/config/constants.js";

/**
 * Authentication Middleware
 * Protects routes by verifying the session JWT
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = sessionService.getSessionToken(req);

    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "No session token provided",
      });
      return;
    }

    const payload = await sessionService.verifyJwt(token);

    if (!payload) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "Invalid or expired session",
      });
      return;
    }

    // Attach company ID to request for later use
    req.companyId = payload.companyId;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: "Authentication error",
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches company info if authenticated, but doesn't block if not
 */
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = sessionService.getSessionToken(req);

    if (token) {
      const payload = await sessionService.verifyJwt(token);
      if (payload) {
        req.companyId = payload.companyId;
      }
    }

    next();
  } catch (error) {
    // Silent fail for optional auth
    next();
  }
};
