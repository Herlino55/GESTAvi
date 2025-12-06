/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Navbar from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";
import { Batiments } from "@/components/layouts/batiment";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 👉 Données exemple (tu pourras remplacer par ton API)
  const [batiments, setBatiments] = useState<any>([
  {
    id: 1,
    nom: "Bloc A",
    statut: "ACTIF",
    occupation_actuelle: 120,
    capacite_max: 200,
  },
  {
    id: 2,
    nom: "Bloc B",
    statut: "INACTIF",
    occupation_actuelle: 0,
    capacite_max: 150,
  },
]);



  const openModal = (type: string) => {
    console.log("Ouverture du modal :", type);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* 👉 Correction ici */}
        <div className="p-6">
            <Batiments 
              onOpenModal={openModal}
              batiments={batiments}
            />
        </div>
        
      </div>
    </div>
  );
}
