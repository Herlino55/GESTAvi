// app/dashboard/page.tsx (ou index.tsx)

"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";
// Le composant Batiments doit gérer toute la logique d'affichage, d'ajout et de suppression
import { BatimentsGestion } from "@/components/layouts/batiment"; 

// Interface pour typer correctement l'objet Bâtiment
interface Batiment {
  id: number;
  nom: string;
  statut: 'ACTIF' | 'INACTIF';
  occupation_actuelle: number;
  capacite_max: number;
}

// Données statiques initiales pour la première exécution
const initialBatiments = [
  { id: 1, nom: "Bloc A", statut: "ACTIF" as const, occupation_actuelle: 120, capacite_max: 200 },
  { id: 2, nom: "Bloc B", statut: "INACTIF" as const, occupation_actuelle: 0, capacite_max: 150 },
  { id: 3, nom: "Bloc C", statut: "ACTIF" as const, occupation_actuelle: 20, capacite_max: 200 },
  { id: 4, nom: "Bloc D", statut: "ACTIF" as const, occupation_actuelle: 50, capacite_max: 150 },
  { id: 5, nom: "Bloc E", statut: "ACTIF" as const, occupation_actuelle: 120, capacite_max: 200 },
  { id: 6, nom: "Bloc F", statut: "INACTIF" as const, occupation_actuelle: 0, capacite_max: 150 },
  { id: 7, nom: "Bloc G", statut: "ACTIF" as const, occupation_actuelle: 120, capacite_max: 200 },
  { id: 8, nom: "Bloc H", statut: "INACTIF" as const, occupation_actuelle: 0, capacite_max: 150 },
];

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [batiments, setBatiments] = useState<Batiment[]>([]);

  // 1. Charger les données depuis localStorage au montage
  useEffect(() => {
    const storedBatiments = localStorage.getItem('batiments');
    if (storedBatiments) {
      setBatiments(JSON.parse(storedBatiments));
    } else {
      // Si aucune donnée, utiliser les données initiales et les sauvegarder
      setBatiments(initialBatiments);
      localStorage.setItem('batiments', JSON.stringify(initialBatiments));
    }
  }, []);

  // 2. Fonction pour ajouter un nouveau bâtiment
  const addBatiment = (newBatiment: Omit<Batiment, 'id' | 'statut' | 'occupation_actuelle'>) => {
    const batiment: Batiment = {
      id: Date.now(), // ID unique simple
      nom: newBatiment.nom,
      capacite_max: newBatiment.capacite_max,
      occupation_actuelle: 0, // Nouveau bâtiment commence toujours à 0
      statut: 'INACTIF', // Nouveau bâtiment est inactif par défaut
    };

    const updatedBatiments = [...batiments, batiment];
    setBatiments(updatedBatiments);
    localStorage.setItem('batiments', JSON.stringify(updatedBatiments));
  };

  // 3. Fonction pour supprimer un bâtiment
  const deleteBatiment = (id: number) => {
    const updatedBatiments = batiments.filter(bat => bat.id !== id);
    setBatiments(updatedBatiments);
    localStorage.setItem('batiments', JSON.stringify(updatedBatiments));
  };


  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="p-6">
            {/* On passe les données et les fonctions de gestion */}
            <BatimentsGestion 
              batiments={batiments}
              addBatiment={addBatiment}
              deleteBatiment={deleteBatiment}
            />
        </div>
      </div>
    </div>
  );
}