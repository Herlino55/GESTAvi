"use client";

import React, { useState } from "react";
import Navbar from "@/components/layouts/navbar";
import SideBar from "@/components/layouts/sidebar";
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
      quantite_actuelle: 470,
    },
    {
      id: 2,
      code: "LOT-002",
      batiment_nom: "Bloc B",
      statut: "VENDU",
      quantite_initiale: 300,
      quantite_actuelle: 0,
    },
  ]);

  const openModal = (type: string, id?: number) => {
    console.log("Ouverture du modal :", type, "lot:", id);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
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
