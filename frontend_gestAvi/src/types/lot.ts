export type StatutLot = 'DEMARRAGE' | 'CROISSANCE' | 'FINITION' | 'VENDU';

export interface Lot {
  id: number;
  code: string;
  batiment_id: number;
  batiment_nom: string;
  quantite_initiale: number;
  quantite_actuelle: number;
  date_debut: string;
  statut: StatutLot;
  cout_achat_poussins: number;
}
