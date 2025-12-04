import { Aliment } from "../types/aliment";

export const SEED_ALIMENTS: Aliment[] = [
  { id: 1, nom: 'Démarrage Miettes', stock_actuel: 80, seuil_alerte: 100, seuil_critique: 50, prix_unitaire_moyen: 350 },
  { id: 2, nom: 'Croissance Pellets', stock_actuel: 1200, seuil_alerte: 200, seuil_critique: 100, prix_unitaire_moyen: 320 },
  { id: 3, nom: 'Finition', stock_actuel: 45, seuil_alerte: 150, seuil_critique: 80, prix_unitaire_moyen: 300 },
];
