"use client";

import React from 'react';
import { 
  Bird, Wallet, Wheat, AlertCircle, TrendingUp,
  ClipboardList, ShoppingCart
} from 'lucide-react';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Assuming these components are styled appropriately (e.g., Shadcn UI)
// For this theme, make sure the default 'primary' color is a shade of green/emerald.
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {

  const onOpenModal = (type: string) => {
    // Logique pour ouvrir un modal (non implémentée ici)
    console.log("Modal demandé :", type);
  };

  // MOCK DATA
  const totalPoulets = 3500;
  const solde = 560000;
  const totalStock = 890;
  const unreadAlerts = 3;

  const notifications = [
    { id: 1, titre: "Mortalité élevée", message: "Vous avez enregistré 5 pertes aujourd’hui.", niveau: "URGENT" },
    { id: 2, titre: "Stock faible", message: "Le stock d’aliment est presque épuisé.", niveau: "WARN" },
    { id: 3, titre: "Température élevée", message: "La température dans le bâtiment 2 est trop haute.", niveau: "WARN" },
  ];

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
    // 'overflow-y-auto' permet le défilement vertical (coulissant)
    // 'bg-gray-50' ou 'bg-white' pour le fond blanc général
    <div className="space-y-6 animate-fadeIn p-6 min-h-screen bg-gray-50 overflow-y-auto">
      
      {/* 1. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Poulets Actifs - Bleu -> Vert Sarcelle/Emeraude */}
        <Card className="p-4 flex items-center justify-between bg-white h-32 shadow-md hover:shadow-lg transition duration-300 ">
          <div className='flex items-center justify-between w-full'>
            <div>
              <p className="text-sm text-slate-500 pb-4">Quantites de Poulets</p>
              <p className="text-2xl font-bold text-emerald-600">{totalPoulets}</p>
            </div>
            <Bird size={26} className="text-emerald-500" />
          </div>
        </Card>

        {/* Solde Actuel - Vert Clair -> Vert Forêt */}
        <Card className="p-4 flex items-center justify-between bg-white h-32 shadow-md hover:shadow-lg transition duration-300 ">
          <div className='flex items-center justify-between w-full'>
            <div>
              <p className="text-sm text-slate-500 pb-4">Solde Actuel</p>
              <p className="text-2xl font-bold text-emerald-800">
                {solde.toLocaleString()} FCFA
              </p>
            </div>
            <Wallet size={26} className="text-emerald-700" />
          </div>
          
        </Card>

        {/* Stock Aliment Total - Ambre (Or) */}
        <Card className="p-4 flex items-center justify-between bg-white h-32 shadow-md hover:shadow-lg transition duration-300 ">
          <div className='flex items-center justify-between w-full'>
            <div>
              <p className="text-sm text-slate-500 pb-4">Stock Aliment Total</p>
              <p className="text-2xl font-bold text-amber-700">{totalStock} kg</p>
            </div>
            <Wheat size={26} className="text-amber-600" />
          </div>
          
        </Card>

        {/* Alertes - Violet/Rose -> Or / Rouge (pour l'urgence) */}
        <Card className="p-4 flex items-center justify-between bg-white h-32 shadow-md hover:shadow-lg transition duration-300 ">
          <div className='flex items-center justify-between w-full'>
            <div>
              <p className="text-sm text-slate-500 pb-4">Alertes</p>
              <p className="text-2xl font-bold text-red-600">{unreadAlerts}</p>
            </div>
            <AlertCircle size={26} className="text-red-500" />
          </div>
          
        </Card>
      </div>

      {/* 2. CHARTS + ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Mortalité - Graphique */}
        <Card className="lg:col-span-2 p-6 shadow-lg bg-white">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-700">
            <TrendingUp size={20} className="text-emerald-500" />
            Performance Mortalité
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7e5" /> {/* Ligne de grille plus claire */}
                <XAxis dataKey="jour" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="mortalite" 
                  barSize={40}
                  fill="#facc15" // Couleur Or
                  radius={[4,4,0,0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ACTIONS RAPIDES & Alertes */}
        <Card className="p-6 shadow-lg bg-white">
          <h3 className="text-xl font-bold mb-4 text-emerald-700">Actions Rapides</h3>

          <div className="space-y-3">
            {/* Bouton Principal - Utilisation d'une nuance de vert/émeraude */}
            <Button 
              className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => onOpenModal("NEW_SUIVI")}
            >
              <ClipboardList size={18} className="mr-2" />
              Saisir suivi quotidien
            </Button>

            {/* Autres Boutons - Peut rester gris ou utiliser un vert secondaire */}
            <Button 
              variant="outline" // Utilisation de l'outline pour différencier
              className="w-full justify-start border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              onClick={() => onOpenModal("NEW_VENTE")}
            >
              <ShoppingCart size={18} className="mr-2" />
              Nouvelle Vente
            </Button>

            <Button 
              variant="outline"
              className="w-full justify-start border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              onClick={() => onOpenModal("ADD_STOCK")}
            >
              <Wheat size={18} className="mr-2" />
              Réapprovisionner
            </Button>
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4 text-emerald-700">Alertes Récentes</h3>

          <div className="space-y-2">
            {notifications.map(n => (
              <div 
                key={n.id}
                className={`p-3 rounded-lg text-sm border-l-4 ${
                  n.niveau === 'URGENT'
                    ? 'bg-red-50 border-red-500 text-red-700' // Urgent reste rouge vif pour l'impact
                    : 'bg-amber-50 border-amber-500 text-amber-800' // Avertissement en Or/Ambre
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

export default Index;