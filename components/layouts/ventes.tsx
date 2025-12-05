import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Vente {
  id: number;
  date: string;
  lot_code: string;
  quantite: number;
  prix_unitaire: number;
  montant_total: number;
}

interface VentesProps {
  onOpenModal: (modalType: string) => void;
  ventes: Vente[];   // 👈 maintenant les ventes viennent des props
}

export const Ventes: React.FC<VentesProps> = ({ onOpenModal, ventes }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Historique des Ventes</h2>
        <Button  onClick={() => onOpenModal('NEW_VENTE')}>
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
            {ventes.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">
                  Aucune vente enregistrée.
                </td>
              </tr>
            ) : (
              ventes.map(v => (
                <tr key={v.id}>
                  <td className="px-6 py-4">{v.date}</td>
                  <td className="px-6 py-4 text-blue-600 font-medium">{v.lot_code}</td>
                  <td className="px-6 py-4">{v.quantite}</td>
                  <td className="px-6 py-4">FCFA {(v.prix_unitaire)}</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600">
                    {(v.montant_total)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
