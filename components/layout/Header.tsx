'use client';

import { useAuthStore } from "@/stores";
import { Button } from '@/components/ui/button';
import { Bell, Settings } from 'lucide-react';

interface HeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function Header({ title, description, action }: HeaderProps) {
  const { company } = useAuthStore();

  return (
    <div className="border-b bg-white dark:bg-slate-950 sticky top-0 z-10">
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {action}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
