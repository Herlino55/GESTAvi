import { Home, Building2, Wheat, LogOut } from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const menuItems = [
        { icon: Home, label: "Tableau de bord", active: false },
        { icon: Building2, label: "Batiments", active: true },
        { icon: Wheat, label: "Aliments", active: false },
        { icon: Wheat, label: "Aliments", active: false },
        { icon: Wheat, label: "Aliments", active: false },
        { icon: Wheat, label: "Aliments", active: false },
        { icon: Wheat, label: "Aliments", active: false },
        { icon: Wheat, label: "Aliments", active: false },
        { icon: Wheat, label: "Aliments", active: false },
        { icon: Wheat, label: "Aliments", active: false },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
          fixed md:static inset-y-0 left-0 z-30
          w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    {/* Placeholder for Logo if needed, or just Title */}
                    <div className="flex items-center gap-2 font-bold text-xl text-green-800">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            🐓
                        </div>
                        GestAvi
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${item.active
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
              `}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-gray-100">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={18} />
                        Déconnexion
                    </button>
                </div>
            </aside>
        </>
    );
}
