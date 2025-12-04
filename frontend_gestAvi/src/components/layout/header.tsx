import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useFarmStore } from '../../stores/useFarmStore';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const notifications = useFarmStore(state => state.notifications);
  const unreadCount = notifications.filter(n => !n.lue).length;

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 z-20">
      <button 
        onClick={() => setSidebarOpen(true)} 
        className="lg:hidden text-slate-600"
      >
        <Menu size={24} />
      </button>
      
      <div className="ml-auto flex items-center gap-4">
        <div className="relative group">
          <Bell 
            size={20} 
            className={`cursor-pointer transition-colors ${
              unreadCount > 0 
                ? 'text-rose-500 animate-pulse' 
                : 'text-slate-400'
            }`} 
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
              {unreadCount}
            </span>
          )}
          
          {/* Dropdown Notifs */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-xl rounded-xl border border-slate-100 hidden group-hover:block p-2 z-50">
            <h4 className="font-bold text-xs uppercase text-slate-400 mb-2 px-2">
              Notifications
            </h4>
            {notifications.length === 0 ? (
              <p className="text-sm p-2 text-slate-500">Rien à signaler</p>
            ) : (
              notifications.slice(0, 5).map(n => (
                <div 
                  key={n.id} 
                  className="p-2 hover:bg-slate-50 rounded border-b border-slate-50 last:border-0"
                >
                  <p className={`text-xs font-bold ${
                    n.niveau === 'URGENT' ? 'text-rose-600' : 'text-amber-600'
                  }`}>
                    {n.titre}
                  </p>
                  <p className="text-xs text-slate-600">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="h-6 w-px bg-slate-200" />
        
        <div className="text-right hidden sm:block">
          <p className="text-xs text-slate-400">Date du jour</p>
          <p className="text-sm font-bold text-slate-700">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </p>
        </div>
      </div>
    </header>
  );
};