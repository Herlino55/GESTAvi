"use client";

import React, { useState } from "react";
import Navbar from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";
import Index from "@/components/layouts/index";
import { UiProvider } from "@/stores/ui";
import { LoaderOverlay } from "@/middlewares/ui/loaderOverlay";
import { ToastNotification } from "@/middlewares/ui/toastNotification";

export default function DashboardPage() {

  // 👉 Tu avais oublié ceci !
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
        <UiProvider>
            <LoaderOverlay />
            <ToastNotification />
                {/* Sidebar */}
            <Sidebar 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
                <div className="p-6">
                    <Index />
                </div>
                
            </div>
        </UiProvider>
    </div>
  );
}
