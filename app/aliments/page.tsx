"use client";

import React, { useState } from "react";
import Navbar from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";
import { Aliments } from "@/components/layouts/aliments";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [aliments, setAliments] = useState([
    {
    "id": 1,
    "nom": "Maïs",
    "unité": "Tonnes",
    "stock_actuel": 250,
    "seuil_alerte": 180,
    "seuil_critique": 90,
    "statut": "Normal"
  },
  {
    "id": 2,
    "nom": "Soja",
    "unité": "Tonnes",
    "stock_actuel": 100,
    "seuil_alerte": 80,
    "seuil_critique": 40,
    "statut": "Alerte"
  },
  {
    "id": 3,
    "nom": "Concentré Minéral Vitaminé (CMV)",
    "unité": "Sacs (25kg)",
    "stock_actuel": 30,
    "seuil_alerte": 40,
    "seuil_critique": 20,
    "statut": "Critique"
  },
  {
    "id": 5,
    "nom": "Blé / Sorgho",
    "unité": "Tonnes",
    "stock_actuel": 75,
    "seuil_alerte": 90,
    "seuil_critique": 45,
    "statut": "Alerte"
  }
  ]);

  const openModal = (type: string) => {
    console.log("Modal :", type);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="p-6">
            <Aliments aliments={aliments} onOpenModal={openModal} />
        </div>
        
      </div>
    </div>
  );
}
