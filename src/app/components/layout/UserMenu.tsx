'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { User, LogOut, Package, Heart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-transparent"
      >
        <User className="h-5 w-5" />
      </Button>
    );
  }

  if (!isAuthenticated) {
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
      <DropdownMenuContent align="end" className="w-56">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}