import React from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useFarmStore } from '../stores/useFarmStore';

interface AlimentsProps {
  onOpenModal: (modalType: string) => void;
}

export const Aliments: React.FC<AlimentsProps> = ({ onOpenModal }) => {
  const { aliments } = useFarmStore();

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
    </div>
  );
};