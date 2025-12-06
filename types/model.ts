/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Company {
  id: string;
  handle: string | null;
  name: string;
  description: string | null;
  logoUrl: string | null;
  authorizationCode: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  currencyCode: string;
  metadata: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  userShops?: UserShop[];
}

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: string;
  permissions: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  userShops?: UserShop[];
}

export interface UserShop {
  id: string;
  userId: string;
  shopId: string;
  createdAt: string;
  user?: User;
  shop?: Shop;
}

export interface AuthState {
  company: Company | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}
