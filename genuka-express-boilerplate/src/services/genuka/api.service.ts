import { OAUTH } from "@/config/constants.js";
import { env } from "@/config/env.js";
import Genuka from "genuka-api";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in_minutes: number;
}

export class GenukaApiService {
  async initialize(companyId: string) {
    return await Genuka.initialize({ id: companyId });
  }

  /**
   * Exchange authorization code for tokens
   * Returns both access_token and refresh_token
   */
  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const tokenUrl = `${env.genuka.url}${OAUTH.TOKEN_ENDPOINT}`;

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: OAUTH.GRANT_TYPE,
        code,
        client_id: env.genuka.clientId,
        client_secret: env.genuka.clientSecret,
        redirect_uri: env.genuka.redirectUri,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
    }

    return (await response.json()) as TokenResponse;
  }

  /**
   * Refresh access token using refresh_token
   * This is the secure way to renew a session
   */
  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const tokenUrl = `${env.genuka.url}${OAUTH.REFRESH_ENDPOINT}`;

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        client_id: env.genuka.clientId,
        client_secret: env.genuka.clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
    }

    return (await response.json()) as TokenResponse;
  }

  async getCompanyInfo(companyId: string) {
    const genuka = await this.initialize(companyId);
    return await genuka.company.retrieve();
  }

  async get<T>(endpoint: string, accessToken: string): Promise<T> {
    const url = `${env.genuka.url}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async post<T>(
    endpoint: string,
    accessToken: string,
    data: unknown,
  ): Promise<T> {
    const url = `${env.genuka.url}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}

export const genukaApiService = new GenukaApiService();
