'use client';

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { User, LogOut, Package, Heart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const emptySubscribe = () => () => { };

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  if (!mounted || !isAuthenticated) {
    return (
      <Link href="/login">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-transparent"
        >
          <User className="h-5 w-5" />
        </Button>
      </Link>
    );
  }

  const displayName = user?.nombre;

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-transparent"
          >
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        {/* Render without Portal so it positions relative to the trigger */}
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={4}
          className={cn(
            "z-50 w-56 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          <div className="px-2 py-3 border-b border-stone-100">
            <p className="font-medium text-sm">{displayName}</p>
            <p className="text-xs text-stone-500">{user?.email}</p>
          </div>

          <DropdownMenuItem asChild>
            <Link href="/cuenta" className="flex items-center cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              Mi cuenta
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/pedidos" className="flex items-center cursor-pointer">
              <Package className="h-4 w-4 mr-2" />
              Mis pedidos
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/favoritos" className="flex items-center cursor-pointer">
              <Heart className="h-4 w-4 mr-2" />
              Favoritos
            </Link>
          </DropdownMenuItem>

          {user?.rol === 'ADMIN' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin" className="flex items-center cursor-pointer text-stone-900">
                  <Settings className="h-4 w-4 mr-2" />
                  Panel Admin
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600 cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuPrimitive.Content>
      </DropdownMenu>
    </div>
  );
}