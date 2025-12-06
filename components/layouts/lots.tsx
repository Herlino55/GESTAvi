// @/components/Lots.tsx (Avec cartes compactées)

import React, { useState } from 'react';
import { Plus, Trash2, Home, BarChart } from 'lucide-react'; 

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label'; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

interface Lot {
  id: number;
  code: string;
  batiment_nom: string;
  quantite_initiale: number;
  quantite_actuelle: number;
  prix_total: number;
}

interface LotsProps {
  lots: Lot[];
  addLot: (newLot: Omit<Lot, 'id' | 'quantite_actuelle' | 'batiment_nom'>) => void; 
  deleteLot: (id: number) => void;
  currentUserRole: string; // Ex: 'ADMIN', 'MANAGER', 'EMPLOYE'
}

export const Lots: React.FC<LotsProps> = ({ lots, addLot, deleteLot, currentUserRole }) => {

  // Dialog states
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [lotToDelete, setLotToDelete] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    quantite_initiale: "",
    prix_total: "",
  });

  const handleCreateLot = () => {
    setValidationError(null);

    const qInit = Number(formData.quantite_initiale);
    const pTotal = Number(formData.prix_total);

    if (!formData.code || qInit <= 0 || pTotal <= 0) {
      setValidationError("Veuillez remplir correctement tous les champs (valeurs positives requises).");
      return;
    }

    const newLotData = {
      code: formData.code,
      quantite_initiale: qInit,
      prix_total: pTotal,
    };

    addLot(newLotData as any); 

    setFormData({ code: "", quantite_initiale: "", prix_total: "" });
    setOpenAdd(false);
  };

  const confirmDeleteLot = () => {
    if (lotToDelete !== null) {
      deleteLot(lotToDelete);
    }
    setOpenDelete(false);
  };

  // Calcul mortalité
  const getMortalityRate = (lot: Lot) => {
    const morts = lot.quantite_initiale - lot.quantite_actuelle;
    if (lot.quantite_initiale === 0) return 0;
    return (morts / lot.quantite_initiale) * 100;
  };

  // Calcul du prix unitaire initial
  const getPrixUnitaire = (lot: Lot) => {
    if (lot.quantite_initiale === 0)
      return 0;
    else
      return lot.prix_total / lot.quantite_initiale;
  };

  return (
    <div className="space-y-6 animate-fadeIn p-6 min-h-screen bg-stone-50 overflow-y-auto">

      {/* 🐦 HEADER */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
        <h2 className="text-3xl font-extrabold text-emerald-900">Gestion des Lots</h2>

        {currentUserRole !== 'EMPLOYE' && (
          <Button 
            onClick={() => {setOpenAdd(true); setValidationError(null);}} 
            className="bg-amber-500 hover:bg-amber-600 text-emerald-900 font-bold transition-colors shadow-md"
          >
            <Plus size={18} className="mr-2" />
            Nouveau Lot
          </Button>
        )}
      </div>

      {/* 📦 LISTE DES CARTES DE LOTS (Compactées) */}
      {lots.length === 0 ? (
        <p className="text-slate-500 italic p-4 text-center">Aucun lot en cours n'a été enregistré.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lots.map(lot => {
            const mortalityRate = getMortalityRate(lot);
            const prixUnitaire = getPrixUnitaire(lot);
            console.log('Lot:', lot, 'Mortality Rate:', mortalityRate, 'Prix Unitaire:', prixUnitaire);
            // const mortalityColor = mortalityRate > 10 ? 'bg-rose-500' : (mortalityRate > 5 ? 'bg-amber-500' : 'bg-emerald-500');

            return (
              <Card 
                key={lot.id} 
                className="relative overflow-hidden border-t-4 border-emerald-700 hover:shadow-xl transition-all duration-300"
              >
                {/* Réduction du padding ici (p-4 au lieu de p-6) */}
                <div className="p-4 space-y-3"> 

                  {/* Titre et Bâtiment (Compacté) */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-emerald-900">{lot.code}</h3>
                      <p className="text-slate-600 text-xs flex items-center gap-1 mt-0.5">
                        <Home size={12} className="text-amber-500"/> {lot.batiment_nom || 'Non assigné'}
                      </p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs font-semibold">
                        ACTIF
                    </Badge>
                  </div>

                  {/* Séparateur et Stats (Plus compact) */}
                  <div className="border-t border-slate-100 pt-3 grid grid-cols-3 gap-3">
                    
                    {/* Stat 1 : Effectif */}
                    <div className="p-2 rounded-lg bg-emerald-50">
                      <p className="text-xs font-semibold text-emerald-700 mb-0.5">Effectif</p>
                      <p className="text-xl font-extrabold text-emerald-900">
                        {lot.quantite_actuelle}
                        <span className="text-xs font-normal text-slate-500">/{lot.quantite_initiale}</span>
                      </p>
                    </div>

                    {/* Stat 2 : Mortalité */}
                    <div className="p-2 rounded-lg border border-rose-200 bg-rose-50">
                      <p className="text-xs font-semibold text-rose-700 mb-0.5">Mortalité</p>
                      <p className={`text-xl font-extrabold ${mortalityRate > 10 ? 'text-rose-600' : 'text-amber-600'}`}>
                        {mortalityRate.toFixed(1)}%
                      </p>
                    </div>

                    {/* Stat 3 : Prix unitaire initial */}
                    <div className="p-2 rounded-lg bg-amber-50">
                        <p className="text-xs font-semibold text-amber-700 mb-0.5">Coût Unitaire</p>
                        <p className="text-xl font-extrabold text-amber-900">
                            {prixUnitaire.toFixed(0)} <span className="text-xs font-normal">FCFA</span>
                        </p>
                    </div>
                  </div>

                  {/* Button delete (pour admin/manager) */}
                  {currentUserRole !== 'EMPLOYE' && (
                    <div className="flex justify-end pt-3 border-t border-slate-100 mt-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-rose-500 hover:bg-rose-100 hover:text-rose-700 w-8 h-8" // Taille ajustée
                        onClick={() => {
                          setLotToDelete(lot.id);
                          setOpenDelete(true);
                        }}
                      >
                        <Trash2 size={16} /> {/* Icône plus petite */}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ➕ DIALOG — AJOUTER UN LOT (Non modifié pour rester concentré sur les cartes) */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-emerald-900">Ajouter un nouveau lot 🐣</DialogTitle>
            <DialogDescription>
              Entrez les informations initiales pour le nouveau lot de volailles.
            </DialogDescription>
          </DialogHeader>

          {validationError && (
            <div className="p-3 bg-rose-100 border border-rose-400 text-rose-800 rounded-md text-sm">
              {validationError}
            </div>
          )}

          <div className="grid gap-4 py-4">
            
            {/* Champ: Nom du lot (Code) */}
            <div className="space-y-2">
              <Label htmlFor="code" className="text-emerald-800">Nom / Code du lot</Label>
              <Input
                id="code"
                placeholder="Ex: POULET-J01-2025"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="focus:border-amber-500"
                required
              />
            </div>

            {/* Champ: Quantité initiale */}
            <div className="space-y-2">
              <Label htmlFor="quantite_initiale" className="text-emerald-800">Quantité initiale (Têtes)</Label>
              <Input
                id="quantite_initiale"
                type="number"
                min="1"
                placeholder="Ex: 500"
                value={formData.quantite_initiale}
                onChange={(e) => setFormData({ ...formData, quantite_initiale: e.target.value })}
                className="focus:border-amber-500"
                required
              />
            </div>

            {/* Champ: Prix total d'acquisition */}
            <div className="space-y-2">
              <Label htmlFor="prix_total" className="text-emerald-800">Prix total d'acquisition (FCFA)</Label>
              <Input
                id="prix_total"
                type="number"
                min="0"
                placeholder="Ex: 250000"
                value={formData.prix_total}
                onChange={(e) => setFormData({ ...formData, prix_total: e.target.value })}
                className="focus:border-amber-500"
                required
              />
            </div>
            
            {/* Note d'information */}
            <p className="text-xs text-slate-500 pt-2 italic">
                L'occupation actuelle sera initialisée à la quantité initiale. Le bâtiment pourra être assigné ultérieurement.
            </p>

          </div>

          <DialogFooter>
            <Button 
                variant="outline" 
                onClick={() => setOpenAdd(false)}
                className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
            >
                Annuler
            </Button>
            <Button 
                onClick={handleCreateLot}
                className="bg-emerald-700 hover:bg-emerald-800 text-amber-300 font-semibold"
            >
                Créer le Lot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* 🗑️ DIALOG — SUPPRIMER UN LOT (Non modifié) */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-rose-700">Confirmer la suppression</DialogTitle>
          </DialogHeader>

          <p className="text-slate-600">
            Voulez-vous vraiment supprimer ce lot ? Cette action est irréversible et supprimera toutes les données de suivi associées.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Annuler
            </Button>

            <Button variant="destructive" onClick={confirmDeleteLot}>
              <Trash2 size={16} className="mr-2" /> Supprimer Définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};