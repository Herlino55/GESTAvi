"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Scale, Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: number;
  date: string;
  description: string;
  categorie: string;
  montant: number;
  type: "RECETTE" | "DEPENSE";
}

interface FinancesProps {
  transactions: Transaction[];
}

// Nouvelle palette de couleurs basée sur le thème Vert/Or/Rouge (pour les dépenses)
const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#6b7280"]; // Emerald, Amber, Rose, Blue...

export const Finances: React.FC<FinancesProps> = ({ transactions }) => {
  
  // --- CALCULS (Inchangés) ---
  const totalRecettes = transactions
    .filter(t => t.type === "RECETTE")
    .reduce((sum, t) => sum + t.montant, 0);

  const totalDepenses = transactions
    .filter(t => t.type === "DEPENSE")
    .reduce((sum, t) => sum + t.montant, 0);

  const solde = totalRecettes - totalDepenses;

  const depensesParCategorie = transactions
    .filter(t => t.type === "DEPENSE")
    .reduce((acc, t) => {
      acc[t.categorie] = (acc[t.categorie] || 0) + t.montant;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(depensesParCategorie).map(([categorie, montant]) => ({
    categorie,
    montant,
  }));
  // -----------------------------


  return (
    <div className="space-y-8 p-4">
      
      <h1 className="text-3xl font-extrabold text-emerald-700 border-b pb-2">
          💰 Aperçu Financier
      </h1>
      
      {/* 1. KPI CARDS (Résumé) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Recettes (Vert/Emerald) */}
        <Card className="p-6 flex items-center justify-between shadow-lg hover:shadow-xl transition duration-300">
          <div>
            <p className="text-slate-500 text-sm font-semibold pb-2 flex items-center gap-1">
                <TrendingUp size={16} className="text-emerald-500" /> Total Recettes
            </p>
            <p className="text-3xl font-bold text-emerald-600">
                {totalRecettes.toLocaleString()} FCFA
            </p>
          </div>
          <Plus size={36} className="text-emerald-200" />
        </Card>

        {/* Total Dépenses (Rouge/Rose) */}
        <Card className="p-6 flex items-center justify-between shadow-lg hover:shadow-xl transition duration-300">
          <div>
            <p className="text-slate-500 text-sm font-semibold pb-2 flex items-center gap-1">
                <TrendingDown size={16} className="text-rose-500" /> Total Dépenses
            </p>
            <p className="text-3xl font-bold text-rose-600">
                {totalDepenses.toLocaleString()} FCFA
            </p>
          </div>
          <Minus size={36} className="text-rose-200" />
        </Card>

        {/* Bilan Net (Bleu/Thème) */}
        <Card className={`p-6 flex items-center justify-between shadow-lg hover:shadow-xl transition duration-300 border-l-4 ${solde >= 0 ? "border-l-emerald-500" : "border-l-rose-500"}`}>
          <div>
            <p className="text-slate-500 text-sm font-semibold pb-2 flex items-center gap-1">
                <Scale size={16} className="text-blue-500" /> Bilan Net
            </p>
            <p className={`text-3xl font-bold ${solde >= 0 ? "text-blue-600" : "text-rose-600"}`}>
                {solde.toLocaleString()} FCFA
            </p>
          </div>
          <DollarSign size={36} className="text-blue-200" />
        </Card>
      </div>

      {/* 2. Historique + Graphique */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table Historique */}
        <Card className="lg:col-span-2 shadow-xl bg-white">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-lg text-emerald-700">Historique des Transactions Récentes</h3>
          </div>
          <div className="overflow-y-auto max-h-[400px]"> {/* Hauteur augmentée pour le défilement */}
            <table className="w-full text-sm text-left">
              <thead className="bg-emerald-50 text-emerald-800 sticky top-0 border-b border-emerald-100">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="text-center py-8 text-slate-400">
                            Aucune transaction enregistrée.
                        </td>
                    </tr>
                ) : (
                    transactions.map((t, index) => (
                      <tr key={t.id || index} className="hover:bg-gray-50 transition duration-100">
                        <td className="px-4 py-3 text-gray-600">{t.date}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{t.description}</td>
                        <td className="px-4 py-3">
                          <Badge 
                            className={`px-2 py-1 text-xs font-semibold ${
                                t.type === "RECETTE" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {t.categorie}
                          </Badge>
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-bold ${
                            t.type === "RECETTE" ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {t.type === "RECETTE" ? "+" : "-"} {t.montant.toLocaleString()} FCFA
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Graphique Répartition Dépenses */}
        <Card className="p-4 shadow-xl bg-white flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-emerald-700 mb-4">Répartition des Dépenses (Total: {totalDepenses.toLocaleString()} FCFA)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="montant"
                  nameKey="categorie"
                  cx="50%"
                  cy="50%"
                  innerRadius={50} // Pour faire un Doughnut Chart (plus moderne)
                  outerRadius={80}
                  paddingAngle={5}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Montant']} 
                />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};