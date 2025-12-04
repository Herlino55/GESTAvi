import { HTTP_STATUS } from "@/config/constants.js";
import { sessionService } from "@/services/auth/session.service.js";
import { companyDBService } from "@/services/database/company.service.js";
import { genukaApiService } from "@/services/genuka/api.service.js";
import type { Request, Response } from "express";

export class AuthController {
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  async me(req: Request, res: Response): Promise<void> {
    try {
      const company = await sessionService.getAuthenticatedCompany(req);

      if (!company) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: "Unauthorized",
          message: "Not authenticated",
        });
        return;
      }

      // Return company info without sensitive data
      res.json({
        id: company.id,
        handle: company.handle,
        name: company.name,
        description: company.description,
        logoUrl: company.logoUrl,
        phone: company.phone,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      });
    } catch (error) {
      console.error("Auth me error:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: "Failed to get user info",
      });
    }
  }

  /**
   *
   * @param req
   * @param res
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      sessionService.destroySession(res);

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: "Failed to logout",
      });
    }
  }

  /**
   * Check if the current session is valid
   *
   * @param req
   * @param res
   */
  async check(req: Request, res: Response): Promise<void> {
    try {
      const isAuthenticated = await sessionService.isAuthenticated(req);

      res.json({
        authenticated: isAuthenticated,
      });
    } catch (error) {
      console.error("Auth check error:", error);
      res.json({
        authenticated: false,
      });
    }
  }

  /**
   * Securely refresh session using the refresh_session cookie (double cookie pattern)
   *
   * @param req
   * @param res
   * @returns
   */
  async refresh(req: Request, res: Response): Promise<void> {
    try {
      // Verify the refresh token from HTTP-only cookie
      const companyId = await sessionService.verifyRefreshToken(req);

      if (!companyId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: "Unauthorized",
          message:
            "Invalid or expired refresh token. Please reinstall the app.",
        });
        return;
      }

      // Check if company exists in database with a Genuka refresh token
      const company = await companyDBService.findByCompanyId(companyId);

      if (!company || !company.refreshToken) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: "Unauthorized",
          message:
            "Company not found or no refresh token available. Please reinstall the app.",
        });
        return;
      }

      // Use Genuka refresh_token to get new tokens from Genuka API
      const tokenResponse = await genukaApiService.refreshAccessToken(
        company.refreshToken,
      );

      // Calculate new expiration date
      const tokenExpiresAt = new Date(
        Date.now() + tokenResponse.expires_in_minutes * 60 * 1000,
      );

      // Update Genuka tokens in database
      await companyDBService.updateById(companyId, {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        tokenExpiresAt: tokenExpiresAt,
      });

      // Create new session + refresh cookies
      await sessionService.createSession(companyId, res);

      res.json({
        success: true,
        message: "Session refreshed successfully",
        company: {
          id: company.id,
          handle: company.handle,
          name: company.name,
        },
      });
    } catch (error) {
      console.error("Session refresh error:", error);

      // If refresh token is invalid/revoked, user needs to reinstall
      const message =
        error instanceof Error ? error.message : "Failed to refresh session";
      const isTokenError =
        message.includes("revoked") || message.includes("invalid");

      res
        .status(
          isTokenError
            ? HTTP_STATUS.UNAUTHORIZED
            : HTTP_STATUS.INTERNAL_SERVER_ERROR,
        )
        .json({
          error: isTokenError ? "Unauthorized" : "Server Error",
          message: isTokenError
            ? "Refresh token is invalid or revoked. Please reinstall the app."
            : "Failed to refresh session",
        });
    }
  }
}

export const authController = new AuthController();
