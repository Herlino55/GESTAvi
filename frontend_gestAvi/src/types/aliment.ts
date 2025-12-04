export interface Aliment {
  id: number;
  nom: string;
  stock_actuel: number;
  seuil_alerte: number;
  seuil_critique: number;
  prix_unitaire_moyen: number;
}
