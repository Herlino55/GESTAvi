import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useFarmStore } from '../stores/useFarmStore';
import { TransactionService } from '../services/transaction.service';
import { formatMoney } from '../utils/utils';

export const Finances: React.FC = () => {
  const { transactions } = useFarmStore();
  
  const totalRecettes = TransactionService.getRecettes(transactions);
  const totalDepenses = TransactionService.getDepenses(transactions);
  const solde = TransactionService.getBalance(transactions);
  
  const depensesParCategorie = TransactionService.getDepensesByCategory(transactions);
  const pieData = Object.entries(depensesParCategorie).map(([categorie, montant]) => ({
    categorie,
    montant
  }));

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <p className="text-slate-500 text-sm">Total Recettes</p>
          <p className="text-2xl font-bold text-emerald-600">{formatMoney(totalRecettes)}</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-rose-500">
          <p className="text-slate-500 text-sm">Total Dépenses</p>
          <p className="text-2xl font-bold text-rose-600">{formatMoney(totalDepenses)}</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-blue-500">
          <p className="text-slate-500 text-sm">Bilan Net</p>
          <p className={`text-2xl font-bold ${solde >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
            {formatMoney(solde)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold">Historique des Transactions</h3>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 sticky top-0">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map(t => (
                  <tr key={t.id}>
                    <td className="px-4 py-3">{t.date}</td>
                    <td className="px-4 py-3">{t.description}</td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral">{t.categorie}</Badge>
                    </td>
                    <td className={`px-4 py-3 text-right font-bold ${
                      t.type === 'RECETTE' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {t.type === 'RECETTE' ? '+' : '-'} {formatMoney(t.montant)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-bold mb-4">Répartition Dépenses</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  dataKey="montant" 
                  nameKey="categorie" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};