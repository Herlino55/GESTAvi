export type TransactionType = 'DEPENSE' | 'RECETTE';

export interface Transaction {
  id: number;
  date: string;
  type: TransactionType;
  categorie: string;
  montant: number;
  description: string;
  ref_id?: number;
}
