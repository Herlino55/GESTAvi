"use client";

import React, { useState } from "react";
import Navbar from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";
import { Ventes } from "@/components/layouts/ventes";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [ventes, setVentes] = useState([
    {
      id: 1,
      date: "2025-02-01",
      lot_code: "LOT-001",
      quantite: 50,
      prix_unitaire: 1800,
      montant_total: 90000,
    },
  ]);

  const openModal = (type: string) => {
    console.log("Modal :", type);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="p-6">
            <Ventes ventes={ventes} onOpenModal={openModal} />
        </div>
        
      </div>
    </div>
  );
}
