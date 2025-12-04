/* eslint-disable @typescript-eslint/no-unused-vars */
import { Lot } from '../types/lot';
import { Batiment } from '../types/batiment';
import { Transaction } from '../types/transaction';

interface CreateLotData {
  batiment_id: number;
  quantite: number;
  cout: number;
}

export const LotService = {
  createLot(
    data: CreateLotData,
    batiments: Batiment[],
    lots: Lot[],
    transactions: Transaction[]
  ): { lot: Lot; transaction: Transaction; updatedBatiment: Batiment } | null {
    const bat = batiments.find(b => b.id === data.batiment_id);
    if (!bat) return null;

    const newLot: Lot = {
      id: Date.now(),
      code: `L24-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      batiment_id: bat.id,
      batiment_nom: bat.nom,
      quantite_initiale: data.quantite,
      quantite_actuelle: data.quantite,
      date_debut: new Date().toISOString().split('T')[0],
      statut: 'DEMARRAGE',
      cout_achat_poussins: data.cout
    };

    const transaction: Transaction = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'DEPENSE',
      categorie: 'Achat Poussins',
      montant: newLot.cout_achat_poussins,
      description: `Démarrage ${newLot.code}`
    };

    const updatedBatiment: Batiment = {
      ...bat,
      occupation_actuelle: bat.occupation_actuelle + newLot.quantite_initiale
    };

    return { lot: newLot, transaction, updatedBatiment };
  },

  updateLotQuantity(lotId: number, quantityChange: number, lots: Lot[]): Lot | null {
    const lot = lots.find(l => l.id === lotId);
    if (!lot) return null;

    const newQuantity = lot.quantite_actuelle + quantityChange;
    
    return {
      ...lot,
      quantite_actuelle: newQuantity,
      statut: newQuantity <= 0 ? 'VENDU' : lot.statut
    };
  },

  getTotalPoulets(lots: Lot[]): number {
    return lots
      .filter(l => l.statut !== 'VENDU')
      .reduce((sum, l) => sum + l.quantite_actuelle, 0);
  },

  getMortalityRate(lot: Lot): number {
    return ((1 - lot.quantite_actuelle / lot.quantite_initiale) * 100);
  }
};