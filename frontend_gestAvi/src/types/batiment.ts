export type StatutBatiment = 'ACTIF' | 'INACTIF' | 'NETTOYAGE';

export interface Batiment {
  id: number;
  nom: string;
  capacite_max: number;
  statut: StatutBatiment;
  occupation_actuelle: number;
}
