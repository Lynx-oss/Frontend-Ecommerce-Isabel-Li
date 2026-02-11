'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Producto } from '@/types';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ProductCardProps {
  producto: Producto;
}

const FAVORITES_KEY = 'isabel-li-favoritos';

function getInitialFavorite(productId: number): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      const favorites: Producto[] = JSON.parse(saved);
      return favorites.some(p => p.id === productId);
    }
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
  return false;
}

export default function ProductCard({ producto }: ProductCardProps): React.JSX.Element {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(() => getInitialFavorite(producto.id));
  const [ImageError, setImageError] = useState<boolean>(false);
  const { addItem } = useCart();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const imagenUrl = ImageError ? 'https://placehold.co/600x800/e7e5e4/78716c?text=Isabel-Li' : producto.imagenes?.[0] || 'https://placehold.co/600x800/e7e5e4/78716c?text=Isabel-Li';

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    addItem(producto);
    toast.success('Producto agregado al carrito', {
      description: producto.nombre,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      let favorites: Producto[] = saved ? JSON.parse(saved) : [];

      if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter(p => p.id !== producto.id);
        toast.success('Eliminado de favoritos');
      } else {
        // Add to favorites
        favorites.push(producto);
        toast.success('Agregado a favoritos', {
          description: producto.nombre,
        });
      }

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error('Error al actualizar favoritos');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/productos/${producto.id}`}>
        <div className="relative aspect-3/4 overflow-hidden bg-stone-100 mb-4">
          <Image
            src={imagenUrl}
            alt={producto.nombre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-stone-900/20 flex items-end justify-center p-4"
          >
            <Button
              size="sm"
              className="bg-white text-stone-900 hover:bg-stone-100 w-full gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-4 h-4" />
              Agregar al Carrito
            </Button>
          </motion.div>

          <button
            onClick={handleToggleFavorite}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors z-10"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-600'}`}
            />
          </button>

          {producto.inventario < 5 && producto.inventario > 0 && (
            <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs px-3 py-1 tracking-wider">
              ¡ÚLTIMAS UNIDADES!
            </div>
          )}

          {producto.inventario === 0 && (
            <div className="absolute top-4 left-4 bg-stone-900 text-white text-xs px-3 py-1 tracking-wider">
              SIN STOCK
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-1">
        <p className="text-xs text-stone-500 tracking-wider uppercase">
          {producto.categoria?.nombre || 'Sin categoría'}
        </p>
        <Link href={`/productos/${producto.id}`}>
          <h3 className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">
            {producto.nombre}
          </h3>
        </Link>
        <p className="text-sm text-stone-600 line-clamp-2">
          {producto.descripcion}
        </p>
        <p className="font-semibold text-stone-900 text-lg">
          {formatPrice(producto.precio)}
        </p>
      </div>
    </motion.div>
  );
}