import React from 'react';
import { Bird, Wallet, Wheat, AlertCircle, TrendingUp, ClipboardList, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useFarmStore } from '../stores/useFarmStore';
import { useAuthStore } from '../stores/useAuthStore';
import { TransactionService } from '../services/transaction.service';
import { LotService } from '../services/lot.service';
import { StockService } from '../services/stock.service';
import { formatMoney } from '../utils/utils';

interface DashboardProps {
  onOpenModal: (modalType: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenModal }) => {
  const { lots, aliments, transactions, notifications } = useFarmStore();
  const { currentUser } = useAuthStore();

  const solde = TransactionService.getBalance(transactions);
  const totalPoulets = LotService.getTotalPoulets(lots);
  const totalStock = StockService.getTotalStock(aliments);
  const unreadAlerts = notifications.filter(n => !n.lue).length;

  // Mock data for chart
  const chartData = [
    { jour: 'J1', mortalite: 2 },
    { jour: 'J2', mortalite: 0 },
    { jour: 'J3', mortalite: 5 },
    { jour: 'J4', mortalite: 1 },
    { jour: 'J5', mortalite: 3 },
    { jour: 'J6', mortalite: 0 },
    { jour: 'J7', mortalite: 2 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between gap-4 bg-white h-32">
          <div>
            <p className="text-sm text-slate-500 pb-4">Poulets Actifs</p>
            <p className="text-2xl font-bold text-black">{totalPoulets}</p>
          </div>
          <div className="p-3 text-blue-600">
            <Bird size={12} />
          </div>
        </Card>

        {currentUser?.role !== 'EMPLOYE' && (
          <Card className="p-4 flex items-center justify-between gap-4 bg-white h-32">
            <div>
              <p className="text-sm text-slate-500 pb-4">Solde Actuel</p>
              <p className="text-2xl font-bold text-emerald-700">{formatMoney(solde)}</p>
            </div>
            <div className="p-3 text-emerald-600">
              <Wallet size={12} />
            </div>
          </Card>
        )}

        <Card className="p-4 flex items-center justify-between gap-4 bg-white h-32">
          <div>
            <p className="text-sm text-slate-500 pb-4">Stock Aliment Total</p>
            <p className="text-2xl font-bold text-slate-800">{totalStock} kg</p>
          </div>
          <div className="p-3 text-amber-600">
            <Wheat size={12} />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between gap-4 bg-white h-32">
          <div>
            <p className="text-sm text-slate-500 pb-4">Alertes</p>
            <p className="text-2xl font-bold text-rose-600">{unreadAlerts}</p>
          </div>
          <div className="p-3  text-purple-600">
            <AlertCircle size={12} />
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Performance Mortalité
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="jour" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="mortalite" 
                  fill="#e4aa0bff" 
                  barSize={40} 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Actions Rapides</h3>
          <div className="space-y-3">
            <Button 
              className="w-full justify-start bg-primary" 
              variant="primary" 
              icon={ClipboardList} 
              onClick={() => onOpenModal('NEW_SUIVI')}
            >
              Saisir suivi quotidien
            </Button>
            {currentUser?.role !== 'EMPLOYE' && (
              <>
                <Button 
                  className="w-full justify-start" 
                  variant="secondary" 
                  icon={ShoppingCart} 
                  onClick={() => onOpenModal('NEW_VENTE')}
                >
                  Nouvelle Vente
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="secondary" 
                  icon={Wheat} 
                  onClick={() => onOpenModal('ADD_STOCK')}
                >
                  Réapprovisionner
                </Button>
              </>
            )}
          </div>

          <h3 className="text-lg font-bold mt-8 mb-4">Alertes Récentes</h3>
          <div className="space-y-2">
            {notifications.slice(0, 3).map(n => (
              <div 
                key={n.id} 
                className={`p-3 rounded-lg text-sm border-l-4 ${
                  n.niveau === 'URGENT' 
                    ? 'bg-rose-50 border-rose-500 text-rose-800' 
                    : 'bg-amber-50 border-amber-500 text-amber-800'
                }`}
              >
                <p className="font-bold">{n.titre}</p>
                <p>{n.message}</p>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-slate-400 text-sm">Aucune alerte à signaler.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Historique des ventes</h3>
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
                <tr >
                  <td className="px-6 py-4">!</td>
                  <td className="px-6 py-4 text-blue-600 font-medium">2</td>
                  <td className="px-6 py-4">20</td>
                  <td className="px-6 py-4">20</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600">
                    20/09/2023
                  </td>
                </tr>
            </tbody>
          </table>

        </Card>
      </div>
    </div>
  );
};