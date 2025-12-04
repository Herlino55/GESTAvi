import { create } from 'zustand';
import { Batiment } from '../types/batiment';
import { Lot } from '../types/lot';
import { SuiviQuotidien } from '../types/suiviQuotidien';
import { Aliment } from '../types/aliment';
import { Vente } from '../types/vente';
import { Transaction } from '../types/transaction';
import { Notification } from '../types/notification';
import { SEED_BATIMENTS } from '../data/seed.batiment';
import { SEED_LOTS } from '../data/seed.lots';
import { SEED_ALIMENTS } from '../data/seed.aliment';
import { SEED_TRANSACTIONS } from '../data/seed.transaction';
import { LotService } from '../services/lot.service';
import { VenteService } from '../services/vente.service';
import { StockService } from '../services/stock.service';

interface FarmState {
  // Data
  batiments: Batiment[];
  lots: Lot[];
  aliments: Aliment[];
  ventes: Vente[];
  transactions: Transaction[];
  suivis: SuiviQuotidien[];
  notifications: Notification[];

  // Batiment Actions
  addBatiment: (data: Omit<Batiment, 'id' | 'occupation_actuelle' | 'statut'>) => void;
  updateBatimentOccupation: (batimentId: number, change: number) => void;

  // Lot Actions
  createLot: (data: { batiment_id: number; quantite: number; cout: number }) => void;
  updateLot: (lotId: number, updates: Partial<Lot>) => void;

  // Suivi Actions
  addSuivi: (data: {
    lot_id: number;
    mortalite: number;
    aliment_id: number;
    quantite_alim: number;
    observateur: string;
  }) => void;

  // Vente Actions
  createVente: (data: {
    lot_id: number;
    quantite: number;
    prix_unitaire: number;
    enregistre_par: string;
  }) => void;

  // Stock Actions
  addStock: (data: { aliment_id: number; quantite: number; cout: number }) => void;
  consumeStock: (alimentId: number, quantity: number) => void;

  // Notification Actions
  markNotificationAsRead: (notificationId: number) => void;
  checkStockAlerts: () => void;
}

export const useFarmStore = create<FarmState>((set, get) => ({
  // Initial Data
  batiments: SEED_BATIMENTS,
  lots: SEED_LOTS,
  aliments: SEED_ALIMENTS,
  ventes: [],
  transactions: SEED_TRANSACTIONS,
  suivis: [],
  notifications: [],

  // Batiment Actions
  addBatiment: (data) => {
    const newBatiment: Batiment = {
      ...data,
      id: Date.now(),
      statut: 'ACTIF',
      occupation_actuelle: 0
    };
    set(state => ({ batiments: [...state.batiments, newBatiment] }));
  },

  updateBatimentOccupation: (batimentId, change) => {
    set(state => ({
      batiments: state.batiments.map(b =>
        b.id === batimentId
          ? { ...b, occupation_actuelle: b.occupation_actuelle + change }
          : b
      )
    }));
  },

  // Lot Actions
  createLot: (data) => {
    const state = get();
    const result = LotService.createLot(
      data,
      state.batiments,
      state.lots,
      state.transactions
    );

    if (result) {
      set(state => ({
        lots: [result.lot, ...state.lots],
        transactions: [result.transaction, ...state.transactions],
        batiments: state.batiments.map(b =>
          b.id === result.updatedBatiment.id ? result.updatedBatiment : b
        )
      }));
    }
  },

  updateLot: (lotId, updates) => {
    set(state => ({
      lots: state.lots.map(l => (l.id === lotId ? { ...l, ...updates } : l))
    }));
  },

  // Suivi Actions
  addSuivi: (data) => {
    const state = get();
    const lot = state.lots.find(l => l.id === data.lot_id);
    const aliment = state.aliments.find(a => a.id === data.aliment_id);
    
    if (!lot) return;

    const newSuivi: SuiviQuotidien = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      lot_id: data.lot_id,
      lot_code: lot.code,
      mortalite: data.mortalite,
      aliment_distribue_kg: data.quantite_alim,
      aliment_id: data.aliment_id,
      aliment_nom: aliment?.nom || 'Aucun',
      observateur: data.observateur
    };

    set(state => ({
      suivis: [newSuivi, ...state.suivis],
      lots: state.lots.map(l =>
        l.id === data.lot_id
          ? { ...l, quantite_actuelle: l.quantite_actuelle - data.mortalite }
          : l
      ),
      aliments: state.aliments.map(a =>
        a.id === data.aliment_id
          ? { ...a, stock_actuel: a.stock_actuel - data.quantite_alim }
          : a
      ),
      batiments: state.batiments.map(b =>
        b.id === lot.batiment_id
          ? { ...b, occupation_actuelle: b.occupation_actuelle - data.mortalite }
          : b
      )
    }));

    // Check alerts after stock consumption
    get().checkStockAlerts();
  },

  // Vente Actions
  createVente: (data) => {
    const state = get();
    const result = VenteService.createVente(data, state.lots);

    if (result) {
      const lot = state.lots.find(l => l.id === data.lot_id);
      
      set(state => ({
        ventes: [result.vente, ...state.ventes],
        transactions: [result.transaction, ...state.transactions],
        lots: state.lots.map(l => (l.id === data.lot_id ? result.updatedLot : l)),
        batiments: state.batiments.map(b =>
          lot && b.id === lot.batiment_id
            ? { ...b, occupation_actuelle: b.occupation_actuelle - data.quantite }
            : b
        )
      }));
    }
  },

  // Stock Actions
  addStock: (data) => {
    const state = get();
    const result = StockService.addStock(data, state.aliments);

    if (result) {
      set(state => ({
        aliments: state.aliments.map(a =>
          a.id === data.aliment_id ? result.updatedAliment : a
        ),
        transactions: [result.transaction, ...state.transactions]
      }));

      // Check alerts after adding stock
      get().checkStockAlerts();
    }
  },

  consumeStock: (alimentId, quantity) => {
    const state = get();
    const result = StockService.consumeStock(alimentId, quantity, state.aliments);

    if (result) {
      set(state => ({
        aliments: state.aliments.map(a => (a.id === alimentId ? result : a))
      }));

      get().checkStockAlerts();
    }
  },

  // Notification Actions
  markNotificationAsRead: (notificationId) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === notificationId ? { ...n, lue: true } : n
      )
    }));
  },

  checkStockAlerts: () => {
    const state = get();
    const newAlerts = StockService.checkAlerts(state.aliments, state.notifications);
    
    if (newAlerts.length > 0) {
      set(state => ({
        notifications: [
          ...newAlerts.filter(
            n => !state.notifications.some(existing => existing.message === n.message)
          ),
          ...state.notifications
        ]
      }));
    }
  }
}));