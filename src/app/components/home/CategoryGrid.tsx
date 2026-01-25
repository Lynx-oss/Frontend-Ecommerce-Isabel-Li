'use client';

import React, { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getCategorias } from '@/lib/api';
import { CategoriaConImagen } from '@/types/index';

export default function CategoryGrid(): JSX.Element {
  const categorias: CategoriaConImagen[] = getCategorias().map(cat => ({
    ...cat,
    slug: cat.nombre.toLowerCase().replace(/\s+/g, '-')
  }));

  return (
    <section className="py-16 md:py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-amber-700 text-xs tracking-[0.3em] mb-2 block">
            EXPLORÁ
          </span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide mb-4">
            Categorías
          </h2>
          <div className="w-16 h-px bg-amber-700 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categorias.map((categoria, index) => (
            <motion.div
              key={categoria.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/productos?categoria=${categoria.id}`}>
                <div className="group relative aspect-4/5 overflow-hidden bg-stone-200">
                  <Image
                    src={categoria.imagen}
                    alt={categoria.nombre}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-serif text-2xl md:text-3xl mb-2 tracking-wide">
                      {categoria.nombre}
                    </h3>
                    <span className="text-xs tracking-[0.2em] opacity-80 group-hover:opacity-100 transition-opacity">
                      EXPLORAR →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}