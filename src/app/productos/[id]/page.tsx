'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductosById } from '@/lib/api';
import { Producto } from '@/types';
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import RelatedProducts from './components/RelatedProducts';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function ProductoDetailPage(): React.JSX.Element {
  const params = useParams();
  const router = useRouter();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        const id = Number(params.id);

        if (isNaN(id)) {
          setError('id de producto invalido');
          return;
        }

        const data = await getProductosById(id);
        setProducto(data);
        setError(null);

      } catch (error) {
        console.error('Error fetching producto: ', error);
        setError('no se pudo cargar el producto');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchProducto();
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4">
            <p className="text-stone-600">Cargando producto...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-stone-600 text-lg mb-4">
            {error || 'producto no encontrado'}
          </p>
          <button
            onClick={() => router.push('productos')}
            className="px--6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"

          >

            Volver a Productos
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4 text-stone-400" />
            <Link href="/productos" className="text-stone-600 hover:text-stone-900 transition-colors"
            >
              Productos
            </Link>
            {producto.categoria && (
              <>
                <ChevronRight className="w-4 h-4 text-stone-400" />
                <Link href={`/productos?categoria=${producto.categoria.id}`} className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  {producto.categoria.nombre}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4 text-stone-400" />
            <span className="text-stone-900 font-medium truncate max-w-50">
              {producto.nombre}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <ProductGallery producto={producto} />

          <ProductInfo producto={producto} />

          <RelatedProducts categoriaId={producto.categoria?.id} currentProductId={producto.id} />
        </div>
      </div>



    </div>
  )



}