"use client";

import React, { useState } from "react";
import Navbar from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";
import { Suivi } from "@/components/layouts/suivi";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 👉 Données temporaires
  const [suivis, setSuivis] = useState([
    {
      id: 1,
      date: "2024-06-01",
      lot_code: "LOT-01",
      mortalite: 3,
      aliment_distribue_kg: 12,
      aliment_nom: "Maïs",
      observateur: "Jean",
    },
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

        {/* 👉 Correction ici */}
        <Suivi suivis={suivis} onOpenModal={openModal} />
      </div>
    </div>
  );
}
