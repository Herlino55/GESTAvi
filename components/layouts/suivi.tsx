import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SuiviType {
  id: number;
  date: string;
  lot_code: string;
  mortalite: number;
  aliment_distribue_kg: number;
  aliment_nom: string;
  observateur: string;
}

interface SuiviProps {
  suivis: SuiviType[];
  addSuivi: (s: SuiviType) => void;
  deleteSuivi: (id: number) => void;
  onOpenModal?: (modalType: string) => void; // ignore si tu veux
}

export const Suivi: React.FC<SuiviProps> = ({
  suivis,
  addSuivi,
  deleteSuivi,
}) => {
  // ------------------------------
  // États pour les dialogs
  // ------------------------------
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [suiviToDelete, setSuiviToDelete] = useState<number | null>(null);

  // Formulaire Ajout
  const [formData, setFormData] = useState({
    date: "",
    lot_code: "",
    mortalite: "",
    aliment_distribue_kg: "",
    aliment_nom: "",
    observateur: "",
  });

  const handleCreate = () => {
    if (
      !formData.date ||
      !formData.lot_code ||
      !formData.mortalite ||
      !formData.aliment_distribue_kg ||
      !formData.aliment_nom ||
      !formData.observateur
    ) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const newSuivi: SuiviType = {
      id: Date.now(),
      date: formData.date,
      lot_code: formData.lot_code,
      mortalite: Number(formData.mortalite),
      aliment_distribue_kg: Number(formData.aliment_distribue_kg),
      aliment_nom: formData.aliment_nom,
      observateur: formData.observateur,
    };

    addSuivi(newSuivi);
    setOpenAdd(false);

    setFormData({
      date: "",
      lot_code: "",
      mortalite: "",
      aliment_distribue_kg: "",
      aliment_nom: "",
      observateur: "",
    });
  };

  const confirmDelete = () => {
    if (suiviToDelete !== null) {
      deleteSuivi(suiviToDelete);
      setOpenDelete(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Journal de Suivi</h2>

        <Button onClick={() => setOpenAdd(true)}>
          <Plus size={16} className="mr-2" />
          Saisie Journalière
        </Button>
      </div>

      {/* TABLE */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Lot</th>
                <th className="px-6 py-3">Mortalité</th>
                <th className="px-6 py-3">Aliment (kg)</th>
                <th className="px-6 py-3">Type Aliment</th>
                <th className="px-6 py-3">Observateur</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {suivis.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Aucun suivi enregistré.
                  </td>
                </tr>
              ) : (
                suivis.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{s.date}</td>
                    <td className="px-6 py-4 text-blue-600">{s.lot_code}</td>
                    <td className="px-6 py-4 text-rose-600 font-bold">-{s.mortalite}</td>
                    <td className="px-6 py-4">{s.aliment_distribue_kg} kg</td>
                    <td className="px-6 py-4">{s.aliment_nom}</td>
                    <td className="px-6 py-4">{s.observateur}</td>

                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSuiviToDelete(s.id);
                          setOpenDelete(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ───────────────────────────────────────────── */}
      {/*  DIALOG — AJOUT D'UN SUIVI                  */}
      {/* ───────────────────────────────────────────── */}

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle Saisie de Suivi</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Lot</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                placeholder="Ex: LOT-001"
                value={formData.lot_code}
                onChange={(e) => setFormData({ ...formData, lot_code: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Mortalité</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded"
                value={formData.mortalite}
                onChange={(e) => setFormData({ ...formData, mortalite: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Aliment distribué (kg)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded"
                value={formData.aliment_distribue_kg}
                onChange={(e) =>
                  setFormData({ ...formData, aliment_distribue_kg: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Type d'aliment</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                placeholder="Ex: Aliment Début"
                value={formData.aliment_nom}
                onChange={(e) => setFormData({ ...formData, aliment_nom: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Observateur</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                placeholder="Nom de l'observateur"
                value={formData.observateur}
                onChange={(e) => setFormData({ ...formData, observateur: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleCreate}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ───────────────────────────────────────────── */}
      {/*  DIALOG — SUPPRESSION                       */}
      {/* ───────────────────────────────────────────── */}

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cette ligne ?</DialogTitle>
          </DialogHeader>

          <p className="text-slate-600">
            Cette action est irréversible.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Annuler
            </Button>

            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
