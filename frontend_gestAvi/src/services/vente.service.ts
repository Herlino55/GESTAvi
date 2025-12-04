import { Vente } from '../types/vente';
import { Lot } from '../types/lot';
import { Transaction } from '../types/transaction';
// import { Batiment } from '../types/batiment';

interface CreateVenteData {
  lot_id: number;
  quantite: number;
  prix_unitaire: number;
  client?: string;
  enregistre_par: string;
}

export const VenteService = {
  createVente(
    data: CreateVenteData,
    lots: Lot[]
  ): { vente: Vente; transaction: Transaction; updatedLot: Lot } | null {
    const lot = lots.find(l => l.id === data.lot_id);
    if (!lot || data.quantite > lot.quantite_actuelle) return null;

    const total = data.quantite * data.prix_unitaire;

    const vente: Vente = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      lot_id: data.lot_id,
      lot_code: lot.code,
      quantite: data.quantite,
      prix_unitaire: data.prix_unitaire,
      montant_total: total,
      client: data.client,
      enregistre_par: data.enregistre_par
    };

    const transaction: Transaction = {
      id: Date.now() + 1,
      date: new Date().toISOString().split('T')[0],
      type: 'RECETTE',
      categorie: 'Vente Poulets',
      montant: total,
      description: `Vente ${data.quantite} têtes ${lot.code}`
    };

    const newQuantity = lot.quantite_actuelle - data.quantite;
    const updatedLot: Lot = {
      ...lot,
      quantite_actuelle: newQuantity,
      statut: newQuantity <= 0 ? 'VENDU' : lot.statut
    };

    return { vente, transaction, updatedLot };
  },

  calculateTotalRevenue(ventes: Vente[]): number {
    return ventes.reduce((sum, v) => sum + v.montant_total, 0);
  },

  getVentesByPeriod(ventes: Vente[], startDate: string, endDate: string): Vente[] {
    return ventes.filter(v => v.date >= startDate && v.date <= endDate);
  }
};