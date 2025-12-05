"use client";

import React from "react";
import Navbar from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";
import Index from "@/components/layouts/index";


export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <Index />
        </div>
    </div>
  );
}
