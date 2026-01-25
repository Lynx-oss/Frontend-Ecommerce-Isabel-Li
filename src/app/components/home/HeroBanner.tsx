'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function HeroBanner(): React.JSX.Element {
  return (
    <section className="relative h-[calc(100vh-80px)] md:h-[calc(100vh-112px)] overflow-hidden bg-stone-100">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop&q=80"
          alt="Nueva Colección"
          fill
          priority
          className="w-full h-full object-cover object-center"
          sizes="100ww"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/40 to-transparent" />
      </motion.div>

      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-xl text-white"
        >
          <span className="text-amber-400 text-xs md:text-sm tracking-[0.3em] mb-4 block font-light">
            PRIMAVERA/VERANO 2026
          </span>
          
          <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-6 tracking-wide">
            Nueva
            <br />
            Colección
          </h1>
          
          <p className="text-stone-200 text-lg mb-8 max-w-md leading-relaxed">
            Descubrí las últimas tendencias en moda femenina. 
            Elegancia contemporánea que define tu estilo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/productos?new=true">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white text-stone-900 px-8 py-4 text-sm tracking-wider font-medium hover:bg-stone-100 transition-all duration-300 flex items-center justify-center gap-2"
              >
                VER COLECCIÓN
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/productos">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 text-sm tracking-wider font-medium hover:bg-white hover:text-stone-900 transition-all duration-300"
              >
                TODOS LOS PRODUCTOS
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}