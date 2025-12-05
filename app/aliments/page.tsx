"use client";

import React, { useState } from "react";
import Navbar from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";
import { Aliments } from "@/components/layouts/aliments";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [aliments, setAliments] = useState([
    { id: 1, nom: "Maïs", stock_actuel: 120, seuil_alerte: 80, seuil_critique: 40 },
    { id: 2, nom: "Soja", stock_actuel: 50, seuil_alerte: 40, seuil_critique: 20 },
    { id: 3, nom: "CMV", stock_actuel: 10, seuil_alerte: 20, seuil_critique: 10 },
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

        <Aliments aliments={aliments} onOpenModal={openModal} />
      </div>
    </div>
  );
}
