'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import UserMenu from './UserMenu';

const categories = [
  { name: 'Remeras y Tops', slug: 'remeras-tops', id: 1 },
  { name: 'Pantalones', slug: 'pantalones', id: 2 },
  { name: 'Vestidos', slug: 'vestidos', id: 3 },
  { name: 'Buzos y Sweaters', slug: 'buzos-sweaters', id: 4 },
  { name: 'Camperas', slug: 'camperas', id: 5 },
  { name: 'Accesorios', slug: 'accesorios', id: 6 },
  { name: 'Camisas', slug: 'camisas', id: 7 },
];

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}>
      <div className="bg-stone-900 text-white text-center py-2 text-xs tracking-widest">
        ENVÍO GRATIS EN COMPRAS +$50.000 | 3 CUOTAS SIN INTERÉS
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-transparent">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-6">
                <h2 className="font-serif text-2xl tracking-wide mb-8">Menú</h2>
                <nav className="space-y-4">
                  <Link
                    href="/"
                    className="block text-sm tracking-wider hover:text-stone-900 transition-colors text-stone-600"
                  >
                    INICIO
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/productos?categoria=${cat.id}`}
                      className="block text-sm tracking-wider hover:text-stone-900 transition-colors text-stone-600"
                    >
                      {cat.name.toUpperCase()}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex items-center flex-1">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="¿Qué estás buscando?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 border-0 border-b border-stone-200 rounded-none focus:ring-0 focus-visible:ring-0 focus:border-stone-400 bg-transparent text-sm"
              />
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            </form>
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-2xl md:text-3xl tracking-[0.3em] text-stone-900"
          >
            ISABEL-LI
          </Link>

          <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
            {/* Mobile search toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-transparent"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <UserMenu />

            <Link href="/favoritos" className="hidden md:block">
              <Button variant="ghost" size="icon" className="hover:bg-transparent">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/carrito">
              <Button variant="ghost" size="icon" className="relative hover:bg-transparent">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-light">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="md:hidden pb-4">
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-stone-200 focus:border-stone-900 focus:ring-stone-900"
              autoFocus
            />
          </form>
        )}

        <nav className="hidden md:flex items-center justify-center gap-8 py-4 border-t border-stone-100">
          <Link
            href="/"
            className="text-xs tracking-[0.2em] hover:text-stone-900 transition-colors text-stone-600"
          >
            INICIO
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/productos?categoria=${cat.id}`}
              className="text-xs tracking-[0.2em] hover:text-stone-900 transition-colors text-stone-600"
            >
              {cat.name.toUpperCase()}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}