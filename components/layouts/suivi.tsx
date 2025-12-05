"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Package, Skull, CookingPot, User } from 'lucide-react';
// Les imports Shadcn sont conservés
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// --- Composant d'Input stylisé ---
const Input = ({ label, type = "text", placeholder, value, onChange, icon: Icon, required = false, name }) => (
    <div>
        <label className="text-sm font-semibold text-slate-700 mb-1 flex items-center">
            {Icon && <Icon size={14} className="mr-1 text-emerald-500" />}
            {label} {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
        <input
            type={type}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            name={name}
        />
    </div>
);
// ---------------------------------

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
  onOpenModal?: (modalType: string) => void;
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

  // Formulaire Ajout (avec date initiale du jour)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().substring(0, 10),
    lot_code: "",
    mortalite: "",
    aliment_distribue_kg: "",
    aliment_nom: "",
    observateur: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    // Validation côté TypeScript (vérifie que les champs obligatoires ne sont pas vides)
    if (
        !formData.date ||
        !formData.lot_code ||
        formData.mortalite === "" ||
        formData.aliment_distribue_kg === "" ||
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

    // Réinitialisation du formulaire (sauf la date du jour)
    setFormData({
        date: new Date().toISOString().substring(0, 10),
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
      setSuiviToDelete(null);
    }
  };

  return (
    <div className="space-y-6 p-4">
      
      {/* HEADER */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-emerald-700">Journal de Suivi</h2>

        <Button 
            onClick={() => setOpenAdd(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
        >
          <Plus size={16} className="mr-2" />
          Saisie Journalière
        </Button>
      </div>

      {/* TABLE */}
      <Card className="shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-emerald-50 text-emerald-800 uppercase sticky top-0 border-b border-emerald-100">
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
                  <td colSpan={7} className="text-center py-8 text-slate-400 font-medium">
                    Aucun suivi enregistré pour l'instant.
                  </td>
                </tr>
              ) : (
                suivis.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition duration-100">
                    <td className="px-6 py-4 text-gray-600">{s.date}</td>
                    <td className="px-6 py-4 text-amber-600 font-semibold">{s.lot_code}</td>
                    <td className={`px-6 py-4 font-bold ${s.mortalite > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {s.mortalite > 0 ? `-${s.mortalite}` : '0'}
                    </td>
                    <td className="px-6 py-4 text-emerald-600 font-semibold">{s.aliment_distribue_kg} kg</td>
                    <td className="px-6 py-4 text-slate-700">{s.aliment_nom}</td>
                    <td className="px-6 py-4 text-slate-500">{s.observateur}</td>

                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-rose-500 hover:bg-rose-600 text-white p-2"
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
      {/*  DIALOG — AJOUT D'UN SUIVI (avec flou et styles)                  */}
      {/* ───────────────────────────────────────────── */}

      {/* AJOUT DE LA CLASSE backdrop-blur-sm */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-700">Nouvelle Saisie Journalière</DialogTitle>
          </DialogHeader>

          {/* Utilisation du composant Input stylisé */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            
            <Input
                label="Date"
                type="date"
                icon={Calendar}
                value={formData.date}
                onChange={handleInputChange}
                name="date"
                required
            />

            <Input
                label="Code Lot"
                type="text"
                icon={Package}
                placeholder="Ex: LOT-001"
                value={formData.lot_code}
                onChange={handleInputChange}
                name="lot_code"
                required
            />

            <Input
                label="Mortalité (Nb poulets)"
                type="number"
                icon={Skull}
                value={formData.mortalite}
                onChange={handleInputChange}
                name="mortalite"
                required
            />

            <Input
                label="Aliment distribué (kg)"
                type="number"
                icon={CookingPot}
                value={formData.aliment_distribue_kg}
                onChange={handleInputChange}
                name="aliment_distribue_kg"
                required
            />

            <Input
                label="Type d'aliment"
                type="text"
                icon={CookingPot}
                placeholder="Ex: Aliment Début"
                value={formData.aliment_nom}
                onChange={handleInputChange}
                name="aliment_nom"
                required
            />

            <Input
                label="Observateur"
                type="text"
                icon={User}
                placeholder="Nom de l'observateur"
                value={formData.observateur}
                onChange={handleInputChange}
                name="observateur"
                required
            />
          </div>

          <DialogFooter className="pt-4">
            <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus size={16} className="mr-2" />
                Enregistrer le Suivi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      {/* ───────────────────────────────────────────── */}
      {/*  DIALOG — SUPPRESSION (avec flou et styles)                       */}
      {/* ───────────────────────────────────────────── */}

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-rose-600">Confirmer la Suppression</DialogTitle>
          </DialogHeader>

          <p className="text-slate-600 py-2">
            Êtes-vous sûr de vouloir supprimer cette ligne de suivi ? Cette action est **irréversible**.
          </p>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)} className="border-gray-300 hover:bg-gray-100">
              Annuler
            </Button>

            <Button variant="destructive" onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700 text-white">
              <Trash2 size={16} className="mr-2" />
              Supprimer Définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};