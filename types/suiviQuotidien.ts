import { Decimal } from "@prisma/client/runtime/wasm-compiler-edge";

export interface CreateSuiviQuotidienInput {
  companyId: string;
  lotId: string;
  productId?: string;
  dateSuivi: Date | string;
  mortalite?: number;
  quantiteAlimentKg?: number | Decimal;
  observations?: string;
}

export interface UpdateSuiviQuotidienInput {
  lotId?: string;
  productId?: string;
  dateSuivi?: Date | string;
  mortalite?: number;
  quantiteAlimentKg?: number | Decimal;
  observations?: string;
}

export interface SuiviQuotidienResponse {
  id: string;
  companyId: string;
  lotId: string;
  productId?: string | null;
  dateSuivi: Date;
  mortalite: number;
  quantiteAlimentKg: Decimal;
  observations?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetSuiviQuotidiensParams {
  companyId?: string;
  lotId?: string;
  productId?: string;
  dateDebut?: Date | string;
  dateFin?: Date | string;
  limit?: number;
  offset?: number;
}