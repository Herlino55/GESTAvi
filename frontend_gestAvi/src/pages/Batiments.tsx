import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useFarmStore } from '../stores/useFarmStore';

interface BatimentsProps {
  onOpenModal: (modalType: string) => void;
}

export const Batiments: React.FC<BatimentsProps> = ({ onOpenModal }) => {
  const { batiments } = useFarmStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Infrastructures</h2>
        <Button icon={Plus} onClick={() => onOpenModal('NEW_BATIMENT')}>
          Nouveau Bâtiment
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batiments.map(bat => {
          const occPercent = (bat.occupation_actuelle / bat.capacite_max) * 100;
          return (
            <Card key={bat.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">{bat.nom}</h3>
                  <Badge variant={bat.statut === 'ACTIF' ? 'success' : 'warning'}>
                    {bat.statut}
                  </Badge>
                </div>
                <div className="mb-2 flex justify-between text-sm text-slate-500">
                  <span>Occupation</span>
                  <span>{bat.occupation_actuelle} / {bat.capacite_max}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      occPercent > 90 ? 'bg-rose-500' : 'bg-blue-500'
                    }`} 
                    style={{ width: `${occPercent}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};