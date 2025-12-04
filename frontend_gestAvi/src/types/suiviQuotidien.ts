export interface SuiviQuotidien {
  id: number;
  date: string;
  lot_id: number;
  lot_code: string;
  mortalite: number;
  aliment_distribue_kg: number;
  aliment_id: number;
  aliment_nom: string;
  observateur: string;
  notes?: string;
}