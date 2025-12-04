import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useFarmStore } from '../stores/useFarmStore';
import { useAuthStore } from '../stores/useAuthStore';
import { LotService } from '../services/lot.service';

interface LotsProps {
  onOpenModal: (modalType: string, lotId?: number) => void;
}

export const Lots: React.FC<LotsProps> = ({ onOpenModal }) => {
  const { lots } = useFarmStore();
  const { currentUser } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gestion des Lots</h2>
        {currentUser?.role !== 'EMPLOYE' && (
          <Button icon={Plus} onClick={() => onOpenModal('NEW_LOT')}>
            Nouveau Lot
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {lots.map(lot => {
          const mortalityRate = LotService.getMortalityRate(lot);
          
          return (
            <Card key={lot.id} className="relative group hover:shadow-md transition-shadow">
              <div 
                className={`h-2 w-full ${
                  lot.statut === 'VENDU' 
                    ? 'bg-slate-400' 
                    : lot.statut === 'DEMARRAGE' 
                    ? 'bg-blue-500' 
                    : 'bg-emerald-500'
                }`} 
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{lot.code}</h3>
                    <p className="text-slate-500 text-sm">{lot.batiment_nom}</p>
                  </div>
                  <Badge variant={lot.statut === 'VENDU' ? 'neutral' : 'success'}>
                    {lot.statut}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-2 rounded">
                    <p className="text-xs text-slate-500">Effectif</p>
                    <p className="font-bold text-slate-800">
                      {lot.quantite_actuelle}{' '}
                      <span className="text-xs font-normal">/ {lot.quantite_initiale}</span>
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <p className="text-xs text-slate-500">Mortalité</p>
                    <p className="font-bold text-rose-600">
                      {mortalityRate.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 text-xs" 
                    variant="secondary" 
                    onClick={() => onOpenModal('NEW_SUIVI', lot.id)}
                  >
                    Suivi
                  </Button>
                  {lot.statut !== 'VENDU' && currentUser?.role !== 'EMPLOYE' && (
                    <Button 
                      className="flex-1 text-xs" 
                      variant="primary" 
                      onClick={() => onOpenModal('NEW_VENTE', lot.id)}
                    >
                      Vendre
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};