export interface Shop {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  currencyCode: string;
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShopInput {
  company_id: string;
  name: string;
  description?: string;
  currencyCode?: string;
  metadata?: Record<string, any>;
}