'use client';

import React, { useEffect, useState, JSX } from 'react';
import { getProductosByCategoria } from '@/lib/api';
import { Producto } from '@/types';
import ProductCard from '@/app/components/products/ProductCard';

interface RelatedProductsProps {
    categoriaId?: number;
    currentProductId: number;
}

export default function RelatedProducts({ categoriaId, currentProductId }: RelatedProductsProps): JSX.Element | null {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchRelated = async () => {
            if(!categoriaId){
                setLoading(false);
                return;
            }

            try {
                const data = await getProductosByCategoria(categoriaId);
                const filtered = data.filter((p: Producto) => p.id !== currentProductId).slice(0, 4);
                setProductos(filtered);
            } catch (error){
                console.error('Error fetching related products: ', error);
            } finally {
                setLoading(false);
            }
        }

        fetchRelated();
    }, [categoriaId, currentProductId]);

   if (loading) {
    return (
      <section>
        <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-8">
          Productos Relacionados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-3/4 bg-stone-200 rounded-lg mb-4" />
              <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-stone-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if(productos.length === 0){
    return null;
  }

  return (
    <section>
        <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-8 tracking-wide">
            Productos Relacionados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto}/>
            ))}
        </div>
    </section>
  )
}