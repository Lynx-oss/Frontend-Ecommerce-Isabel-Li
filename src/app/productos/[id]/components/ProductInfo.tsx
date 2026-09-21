'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Producto } from '@/types';
import { ShoppingBag, Heart, Truck, RefreshCw, Shield, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';

interface ProductInfoProps {
  producto: Producto;
}

const FAVORITES_KEY = 'isabel-li-favoritos';

export default function ProductInfo({ producto }: ProductInfoProps): React.JSX.Element {
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        const favorites: Producto[] = JSON.parse(saved);
        setIsFavorite(favorites.some(p => p.id === producto.id));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, [producto.id]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (delta: number): void => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= producto.inventario) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = (): void => {
    addItem(producto, quantity);
    toast.success(`${quantity} ${quantity === 1 ? 'unidad agregada' : 'unidades agregadas'} al carrito`, {
      description: producto.nombre,
      action: {
        label: 'ver carrito',
        onClick: () => {
          router.push('/carrito');
        }
      }
    });
  };

  const handleToggleFavorite = (): void => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      let favorites: Producto[] = saved ? JSON.parse(saved) : [];

      if (isFavorite) {
        favorites = favorites.filter(p => p.id !== producto.id);
        toast.success('Eliminado de favoritos');
      } else {
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

  const isOutOfStock = producto.inventario === 0;

  return (
    <div className="space-y-6">
      {producto.categoria && (
        <p className="text-xs text-amber-700 tracking-[0.3em] uppercase">
          {producto.categoria.nombre}
        </p>
      )}

      <div>
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2 tracking-wide">
          {producto.nombre}
        </h1>
        <p className="text-2xl font-semibold text-stone-900">
          {formatPrice(producto.precio)}
        </p>
      </div>

      <div className="prose prose-stone">
        <p className="text-stone-600 leading-relaxed">
          {producto.descripcion}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' :
            producto.inventario < 5 ? 'bg-amber-500' :
              'bg-green-500'
          }`} />
        <span className="text-sm text-stone-600">
          {isOutOfStock ? 'Sin stock' :
            producto.inventario < 5 ? `Solo ${producto.inventario} unidades disponibles` :
              'En stock'}
        </span>
      </div>

      {!isOutOfStock && (
        <div>
          <label className="block text-sm font-medium text-stone-900 mb-3">
            Cantidad
          </label>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-stone-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-3 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-6 font-medium text-stone-900 min-w-3rem text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= producto.inventario}
                className="p-3 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-stone-500">
              Máximo: {producto.inventario} unidades
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 h-12 bg-stone-900 hover:bg-stone-800 text-white gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          {isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito'}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleToggleFavorite}
          className="h-12 w-12"
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>

      <div className="border-t border-stone-200 pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-stone-900 text-sm">Envío Gratis</p>
            <p className="text-sm text-stone-600">En compras mayores a $50.000</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RefreshCw className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-stone-900 text-sm">Cambios Gratis</p>
            <p className="text-sm text-stone-600">Hasta 30 días después de tu compra</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-stone-900 text-sm">Compra Segura</p>
            <p className="text-sm text-stone-600">Tus datos están protegidos</p>
          </div>
        </div>
      </div>
    </div>
  );
}