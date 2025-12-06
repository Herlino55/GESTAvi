/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getProduct } from "@/dal/product/get-produt";
import { CreateShop } from "@/dal/shop/create.shop";
import { useAuthStore } from "@/stores";
import Image from "next/image";
import { useEffect, useState } from "react";
import  StatsService  from "@/services/statsService/stats.service"
import { AlertCircle, LineChart, TrendingUp } from "lucide-react";
import { ApiResponse, ChartData as ChartDatas } from "@/types/apiResponses";

export default function Dashboard() {
  const [stats, setStats] = useState<any>();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDatas>();

  useEffect(() => {
    const loadData = async () => {
      try {
         const { company } = useAuthStore();
         if(!company){
            return;
         }
        const [activeUsers, balance, allAlerts] = await Promise.all([
          await StatsService.getAllUserActif(company.id),
          StatsService.getSumCommande(company.id),
          StatsService.getAllAlerts(company.id),
        ]);

        setStats({
          activeUsers,
          balance,
          stock: StatsService.getStockTotal(company.id),
        });
        setAlerts(allAlerts.data);
        setChartData((await StatsService.getMortalityChart(company.id)).data);
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#fafaf8' }}>
        <div className="text-center">
          <div className="text-2xl font-semibold" style={{ color: '#d4af37' }}>
            Chargement...
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  /*return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#fafaf8' }}>
      // SIDEBAR - Desktop 
      <div className="hidden lg:flex lg:w-64 flex-col shadow-lg" style={{ backgroundColor: '#1a4d2e' }}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#d4af37' }}>
              <span className="font-bold text-lg" style={{ color: '#1a4d2e' }}>
                F
              </span>
            </div>
            <span className="text-xl font-bold text-white">FermeApp</span>
          </div>

          <nav className="space-y-2">
            {[
              { icon: '📊', label: 'Tableau de bord' },
              { icon: '🏠', label: 'Bâtiments' },
              { icon: '📦', label: 'Gestion des Lots' },
              { icon: '📈', label: 'Suivi Quotidien' },
              { icon: '🍗', label: 'Stock Aliments' },
              { icon: '🛒', label: 'Ventes' },
              { icon: '💰', label: 'Finances' },
              { icon: '⚙️', label: 'Administration' },
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  i === 0
                    ? 'text-white'
                    : 'text-gray-300 hover:bg-opacity-50'
                }`}
                style={i === 0 ? { backgroundColor: '#d4af37', color: '#1a4d2e' } : {}}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
          <div className="space-y-2">
            <button
              className="w-full px-4 py-3 rounded-lg text-left text-sm transition"
              style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#d4af37' }}
            >
              👤 Patron Admin
            </button>
            <button className="w-full px-4 py-2 text-red-400 hover:text-red-300 transition text-sm">
              Déconnexion
            </button>
            <button
              onClick={() => setUseApi(!useApi)}
              className="w-full px-2 py-2 rounded hover:opacity-90 transition text-xs text-white"
              style={{ backgroundColor: '#d4af37' }}
            >
              {useApi ? '🔴 API' : '🟢 Mock'} Toggle
            </button>
          </div>
        </div>
      </div>

      // SIDEBAR - Mobile 
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 z-50 w-64 h-screen flex flex-col transform transition-transform lg:hidden shadow-lg ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#1a4d2e' }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#d4af37' }}>
                <span className="font-bold text-lg" style={{ color: '#1a4d2e' }}>
                  F
                </span>
              </div>
              <span className="text-xl font-bold text-white">FermeApp</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} className="text-white" />
            </button>
          </div>

          <nav className="space-y-2">
            {[
              { icon: '📊', label: 'Tableau de bord' },
              { icon: '🏠', label: 'Bâtiments' },
              { icon: '📦', label: 'Gestion des Lots' },
              { icon: '📈', label: 'Suivi Quotidien' },
              { icon: '🍗', label: 'Stock Aliments' },
              { icon: '🛒', label: 'Ventes' },
              { icon: '💰', label: 'Finances' },
              { icon: '⚙️', label: 'Administration' },
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full text-left px-4 py-3 rounded-lg transition text-sm ${
                  i === 0 ? 'text-white' : 'text-gray-300 hover:bg-opacity-50'
                }`}
                style={i === 0 ? { backgroundColor: '#d4af37', color: '#1a4d2e' } : {}}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
          <div className="space-y-2">
            <button
              className="w-full px-4 py-3 rounded-lg text-left text-sm transition"
              style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#d4af37' }}
            >
              👤 Patron Admin
            </button>
            <button className="w-full px-4 py-2 text-red-400 hover:text-red-300 transition text-sm">
              Déconnexion
            </button>
            <button
              onClick={() => setUseApi(!useApi)}
              className="w-full px-2 py-2 rounded hover:opacity-90 transition text-xs text-white"
              style={{ backgroundColor: '#d4af37' }}
            >
              {useApi ? '🔴 API' : '🟢 Mock'} Toggle
            </button>
          </div>
        </div>
      </div>

      // MAIN CONTENT 
      <div className="flex-1 flex flex-col w-full">
        // HEADER 
        <div
          className="border-b p-4 lg:p-8 flex justify-between items-center shadow-sm"
          style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e0' }}
        >
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg transition"
              style={{ color: '#1a4d2e' }}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: '#1a4d2e' }}>
              Tableau de bord
            </h1>
          </div>
          <div className="text-xs lg:text-sm" style={{ color: '#7d7d7a' }}>
            jeudi 4 décembre
          </div>
        </div>

        // SCROLLABLE CONTENT 
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          //KPI CARDS 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div
              className="p-4 lg:p-6 rounded-xl shadow-sm border hover:shadow-md transition"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e0' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Package className="flex-shrink-0" size={20} style={{ color: '#d4af37' }} />
                <span className="text-xs lg:text-sm" style={{ color: '#7d7d7a' }}>
                  Poulets Actifs
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold" style={{ color: '#1a4d2e' }}>
                {stats?.activeUsers}
              </div>
            </div>

            <div
              className="p-4 lg:p-6 rounded-xl shadow-sm border hover:shadow-md transition"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e0' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="flex-shrink-0" size={20} style={{ color: '#d4af37' }} />
                <span className="text-xs lg:text-sm" style={{ color: '#7d7d7a' }}>
                  Solde Actuel
                </span>
              </div>
              <div
                className="text-2xl lg:text-3xl font-bold"
                style={{ color: stats?.balance < 0 ? '#d32f2f' : '#2e7d32' }}
              >
                {formatCurrency(stats?.balance)}
              </div>
            </div>

            <div
              className="p-4 lg:p-6 rounded-xl shadow-sm border hover:shadow-md transition"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e0' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="flex-shrink-0" size={20} style={{ color: '#d4af37' }} />
                <span className="text-xs lg:text-sm" style={{ color: '#7d7d7a' }}>
                  Stock Aliment
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold" style={{ color: '#1a4d2e' }}>
                {stats?.stock} kg
              </div>
            </div>

            <div
              className="p-4 lg:p-6 rounded-xl shadow-sm border hover:shadow-md transition"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e0' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="flex-shrink-0" size={20} style={{ color: '#d4af37' }} />
                <span className="text-xs lg:text-sm" style={{ color: '#7d7d7a' }}>
                  Alertes
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold" style={{ color: '#1a4d2e' }}>
                {alerts.length}
              </div>
            </div>
          </div>

          // CHART + ACTIONS 
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
            // CHART 
            <div
              className="lg:col-span-2 p-4 lg:p-6 rounded-xl shadow-sm border"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e0' }}
            >
              <h2 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6 flex items-center gap-2" style={{ color: '#1a4d2e' }}>
                <TrendingUp size={20} className="flex-shrink-0" style={{ color: '#d4af37' }} />
                Performance Mortalité
              </h2>
              <div className="overflow-x-auto">
                <ResponsiveContainer width="100%" height={250} minWidth={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e0" />
                    <XAxis dataKey="jour" stroke="#7d7d7a" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#7d7d7a" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a4d2e',
                        border: '2px solid #d4af37',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="taux"
                      stroke="#d4af37"
                      dot={{ fill: '#d4af37', r: 5 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            // QUICK ACTIONS 
            <div
              className="p-4 lg:p-6 rounded-xl shadow-sm border"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e0' }}
            >
              <h2 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6" style={{ color: '#1a4d2e' }}>
                Actions Rapides
              </h2>
              <div className="space-y-3">
                <button
                  className="w-full text-white py-2 lg:py-3 rounded-lg font-medium transition text-sm flex items-center justify-center gap-2 hover:opacity-90"
                  style={{ backgroundColor: '#d4af37' }}
                >
                  <span>📊</span>
                  <span className="hidden sm:inline">Saisir suivi quotidien</span>
                  <span className="sm:hidden">Suivi quotidien</span>
                </button>
                <button
                  className="w-full py-2 lg:py-3 rounded-lg font-medium transition text-sm flex items-center justify-center gap-2 border-2 hover:opacity-90"
                  style={{ borderColor: '#1a4d2e', color: '#1a4d2e' }}
                >
                  <span>🛒</span>
                  <span className="hidden sm:inline">Nouvelle Vente</span>
                  <span className="sm:hidden">Vente</span>
                </button>
                <button
                  className="w-full py-2 lg:py-3 rounded-lg font-medium transition text-sm flex items-center justify-center gap-2 border-2 hover:opacity-90"
                  style={{ borderColor: '#1a4d2e', color: '#1a4d2e' }}
                >
                  <span>📦</span>
                  <span className="hidden sm:inline">Réapprovisionner</span>
                  <span className="sm:hidden">Approvis.</span>
                </button>
              </div>
            </div>
          </div>

          // ALERTS 
          <div
            className="p-4 lg:p-6 rounded-xl shadow-sm border"
            style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e0' }}
          >
            <h2 className="text-base lg:text-lg font-semibold mb-4" style={{ color: '#1a4d2e' }}>
              Alertes Récentes
            </h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 lg:p-4 rounded-lg border-l-4"
                  style={{
                    backgroundColor: alert.type === 'critical' ? '#ffebee' : '#fff8e1',
                    borderColor: alert.type === 'critical' ? '#d32f2f' : '#f9a825',
                  }}
                >
                  <div
                    className="font-semibold text-sm lg:text-base"
                    style={{ color: alert.type === 'critical' ? '#d32f2f' : '#f9a825' }}
                  >
                    {alert.title}
                  </div>
                  <div
                    className="text-xs lg:text-sm"
                    style={{ color: alert.type === 'critical' ? '#b71c1c' : '#f57f17' }}
                  >
                    {alert.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );*/
}