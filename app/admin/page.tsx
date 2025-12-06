"use client";

import React, { useState } from "react";
import Navbar from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";
import { Admin } from "@/components/layouts/admin";

export default function AdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🔹 Fake données (utilisateurs)
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "ADMIN",
      avatar_color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Sarah Smith",
      email: "sarah@example.com",
      role: "SECRETAIRE",
      avatar_color: "bg-green-500",
    },
    {
      id: "3",
      name: "Marc Alain",
      email: "marc@example.com",
      role: "USER",
      avatar_color: "bg-orange-500",
    },
  ]);

  // 🔹 Simule l'utilisateur connecté
  const [currentUser] = useState({
    id: "1",
    name: "John Doe",
    role: "ADMIN",
  });

  // 🔹 Suppression
  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // 🔹 Modal test
  const openModal = (type: string) => {
    console.log("Modal :", type);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* --- Sidebar --- */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* --- Contenu principal --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="p-6">
          <Admin
            users={users}
            currentUser={currentUser}
            deleteUser={deleteUser}
            onOpenModal={openModal}
          />
        </div>
      </div>
    </div>
  );
}
