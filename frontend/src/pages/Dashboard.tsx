import React from 'react';
import { 
  Bird, Wallet, Wheat, AlertCircle, TrendingUp, 
  ClipboardList, ShoppingCart 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface DashboardProps {
  onOpenModal: (modalType: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenModal }) => {

  // 🔥 MOCK DATA (plus de backend)
  const totalPoulets = 3500;
  const solde = 560000;
  const totalStock = 890;
  const unreadAlerts = 3;

  const notifications = [
    { id: 1, titre: "Mortalité élevée", message: "Vous avez enregistré 5 pertes aujourd’hui.", niveau: "URGENT" },
    { id: 2, titre: "Stock faible", message: "Le stock d’aliment est presque épuisé.", niveau: "WARN" },
    { id: 3, titre: "Température élevée", message: "La température dans le bâtiment 2 est trop haute.", niveau: "WARN" },
  ];

  

  // Données du graphique
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
            <Bird size={26} />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between gap-4 bg-white h-32">
          <div>
            <p className="text-sm text-slate-500 pb-4">Solde Actuel</p>
            <p className="text-2xl font-bold text-emerald-700">{solde.toLocaleString()} FCFA</p>
          </div>
          <div className="p-3 text-emerald-600">
            <Wallet size={26} />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between gap-4 bg-white h-32">
          <div>
            <p className="text-sm text-slate-500 pb-4">Stock Aliment Total</p>
            <p className="text-2xl font-bold text-slate-800">{totalStock} kg</p>
          </div>
          <div className="p-3 text-amber-600">
            <Wheat size={26} />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between gap-4 bg-white h-32">
          <div>
            <p className="text-sm text-slate-500 pb-4">Alertes</p>
            <p className="text-2xl font-bold text-rose-600">{unreadAlerts}</p>
          </div>
          <div className="p-3 text-purple-600">
            <AlertCircle size={26} />
          </div>
        </Card>
      </div>

      {/* Charts */}
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
                  fill="#e4aa0b" 
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
              onClick={() => onOpenModal('NEW_SUIVI')}
            >
              <ClipboardList className="mr-2" size={18} />
              Saisir suivi quotidien
            </Button>

            <Button 
              className="w-full justify-start"
              onClick={() => onOpenModal('NEW_VENTE')}
            >
              <ShoppingCart className="mr-2" size={18} />
              Nouvelle Vente
            </Button>

            <Button 
              className="w-full justify-start"
              onClick={() => onOpenModal('ADD_STOCK')}
            >
              <Wheat className="mr-2" size={18} />
              Réapprovisionner
            </Button>
          </div>

          <h3 className="text-lg font-bold mt-8 mb-4">Alertes Récentes</h3>

          <div className="space-y-2">
            {notifications.map(n => (
              <div 
                key={n.id}
                className={`p-3 rounded-lg text-sm border-l-4 ${
                  n.niveau === 'URGENT'
                    ? 'bg-rose-50 border-rose-500 text-rose-700'
                    : 'bg-amber-50 border-amber-500 text-amber-800'
                }`}
              >
                <p className="font-bold">{n.titre}</p>
                <p>{n.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
};
