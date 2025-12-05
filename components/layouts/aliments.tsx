import React from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Aliment {
  id: number;
  nom: string;
  stock_actuel: number;
  seuil_alerte: number;
  seuil_critique: number;
}

interface AlimentsProps {
  onOpenModal: (modalType: string) => void;
  aliments: Aliment[];  // 👈 tu reçois maintenant les données par props
}


export const Aliments: React.FC<AlimentsProps> = ({ onOpenModal, aliments }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gestion des Stocks Aliment</h2>
        <Button icon={Plus} onClick={() => onOpenModal('ADD_STOCK')}>
          Réapprovisionner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {aliments.map(a => {
          const isCritical = a.stock_actuel <= a.seuil_critique;
          const isLow = a.stock_actuel <= a.seuil_alerte && a.stock_actuel > a.seuil_critique;
          
          let borderColor = 'border-l-emerald-500';
          let textColor = 'text-slate-800';

          if (isCritical) {
            borderColor = 'border-l-rose-500';
            textColor = 'text-rose-600';
          } else if (isLow) {
            borderColor = 'border-l-amber-500';
            textColor = 'text-amber-600';
          }

          return (
            <Card 
              key={a.id}
              className={`py-4 px-6 border-l-4 ${borderColor} hover:shadow-xl transition duration-300 cursor-pointer`}
              onClick={() => {
                  setSelectedAliment(a);
                  setIsEditModalOpen(true);
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg mb-1 text-slate-800">{a.nom}</h3>
                    <p className="text-sm text-slate-500 mb-2">
                      Alerte: {a.seuil_alerte} kg
                    </p>

                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-extrabold ${textColor}`}> 
                        {a.stock_actuel}
                      </span>
                      <span className="text-base text-slate-500 font-semibold">kg</span> 
                    </div>

                    {(isCritical || isLow) && (
                      <div 
                        className={`mt-3 text-xs font-bold p-1 rounded flex items-center gap-2 w-fit ${
                          isCritical ? 'text-rose-600 bg-rose-50' : 'text-amber-600 bg-amber-50'
                        }`}
                      >
                        <AlertTriangle size={14} /> 
                        {isCritical ? 'CRITIQUE' : 'FAIBLE'}
                      </div>
                    )}
                </div>
                
                {/* Icône de Modification */}
                <Edit size={20} className={`mt-2 ${isCritical ? 'text-rose-400' : 'text-slate-400'} hover:text-emerald-500 transition`} />

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