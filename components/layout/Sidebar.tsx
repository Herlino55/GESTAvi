'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Store,
  Users,
  Link2,
  Building2,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Shops', href: '/shops', icon: Store },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Assignments', href: '/assignments', icon: Link2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { company, logout } = useAuthStore();

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 text-slate-100">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-800">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
          <Building2 className="w-6 h-6 text-slate-900" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold truncate">
            {company?.name || 'Company Portal'}
          </h1>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname ? (pathname === item.href || pathname.startsWith(item.href + '/')) : false;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="mb-3 px-3">
          <p className="text-xs font-medium text-slate-400">Signed in as</p>
          <p className="text-sm font-medium text-white truncate mt-1">
            {company?.name}
          </p>
          {company?.handle && (
            <p className="text-xs text-slate-500 truncate">@{company.handle}</p>
          )}
        </div>
        <Separator className="mb-3 bg-slate-800" />
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
