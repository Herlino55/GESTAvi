import React, { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Aliment {
  id: number;
  nom: string;
  stock_actuel: number;
  seuil_alerte: number;
  seuil_critique: number;
}

interface AlimentsProps {
  aliments: Aliment[];
  addStock: (added: { nom: string; quantite: number }) => void;
}

export const Aliments: React.FC<AlimentsProps> = ({ aliments, addStock }) => {

  // Dialog state
  const [openAdd, setOpenAdd] = useState(false);

  // Form state
  const [form, setForm] = useState({
    nom: "",
    quantite: "",
  });

  const handleAddStock = () => {
    if (!form.nom || !form.quantite) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    addStock({
      nom: form.nom,
      quantite: Number(form.quantite),
    });

    setForm({ nom: "", quantite: "" });
    setOpenAdd(false);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gestion des Stocks Aliment</h2>

        <Button onClick={() => setOpenAdd(true)}>
          <Plus className="mr-2" /> Réapprovisionner
        </Button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {aliments.map(a => {
          const isCritical = a.stock_actuel <= a.seuil_critique;
          const isLow = a.stock_actuel <= a.seuil_alerte;

          return (
            <Card 
              key={a.id}
              className={`border-l-4 ${
                isCritical 
                  ? 'border-l-rose-500' 
                  : isLow 
                  ? 'border-l-amber-500' 
                  : 'border-l-emerald-500'
              }`}
            >
              <div className="p-6">
                <h3 className="font-bold text-lg mb-1">{a.nom}</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Seuil alerte: {a.seuil_alerte}kg
                </p>

                <div className="flex items-baseline gap-1">
                  <span 
                    className={`text-4xl font-bold ${
                      isCritical 
                        ? 'text-rose-600'
                        : isLow 
                        ? 'text-amber-600'
                        : 'text-slate-800'
                    }`}
                  >
                    {a.stock_actuel}
                  </span>
                  <span className="text-slate-500">kg</span>
                </div>

                {isCritical && (
                  <div className="mt-4 text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded flex items-center gap-2">
                    <AlertTriangle size={14} /> STOCK CRITIQUE
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* DIALOG — AJOUT STOCK */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réapprovisionnement</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">

            <div>
              <label className="text-sm font-medium">Nom de l’aliment</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Quantité ajoutée (kg)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded"
                value={form.quantite}
                onChange={(e) => setForm({ ...form, quantite: e.target.value })}
              />
            </div>

          </div>

          <DialogFooter>
            <Button onClick={handleAddStock}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};
