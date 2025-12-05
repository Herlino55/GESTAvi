export interface Stats {
  totalCommandes: number;
  caTotal?: number;
  chiffreAffairesJour: number;
  chiffreAffairesMois: number;
  nbClients: number;
  nouveauxClients: number;
}

export interface GetAllModels<T> {
  items: T; 
  count: number; 
  totalPages: number; 
  currentPage: number
}

export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
  error?: string;
  links?: JSON;
  meta?: object;
}

export interface ChartData {
  labels: string[];
  taux: number[];
}