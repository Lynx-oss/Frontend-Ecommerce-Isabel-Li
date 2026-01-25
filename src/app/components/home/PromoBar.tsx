'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, CreditCard, RefreshCw, Shield } from 'lucide-react';

interface Feature {
  icon: React.ElementType; 
  title: string;
  description: string;
}

// 2. Aplicamos el tipo al array
const features: Feature[] = [
  {
    icon: Truck,
    title: 'Envío Gratis',
    description: 'En compras mayores a $50.000',
  },
  {
    icon: CreditCard,
    title: '3 Cuotas sin Interés',
    description: 'Con todas las tarjetas',
  },
  {
    icon: RefreshCw,
    title: 'Cambios Gratis',
    description: 'Hasta 30 días después',
  },
  {
    icon: Shield,
    title: 'Compra Segura',
    description: 'Tus datos están protegidos',
  },
];

export default function PromoBar(): React.JSX.Element {
  return (
    <section className="py-12 md:py-16 bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 p-3 rounded-full bg-amber-50">
                {/* Al usar React.ElementType en la interfaz, TS sabe que 
                  <feature.icon /> es válido y acepta className 
                */}
                <feature.icon className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-medium text-stone-900 mb-1 tracking-wide">
                {feature.title}
              </h3>
              <p className="text-sm text-stone-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}