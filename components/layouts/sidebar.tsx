"use client";

import { 
  Home, Users, Wheat, LogOut, LayoutDashboard, Bird, 
  ClipboardList, ShoppingCart, Wallet 
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname(); // ✅ Next.js native

  const menuItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard" },
    { icon: Home, label: "Batiments", path: "/batiments" },
    { icon: Bird, label: "Lots", path: "/lots" },
    { icon: ClipboardList, label: "Suivi", path: "/suivi" },
    { icon: Wheat, label: "Aliments", path: "/aliments" },
    { icon: ShoppingCart, label: "Ventes", path: "/ventes" },
    { icon: Wallet, label: "Finances", path: "/finances" },
    { icon: Users, label: "Admin", path: "/admin" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 flex flex-col
      `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2 font-bold text-xl text-green-800">
            {/* <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              🐓
            </div>
            GestAvi */}
            <div>
              <img src="/logo2.jpg" alt="" />
            </div>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item, index) => {
            const active = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={index}
                href={item.path}
                className={
                  `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ` +
                  (
                    active
                      ? " text-green-900 border border-green-300"
                      : "text-gray-600 hover:text-green-900"
                  )
                }
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        {/* <div className="p-4 border-t border-gray-100">
          <button onClick={() => {router.push('/landingPage')}} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            Déconnexion
          </button>
        </div> */}
      </aside>
    </>
  );
}
