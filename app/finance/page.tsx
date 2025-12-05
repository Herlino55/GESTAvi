"use client";

import React, { useState } from "react";
import Navbar from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";
import { Finances } from "@/components/layouts/finance";

export default function FinancesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 👉 Données temporaires (mock)
  const [transactions] = useState([
    {
      id: 1,
      date: "2025-01-13",
      description: "Vente poulets",
      categorie: "Vente",
      montant: 150000,
      type: "RECETTE",
    },
    {
      id: 2,
      date: "2025-01-14",
      description: "Achat d’aliments",
      categorie: "Nutrition",
      montant: 50000,
      type: "DEPENSE",
    },
    {
      id: 3,
      date: "2025-01-15",
      description: "Vaccins volailles",
      categorie: "Santé",
      montant: 20000,
      type: "DEPENSE",
    },
  ]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Contenu qui scroll */}
        <div className="p-6 overflow-y-auto">
          <Finances transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
