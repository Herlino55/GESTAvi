import { Transaction } from "../types/transaction";

export const SEED_TRANSACTIONS: Transaction[] = [
  { id: 1, date: '2023-10-15', type: 'DEPENSE', categorie: 'Achat Poussins', montant: 500000, description: 'Lancement Lot L24-001' },
  { id: 2, date: '2023-10-16', type: 'DEPENSE', categorie: 'Achat Aliment', montant: 150000, description: 'Stock initial' },
];
