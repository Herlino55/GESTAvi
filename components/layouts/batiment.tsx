// @/components/layouts/batiment.tsx

import React, { useState } from 'react';
import { Plus, Trash2, Home, AlertTriangle, CheckCircle } from 'lucide-react'; 

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

// Interfaces mises à jour
interface Batiment {
  id: number;
  nom: string;
  statut: 'ACTIF' | 'INACTIF';
  occupation_actuelle: number;
  capacite_max: number;
}

interface BatimentsGestionProps {
  batiments: Batiment[];
  addBatiment: (newBatiment: { nom: string; capacite_max: number }) => void;
  deleteBatiment: (id: number) => void;
}

export const BatimentsGestion: React.FC<BatimentsGestionProps> = ({ batiments = [], addBatiment, deleteBatiment }) => {
  
  // États pour les Dialogs (Modaux)
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [batimentToDelete, setBatimentToDelete] = useState<number | null>(null);

  // État du formulaire d'ajout
  const [formData, setFormData] = useState({
    nom: "",
    capacite_max: "",
  });
  const [addError, setAddError] = useState<string | null>(null);

  // --- LOGIQUE AJOUT ---
  const handleAddBatiment = () => {
    setAddError(null);
    const capacity = Number(formData.capacite_max);

    if (!formData.nom || capacity <= 0 || !Number.isInteger(capacity)) {
      setAddError("Veuillez donner un nom et une capacité maximale valide (nombre entier > 0).");
      return;
    }

    addBatiment({
      nom: formData.nom,
      capacite_max: capacity,
    });

    setFormData({ nom: "", capacite_max: "" });
    setOpenAdd(false);
  };

  // --- LOGIQUE SUPPRESSION ---
  const handleConfirmDelete = () => {
    if (batimentToDelete !== null) {
      deleteBatiment(batimentToDelete);
    }
    setOpenDelete(false);
    setBatimentToDelete(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn p-6 min-h-screen bg-stone-50 overflow-y-auto">
      
      {/* 🏡 HEADER */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
        <h2 className="text-3xl font-extrabold text-emerald-900">Infrastructures</h2>
        
        {/* Bouton d'ajout */}
        <Button 
            onClick={() => { setOpenAdd(true); setAddError(null); }}
            className="bg-amber-500 hover:bg-amber-600 text-emerald-900 font-bold transition-colors shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Bâtiment
        </Button>
      </div>

      {/* 📦 LISTE DES CARTES DE BÂTIMENTS */}
      {batiments.length === 0 ? (
        <p className="text-slate-500 italic p-4 text-center">Aucun bâtiment enregistré.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batiments.map((bat) => {
            const occPercent = (bat.occupation_actuelle / bat.capacite_max) * 100;
            const isCritical = occPercent > 90;
            const isActive = bat.statut === 'ACTIF';

            return (
              <Card 
                key={bat.id} 
                className={`relative overflow-hidden border-t-4 transition-shadow duration-300 hover:shadow-lg 
                            ${isActive ? 'border-emerald-700' : 'border-slate-400'}`}
              >
                <div className="p-4 space-y-3">
                  
                  {/* Titre & Statut */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-xl text-emerald-900 flex items-center gap-2">
                        <Home size={20} className="text-amber-500" />
                        {bat.nom}
                    </h3>
                    <Badge 
                      className={isActive ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-slate-300 hover:bg-slate-400 text-slate-800"}
                    >
                      {bat.statut}
                    </Badge>
                  </div>

                  {/* Occupation & Capacité */}
                  <div className="mb-2 flex justify-between text-sm font-medium text-slate-600 pt-2">
                    <span className="flex items-center gap-1">
                        {isCritical ? <AlertTriangle size={14} className='text-rose-600'/> : <CheckCircle size={14} className='text-emerald-600'/>} 
                        Occupation actuelle
                    </span>
                    <span className="font-bold text-slate-800">
                      {bat.occupation_actuelle} / {bat.capacite_max}
                    </span>
                  </div>

                  {/* Barre de Progression */}
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isCritical ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occPercent}%` }}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-3 border-t border-slate-100 mt-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-rose-500 hover:bg-rose-100 hover:text-rose-700 w-8 h-8"
                        onClick={() => {
                          setBatimentToDelete(bat.id);
                          setOpenDelete(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ➕ DIALOG — AJOUTER UN BÂTIMENT */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-emerald-900">Ajouter un nouveau bâtiment</DialogTitle>
            <DialogDescription>
              Définissez le nom et la capacité maximale de l'infrastructure.
            </DialogDescription>
          </DialogHeader>

          {addError && (
            <div className="p-3 bg-rose-100 border border-rose-400 text-rose-800 rounded-md text-sm">
              {addError}
            </div>
          )}

          <div className="grid gap-4 py-4">
            
            {/* Champ: Nom du bâtiment */}
            <div className="space-y-2">
              <Label htmlFor="nom" className="text-emerald-800">Nom du Bâtiment</Label>
              <Input
                id="nom"
                placeholder="Ex: Bloc H, Bâtiment Ouest"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="focus:border-amber-500"
                required
              />
            </div>

            {/* Champ: Capacité maximale */}
            <div className="space-y-2">
              <Label htmlFor="capacite_max" className="text-emerald-800">Capacité Maximale (Têtes)</Label>
              <Input
                id="capacite_max"
                type="number"
                min="1"
                placeholder="Ex: 200"
                value={formData.capacite_max}
                onChange={(e) => setFormData({ ...formData, capacite_max: e.target.value })}
                className="focus:border-amber-500"
                required
              />
            </div>
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
                onClick={handleAddBatiment}
                className="bg-emerald-700 hover:bg-emerald-800 text-amber-300 font-semibold"
            >
                Créer le Bâtiment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 🗑️ DIALOG — SUPPRIMER UN BÂTIMENT */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-rose-700">Confirmer la suppression</DialogTitle>
          </DialogHeader>

          <p className="text-slate-600">
            Êtes-vous sûr de vouloir supprimer ce bâtiment ? Cette action est irréversible.
            **Note :** Vous devriez d'abord vous assurer qu'il n'y a aucun lot actif ou historique associé à ce bâtiment.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Annuler
            </Button>

            <Button variant="destructive" onClick={handleConfirmDelete}>
              <Trash2 size={16} className="mr-2" /> Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};