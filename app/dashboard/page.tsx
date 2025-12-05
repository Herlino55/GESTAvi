"use client";

import React from "react";
import Navbar from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";
import Index from "@/components/layouts/index";

export default function DashboardPage() {
  return (
    <div className="font-[var(--font-geist-mono)] box-border ">
        <div className="w-[15%] fixed top-0 left-0 border-r-2 border-gray-200 h-screen p-4 z-1"><Sidebar /></div>
        <div className="w-[85%] float-right py-4 box-border">
            <div className="px-4 border-b-2 border-gray-200">
                <Navbar />
            </div>
            <div className="p-4 bg-gray-0">
                <Index />
            </div>
        </div>
    </div>
  );
}
