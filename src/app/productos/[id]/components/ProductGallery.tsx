'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Producto } from '@/types';
import { ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  producto: Producto;
}

export default function ProductGallery({ producto }: ProductGalleryProps): React.JSX.Element {
  const images = producto.imagenes && producto.imagenes.length > 0
    ? producto.imagenes
    : ['https://placehold.co/800x1000/e7e5e4/78716c?text=Isabel-Li'];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Si la imagen seleccionada no pertenece al producto actual (ej. al cambiar de prenda), usa la primera por defecto
  const currentImage = selectedImage && images.includes(selectedImage)
    ? selectedImage
    : images[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-3/4 bg-stone-100 overflow-hidden rounded-lg group">
        <Image
          src={currentImage}
          alt={producto.nombre}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />

        <button
          type="button"
          onClick={() => setIsZoomed(true)}
          className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-full transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
          aria-label="Ampliar imagen"
        >
          <ZoomIn className="w-5 h-5 text-stone-900" />
        </button>

        {producto.inventario < 5 && producto.inventario > 0 && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs px-3 py-1.5 tracking-wider rounded">
            ultimas {producto.inventario} unidades!
          </div>
        )}

        {producto.inventario === 0 && (
          <div className="absolute top-4 left-4 bg-stone-900 text-white text-xs px-3 py-1.5 tracking-wider rounded">
            SIN STOCK
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, index) => {
            const isCurrent = currentImage === img;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImage(img)}
                aria-label={`Ver imagen ${index + 1}`}
                className={`relative aspect-square bg-stone-100 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-stone-900 shadow-sm opacity-100'
                    : 'border-transparent hover:border-stone-300 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`${producto.nombre} - Vista ${index + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl w-full aspect-3/4">
            <Image
              src={currentImage}
              alt={producto.nombre}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-stone-300 transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}