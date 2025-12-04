import prisma from "@/utils/prisma.js";

export interface CompanyData {
  id: string;
  handle: string | null;
  name: string;
  description: string | null;
  logoUrl: string | null;
  authorizationCode: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
  phone: string | null;
}

/**
 * Company Database Service
 * Handles all database operations for the Company model
 */
export class CompanyDBService {
  /**
   * Find company by access token
   */
  async findByAccessToken(accessToken: string) {
    return prisma.company.findFirst({
      where: { accessToken },
    });
  }

  /**
   * Create or update company
   */
  async upsertCompany(data: CompanyData) {
    return prisma.company.upsert({
      where: { id: data.id },
      update: {
        handle: data.handle,
        name: data.name,
        description: data.description,
        logoUrl: data.logoUrl,
        authorizationCode: data.authorizationCode,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenExpiresAt: data.tokenExpiresAt,
        phone: data.phone,
      },
      create: data,
    });
  }

  /**
   * Find company by ID
   */
  async findByCompanyId(id: string) {
    return prisma.company.findUnique({
      where: { id },
    });
  }

  /**
   * Find company by handle
   */
  async findByHandle(handle: string) {
    return prisma.company.findUnique({
      where: { handle },
    });
  }

  /**
   * Get all companies
   */
  async findAll() {
    return prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Delete company by ID
   */
  async deleteById(id: string) {
    return prisma.company.delete({
      where: { id },
    });
  }

  /**
   * Update company by ID
   */
  async updateById(id: string, data: Partial<CompanyData>) {
    return prisma.company.update({
      where: { id },
      data,
    });
  }
}

export const companyDBService = new CompanyDBService();
