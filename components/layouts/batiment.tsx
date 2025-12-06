import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GetShops } from '@/dal/shop/get.shop';
import { useAuthStore } from "@/stores";

interface Batiment {
  id: number;
  nom: string;
  statut: 'ACTIF' | 'INACTIF';
  occupation_actuelle: number;
  capacite_max: number;
}

interface BatimentsProps {
  onOpenModal: (modalType: string) => void;
  batiments: Batiment[];
}

export const Batiments: React.FC<BatimentsProps> = ({ onOpenModal, batiments = [] }) => {

  const { company } = useAuthStore();
  const getAllBatiments = () => {
    const batimentsList = GetShops(company?.id);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Infrastructures</h2>
        <Button onClick={() => onOpenModal('NEW_BATIMENT')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Bâtiment
        </Button>
      </div>

      {batiments.length === 0 ? (
        <p className="text-slate-500 italic">Aucun bâtiment enregistré.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batiments.map((bat) => {
            const occPercent = (bat.occupation_actuelle / bat.capacite_max) * 100;

            return (
              <Card key={bat.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">{bat.nom}</h3>
                    <Badge variant={bat.statut === 'ACTIF' ? 'secondary' : 'destructive'}>
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
      )}
    </div>
  );
};
