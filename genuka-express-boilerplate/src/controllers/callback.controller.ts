import type { Request, Response } from "express";
import { HTTP_STATUS } from "../config/constants.js";
import { oauthService } from "../services/auth/oauth.service.js";
import { sessionService } from "../services/auth/session.service.js";

export class CallbackController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { code, company_id, timestamp, hmac, redirect_to } = req.query;

      const isValid = oauthService.validateCallbackParams({
        code: code as string | undefined,
        companyId: company_id as string | undefined,
        timestamp: timestamp as string | undefined,
        hmac: hmac as string | undefined,
      });

      if (!isValid) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: "Missing required parameters",
          required: ["code", "company_id", "timestamp", "hmac"],
        });
        return;
      }

      const result = await oauthService.handleCallback({
        code: code as string,
        companyId: company_id as string,
        timestamp: timestamp as string,
        hmac: hmac as string,
        redirectTo: redirect_to as string,
      });

      // Create session for the authenticated company
      const tokenResponse = await sessionService.createSession(
        result.companyId,
        res,
      );

      console.log("token response", tokenResponse);
      const redirectUrl = decodeURIComponent(redirect_to as string);

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("OAuth callback error:", error);

      const message =
        error instanceof Error ? error.message : "Internal server error";

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: message,
      });
    }
  }
}

export const callbackController = new CallbackController();
