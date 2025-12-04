import React from 'react';
import { 
  LayoutDashboard, Home, Bird, ClipboardList, Wheat, 
  ShoppingCart, Wallet, LogOut, X, Users, LucideIcon
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import logo from "../../../public/images/logo2.jpg"

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  roles: string[];
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['ADMIN', 'SECRETAIRE', 'EMPLOYE'] },
  { id: 'batiments', label: 'Bâtiments', icon: Home, roles: ['ADMIN', 'SECRETAIRE'] },
  { id: 'lots', label: 'Gestion des Lots', icon: Bird, roles: ['ADMIN', 'SECRETAIRE', 'EMPLOYE'] },
  { id: 'suivi', label: 'Suivi Quotidien', icon: ClipboardList, roles: ['ADMIN', 'SECRETAIRE', 'EMPLOYE'] },
  { id: 'aliments', label: 'Stock Aliments', icon: Wheat, roles: ['ADMIN', 'SECRETAIRE'] },
  { id: 'ventes', label: 'Ventes', icon: ShoppingCart, roles: ['ADMIN', 'SECRETAIRE'] },
  { id: 'finances', label: 'Finances', icon: Wallet, roles: ['ADMIN', 'SECRETAIRE'] },
  { id: 'admin', label: 'Administration', icon: Users, roles: ['ADMIN'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const { currentUser, logout } = useAuthStore();

  if (!currentUser) return null;

  return (
    <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 text-gray-500 text-sm transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="h-16 flex items-center px-6 gap-3">
        <span className="font-bold text-xl text-white">
          <img src={logo} alt="logo" width={150} height={150} />
        </span>
        <button 
          onClick={() => setSidebarOpen(false)} 
          className="ml-auto lg:hidden text-slate-400"
        >
          <X size={20} />
        </button>
      </div>
      
      <nav className="p-4 space-y-1">
        {MENU_ITEMS.filter(item => item.roles.includes(currentUser.role)).map(item => (
          <button
            key={item.id}
            onClick={() => { 
              setActiveTab(item.id); 
              setSidebarOpen(false); 
            }}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
              activeTab === item.id 
                ? 'text-primary' 
                : ' hover:text-primary'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 bg-white">
        {/* <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full ${currentUser.avatar_color} flex items-center justify-center text-white font-bold`}>
            {currentUser.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-black truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
          </div>
        </div> */}
        <button 
          onClick={logout} 
          className="w-full flex items-center gap-3 px-4 py-2 rounded  hover:bg-primary text-black hover:text-white text-sm transition-colors"
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    </aside>
  );
};