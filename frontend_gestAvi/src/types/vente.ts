export interface Vente {
  id: number;
  date: string;
  lot_id: number;
  lot_code: string;
  quantite: number;
  prix_unitaire: number;
  montant_total: number;
  client?: string;
  enregistre_par: string;
}
