import { env } from "@/config/env.js";
import { companyDBService } from "@/services/database/company.service.js";
import type { Request, Response } from "express";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

// Cookie names
const SESSION_COOKIE_NAME = "session";
const REFRESH_COOKIE_NAME = "refresh_session";

// Cookie durations
const SESSION_MAX_AGE = 60 * 60 * 7; // 7 hours in seconds
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

interface SessionPayload extends JWTPayload {
  companyId: string;
  type: "session" | "refresh";
}

/**
 * Session Service
 * Handles JWT session management with double cookie system for security
 *
 * Two cookies are used:
 * - "session" (7h): For accessing protected routes
 * - "refresh_session" (30d): For refreshing expired sessions securely
 */
export class SessionService {
  private getSecret() {
    return new TextEncoder().encode(env.genuka.clientSecret);
  }

  /**
   * Create both session and refresh cookies for a company
   */
  async createSession(companyId: string, res: Response): Promise<string> {
    const secret = this.getSecret();
    const isProd = env.nodeEnv === "production";

    // Create session token (short-lived: 7h)
    const sessionToken = await new SignJWT({ companyId, type: "session" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7h")
      .sign(secret);

    // Create refresh token (long-lived: 30 days)
    const refreshToken = await new SignJWT({ companyId, type: "refresh" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret);

    // Set session cookie (7h)
    res.cookie(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE * 1000,
      path: "/",
    });

    // Set refresh cookie (30 days)
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: REFRESH_MAX_AGE * 1000,
      path: "/",
    });

    return sessionToken;
  }

  /**
   * Verify a JWT token and return the payload
   */
  async verifyJwt(token: string): Promise<SessionPayload | null> {
    try {
      const secret = this.getSecret();
      const { payload } = await jwtVerify(token, secret);
      return payload as SessionPayload;
    } catch (error) {
      // Don't log expected expiration errors
      const isExpiredError =
        error instanceof Error && error.message.includes("expired");
      if (!isExpiredError) {
        console.error("JWT verification failed:", error);
      }
      return null;
    }
  }

  /**
   * Get the session token from request cookies
   */
  getSessionToken(req: Request): string | null {
    return req.cookies?.[SESSION_COOKIE_NAME] || null;
  }

  /**
   * Get the refresh token from request cookies
   */
  getRefreshToken(req: Request): string | null {
    return req.cookies?.[REFRESH_COOKIE_NAME] || null;
  }

  /**
   * Verify refresh token and return companyId
   * This is used for secure session refresh
   */
  async verifyRefreshToken(req: Request): Promise<string | null> {
    const token = this.getRefreshToken(req);

    if (!token) {
      return null;
    }

    const payload = await this.verifyJwt(token);

    // Ensure it's a refresh token, not a session token
    if (!payload || payload.type !== "refresh") {
      return null;
    }

    return payload.companyId;
  }

  /**
   * Get the authenticated company from the session
   */
  async getAuthenticatedCompany(req: Request) {
    const token = this.getSessionToken(req);

    if (!token) {
      return null;
    }

    const payload = await this.verifyJwt(token);

    if (!payload || payload.type !== "session") {
      return null;
    }

    return await companyDBService.findByCompanyId(payload.companyId);
  }

  /**
   * Check if the request is authenticated
   */
  async isAuthenticated(req: Request): Promise<boolean> {
    const company = await this.getAuthenticatedCompany(req);
    return company !== null;
  }

  /**
   * Get authenticated company or throw error
   */
  async requireAuth(req: Request) {
    const company = await this.getAuthenticatedCompany(req);

    if (!company) {
      throw new Error("Unauthorized");
    }

    return company;
  }

  /**
   * Destroy both session and refresh cookies (logout)
   */
  destroySession(res: Response): void {
    const cookieOptions = {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    res.clearCookie(SESSION_COOKIE_NAME, cookieOptions);
    res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);
  }
}

export const sessionService = new SessionService();
