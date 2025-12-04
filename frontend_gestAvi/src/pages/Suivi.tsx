import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useFarmStore } from '../stores/useFarmStore';

interface SuiviProps {
  onOpenModal: (modalType: string) => void;
}

export const Suivi: React.FC<SuiviProps> = ({ onOpenModal }) => {
  const { suivis } = useFarmStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Journal de Suivi</h2>
        <Button icon={Plus} onClick={() => onOpenModal('NEW_SUIVI')}>
          Saisie Journalière
        </Button>
      </div>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suivis.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Aucun suivi enregistré.
                  </td>
                </tr>
              ) : (
                suivis.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{s.date}</td>
                    <td className="px-6 py-4 font-medium text-blue-600">{s.lot_code}</td>
                    <td className="px-6 py-4 text-rose-600 font-bold">-{s.mortalite}</td>
                    <td className="px-6 py-4">{s.aliment_distribue_kg} kg</td>
                    <td className="px-6 py-4 text-slate-500">{s.aliment_nom}</td>
                    <td className="px-6 py-4">{s.observateur}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
