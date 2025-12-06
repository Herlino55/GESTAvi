"use client";

import React, { useState } from "react";
import Navbar from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";
import { Lots } from "@/components/layouts/lots";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 👉 DONNÉES EXEMPLE pour les LOTS
  const [lots, setLots] = useState([
    {
      id: 1,
      code: "LOT-001",
      batiment_nom: "Bloc A",
      statut: "EN_COURS",
      quantite_initiale: 500,
      quantite_actuelle: 481,
      prix_total: 150000
    },
    {
      id: 2,
      code: "LOT-002",
      batiment_nom: "Bloc B",
      statut: "VENDU",
      quantite_initiale: 300,
      quantite_actuelle: 0,
      prix_total: 150000
   },
    {
      id: 3,
      code: "LOT-003",
      batiment_nom: "Bloc C",
      statut: "EN_COURS",
      quantite_initiale: 600,
      quantite_actuelle: 370,
      prix_total: 150000
    },
    {
      id: 4,
      code: "LOT-004",
      batiment_nom: "Bloc D",
      statut: "VENDU",
      quantite_initiale: 300,
      quantite_actuelle: 0,
 
 prix_total: 150000   },
    {
      id: 5,
      code: "LOT-005",
      batiment_nom: "Bloc E",
      statut: "VENDU",
      quantite_initiale: 800,
      quantite_actuelle: 0,
      prix_total: 150000
   },
    {
      id: 6,
      code: "LOT-006",
      batiment_nom: "Bloc F",
      statut: "VENDU",
      quantite_initiale: 200,
      quantite_actuelle: 0,
      prix_total: 150000
   },
    {
      id: 7,
      code: "LOT-007",
      batiment_nom: "Bloc G",
      statut: "EN_COURS",
      quantite_initiale: 500,
      quantite_actuelle: 170,
      prix_total: 150000
    },
  ]);

  const openModal = (type: string, id?: number) => {
    console.log("Ouverture du modal :", type, "lot:", id);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* 👉 ENVOI CORRECT POUR LES LOTS */}
        <div className="p-6">
            <Lots 
            onOpenModal={openModal}
            lots={lots}
            currentUserRole="ADMIN"
            />
        </div>
        
      </div>
    </div>
  );
}
