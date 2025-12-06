"use client";

import React, { useState } from "react";
import Navbar from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";
import { Ventes } from "@/components/layouts/ventes";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [ventes, setVentes] = useState([
    {
    "id": 1,
    "date": "2025-02-01",
    "lot_code": "LOT-001",
    "quantite": 50,
    "prix_unitaire": 1800,
    "montant_total": 90000
  },
  {
    "id": 2,
    "date": "2025-02-05",
    "lot_code": "LOT-001",
    "quantite": 120,
    "prix_unitaire": 1800,
    "montant_total": 216000
  },
  {
    "id": 3,
    "date": "2025-02-15",
    "lot_code": "LOT-002",
    "quantite": 250,
    "prix_unitaire": 1750,
    "montant_total": 437500
  },
  {
    "id": 4,
    "date": "2025-02-18",
    "lot_code": "LOT-001",
    "quantite": 85,
    "prix_unitaire": 1820,
    "montant_total": 154700
  },
  {
    "id": 5,
    "date": "2025-02-28",
    "lot_code": "LOT-002",
    "quantite": 300,
    "prix_unitaire": 1750,
    "montant_total": 525000
  },
  {
    "id": 6,
    "date": "2025-03-03",
    "lot_code": "LOT-003",
    "quantite": 40,
    "prix_unitaire": 1900,
    "montant_total": 76000
  },
  {
    "id": 7,
    "date": "2025-03-10",
    "lot_code": "LOT-002",
    "quantite": 150,
    "prix_unitaire": 1780,
    "montant_total": 267000
  },
  {
    "id": 8,
    "date": "2025-03-12",
    "lot_code": "LOT-003",
    "quantite": 210,
    "prix_unitaire": 1900,
    "montant_total": 399000
  },
  {
    "id": 9,
    "date": "2025-03-20",
    "lot_code": "LOT-003",
    "quantite": 95,
    "prix_unitaire": 1950,
    "montant_total": 185250
  }
  ]);

  const openModal = (type: string) => {
    console.log("Modal :", type);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="p-6">
            <Ventes ventes={ventes} onOpenModal={openModal} />
        </div>
        
      </div>
    </div>
  );
}
