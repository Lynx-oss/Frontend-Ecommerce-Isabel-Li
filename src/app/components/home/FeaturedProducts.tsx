'use client';

import React, { JSX, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/app/components/products/ProductCard';
import { getProductos } from '@/lib/api';
import { Producto } from '@/types';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FeaturedProductsProps {
  title: string;
  subtitle: string;
}

export default function FeaturedProducts({ title, subtitle }: FeaturedProductsProps): JSX.Element {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data.slice(0, 4));
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-amber-700 text-xs tracking-[0.3em] mb-2 block">
              {subtitle}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl tracking-wide">
              {title}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-stone-200 mb-4" />
                <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-stone-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (productos.length === 0) {
    return <></>;
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-amber-700 text-xs tracking-[0.3em] mb-2 block">
            {subtitle}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide mb-4">
            {title}
          </h2>
          <div className="w-16 h-px bg-amber-700 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/productos">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-2 border-2 border-stone-900 px-8 py-3 text-sm tracking-wider hover:bg-stone-900 hover:text-white transition-all duration-300"
            >
              VER TODOS LOS PRODUCTOS
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}