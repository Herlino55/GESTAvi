import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useFarmStore } from '../stores/useFarmStore';
import { formatMoney } from '../utils/utils';

interface VentesProps {
  onOpenModal: (modalType: string) => void;
}

export const Ventes: React.FC<VentesProps> = ({ onOpenModal }) => {
  const { ventes } = useFarmStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Historique des Ventes</h2>
        <Button icon={Plus} onClick={() => onOpenModal('NEW_VENTE')}>
          Nouvelle Vente
        </Button>
      </div>
      <Card>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 uppercase">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Lot</th>
              <th className="px-6 py-3">Quantité</th>
              <th className="px-6 py-3">Prix Unit.</th>
              <th className="px-6 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ventes.map(v => (
              <tr key={v.id}>
                <td className="px-6 py-4">{v.date}</td>
                <td className="px-6 py-4 text-blue-600 font-medium">{v.lot_code}</td>
                <td className="px-6 py-4">{v.quantite}</td>
                <td className="px-6 py-4">{formatMoney(v.prix_unitaire)}</td>
                <td className="px-6 py-4 text-right font-bold text-emerald-600">
                  {formatMoney(v.montant_total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};