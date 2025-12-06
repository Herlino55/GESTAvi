import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  addLot: (newLot: Lot) => void;
  deleteLot: (id: number) => void;
  currentUserRole: string;
}

export const Lots: React.FC<LotsProps> = ({ lots, addLot, deleteLot, currentUserRole }) => {

  // Dialog states
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [lotToDelete, setLotToDelete] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    quantite_initiale: "",
    prix_total: "",
  });

  const handleCreateLot = () => {
    if (!formData.code || !formData.quantite_initiale || !formData.prix_total) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const newLot: Lot = {
      id: Date.now(),
      code: formData.code,
      batiment_nom: "Bâtiment A",
      quantite_initiale: Number(formData.quantite_initiale),
      quantite_actuelle: Number(formData.quantite_initiale),
      prix_total: Number(formData.prix_total),
    };

    addLot(newLot);
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
    return (morts / lot.quantite_initiale) * 100;
  };

  return (
    <div className="space-y-6 animate-fadeIn p-6 min-h-screen bg-gray-50 overflow-y-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gestion des Lots</h2>

        {currentUserRole !== 'EMPLOYE' && (
          <Button onClick={() => setOpenAdd(true)}>
            <Plus size={16} className="mr-2" />
            Nouveau Lot
          </Button>
        )}
      </div>

      {/* LISTE */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {lots.map(lot => {
          const mortalityRate = getMortalityRate(lot);

          return (
            <Card key={lot.id} className="relative group hover:shadow-md transition-shadow">
              <div className="h-2 w-full bg-emerald-500" />

              <div className="p-6">

                {/* Titre */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{lot.code}</h3>
                    <p className="text-slate-500 text-sm">{lot.batiment_nom}</p>
                  </div>
                  <Badge variant="outline">LOT</Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-2 rounded">
                    <p className="text-xs text-slate-500">Effectif</p>
                    <p className="font-bold text-slate-800">
                      {lot.quantite_actuelle}
                      <span className="text-xs font-normal"> / {lot.quantite_initiale}</span>
                    </p>
                  </div>

                  <div className="bg-slate-50 p-2 rounded">
                    <p className="text-xs text-slate-500">Mortalité</p>
                    <p className="font-bold text-rose-600">
                      {mortalityRate.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Button delete */}
                {currentUserRole !== 'EMPLOYE' && (
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setLotToDelete(lot.id);
                        setOpenDelete(true);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* ╔════════════════════════════════╗ */}
      {/*   DIALOG — AJOUTER UN LOT        */}
      {/* ╚════════════════════════════════╝ */}

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau lot</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Nom du lot</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Quantité initiale</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded"
                value={formData.quantite_initiale}
                onChange={(e) => setFormData({ ...formData, quantite_initiale: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Prix total</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded"
                value={formData.prix_total}
                onChange={(e) => setFormData({ ...formData, prix_total: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleCreateLot}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* ╔════════════════════════════════╗ */}
      {/*   DIALOG — SUPPRIMER UN LOT      */}
      {/* ╚════════════════════════════════╝ */}

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>

          <p className="text-slate-600">
            Voulez-vous vraiment supprimer ce lot ?  
            Cette action est irréversible.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Annuler
            </Button>

            <Button variant="destructive" onClick={confirmDeleteLot}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};
