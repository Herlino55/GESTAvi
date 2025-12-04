import { Aliment } from '../types/aliment';
import { Transaction } from '../types/transaction';
import { Notification } from '../types/notification';

interface AddStockData {
  aliment_id: number;
  quantite: number;
  cout: number;
}

export const StockService = {
  addStock(
    data: AddStockData,
    aliments: Aliment[]
  ): { updatedAliment: Aliment; transaction: Transaction } | null {
    const aliment = aliments.find(a => a.id === data.aliment_id);
    if (!aliment) return null;

    const updatedAliment: Aliment = {
      ...aliment,
      stock_actuel: aliment.stock_actuel + data.quantite
    };

    const transaction: Transaction = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'DEPENSE',
      categorie: 'Achat Aliment',
      montant: data.cout,
      description: `Achat ${data.quantite}kg ${aliment.nom}`
    };

    return { updatedAliment, transaction };
  },

  consumeStock(alimentId: number, quantity: number, aliments: Aliment[]): Aliment | null {
    const aliment = aliments.find(a => a.id === alimentId);
    if (!aliment || quantity > aliment.stock_actuel) return null;

    return {
      ...aliment,
      stock_actuel: aliment.stock_actuel - quantity
    };
  },

  checkAlerts(aliments: Aliment[], existingNotifications: Notification[]): Notification[] {
    const newNotifs: Notification[] = [];

    aliments.forEach(alim => {
      const existing = existingNotifications.find(
        n => n.message.includes(alim.nom) && !n.lue
      );

      if (!existing) {
        if (alim.stock_actuel <= alim.seuil_critique) {
          newNotifs.push({
            id: Date.now() + Math.random(),
            niveau: 'URGENT',
            titre: 'Stock Critique',
            message: `Le stock de ${alim.nom} est critique (${alim.stock_actuel}kg). Réapprovisionnez immédiatement.`,
            date: new Date().toLocaleTimeString('fr-FR'),
            lue: false
          });
        } else if (alim.stock_actuel <= alim.seuil_alerte) {
          newNotifs.push({
            id: Date.now() + Math.random(),
            niveau: 'WARNING',
            titre: 'Stock Faible',
            message: `Le stock de ${alim.nom} est bas (${alim.stock_actuel}kg).`,
            date: new Date().toLocaleTimeString('fr-FR'),
            lue: false
          });
        }
      }
    });

    return newNotifs;
  },

  getTotalStock(aliments: Aliment[]): number {
    return aliments.reduce((acc, a) => acc + a.stock_actuel, 0);
  }
};