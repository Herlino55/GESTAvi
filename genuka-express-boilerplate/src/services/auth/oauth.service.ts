import {
  companyDBService,
  type CompanyData,
} from "@/services/database/company.service.js";
import { genukaApiService } from "@/services/genuka/api.service.js";
import { verifyHmac } from "@/utils/hmac.js";
import { OAUTH } from "@/config/constants.js";

export interface OAuthCallbackParams {
  code: string;
  companyId: string;
  timestamp: string;
  hmac: string;
  redirectTo: string;
}

export class OAuthService {
  async handleCallback(params: OAuthCallbackParams) {
    const isValidHmac = await verifyHmac(
      {
        code: params.code,
        company_id: params.companyId,
        redirect_to: params.redirectTo,
        timestamp: params.timestamp,
      },
      params.hmac
    );

    if (!isValidHmac) {
      throw new Error("Invalid HMAC signature");
    }

    const timestampAge = Date.now() - parseInt(params.timestamp, 10) * 1000;
    if (timestampAge > OAUTH.TIMESTAMP_TOLERANCE_MS) {
      throw new Error("Request expired");
    }

    // Exchange code for tokens (access_token + refresh_token)
    const tokenResponse = await genukaApiService.exchangeCodeForToken(
      params.code
    );

    // Calculate token expiration date
    const tokenExpiresAt = new Date(
      Date.now() + tokenResponse.expires_in_minutes * 60 * 1000
    );

    // Fetch company information from Genuka
    const companyInfo = await genukaApiService.getCompanyInfo(params.companyId);

    // Prepare company data for database
    const companyData: CompanyData = {
      id: params.companyId,
      handle: companyInfo.handle || null,
      name: companyInfo.name,
      description: companyInfo.description || null,
      authorizationCode: params.code,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      tokenExpiresAt: tokenExpiresAt,
      logoUrl: companyInfo.logoUrl || null,
      phone: companyInfo.metadata?.contact || null,
    };

    // Save/update company in database
    await companyDBService.upsertCompany(companyData);

    return { success: true, companyId: params.companyId };
  }

  /**
   * Validate OAuth callback parameters
   */
  validateCallbackParams(params: {
    code?: string | null;
    companyId?: string | null;
    timestamp?: string | null;
    hmac?: string | null;
  }): boolean {
    return !!(
      params.code &&
      params.companyId &&
      params.timestamp &&
      params.hmac
    );
  }
}

export const oauthService = new OAuthService();
