import { Menu, Bell, Search } from "lucide-react";

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
                >
                    <Menu size={24} />
                </button>

                {/* Breadcrumbs or Page Title */}
                <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
                    Tableau de bord
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Search Bar - Hidden on small mobile */}
                <div className="hidden sm:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="bg-transparent border-none outline-none ml-2 text-sm w-full text-gray-700 placeholder-gray-400"
                    />
                </div>

                {/* Actions */}
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium text-sm">
                    JD
                </div>
            </div>
        </header>
    );
}
