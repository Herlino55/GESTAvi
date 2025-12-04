import { Company } from "@/generated/prisma/index.js";

declare global {
  namespace Express {
    interface Request {
      companyId?: string;
      company?: Company;
    }
  }
}

export {};
