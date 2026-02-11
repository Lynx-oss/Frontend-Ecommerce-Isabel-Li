import React from 'react';
import Link from 'next/link'; 
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input'; 
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-stone-100">
      <div className="bg-stone-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="font-serif text-2xl md:text-3xl tracking-wide mb-2">
            Ingresa a nuestro grupo de Facebook           </h3>
          <p className="text-stone-400 text-sm mb-6">
            Recibí las últimas novedades y ofertas exclusivas
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Tu email"
              className="bg-transparent border-stone-700 text-white placeholder:text-stone-500 focus:border-amber-600 rounded-none"
            />
            <Button className="bg-amber-700 hover:bg-amber-800 text-white rounded-none px-8 tracking-wider">
              SUSCRIBIR
            </Button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="font-serif text-2xl tracking-[0.2em] mb-4">ISABEL&LI</h2>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              Moda femenina elegante y contemporánea. Diseños únicos para mujeres que brillan.
            </p>
            <div className="flex gap-4">
              <Link href="https://instagram.com" className="text-stone-600 hover:text-amber-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://facebook.com" className="text-stone-600 hover:text-amber-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs tracking-[0.2em] font-medium mb-4">AYUDA</h4>
            <ul className="space-y-3 text-sm text-stone-600">
              <li><Link href="/guia-talles" className="hover:text-amber-700 transition-colors">Guía de talles</Link></li>
              <li><Link href="/envios" className="hover:text-amber-700 transition-colors">Envíos y entregas</Link></li>
              <li><Link href="/cambios" className="hover:text-amber-700 transition-colors">Cambios y devoluciones</Link></li>
              <li><Link href="/faq" className="hover:text-amber-700 transition-colors">Preguntas frecuentes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] font-medium mb-4">EMPRESA</h4>
            <ul className="space-y-3 text-sm text-stone-600">
              <li><Link href="/nosotros" className="hover:text-amber-700 transition-colors">Sobre nosotros</Link></li>
              <li><Link href="/terminos" className="hover:text-amber-700 transition-colors">Términos y condiciones</Link></li>
              <li><Link href="/privacidad" className="hover:text-amber-700 transition-colors">Política de privacidad</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] font-medium mb-4">CONTACTO</h4>
            <ul className="space-y-3 text-sm text-stone-600">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Isabel&Li@Gmail.com              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +54 11 1234-5678
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                Buenos Aires, Argentina
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-stone-200 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Isabel&Li. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            {/* Si tienes la imagen en public/ puedes usar Image de next/image */}
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=30&fit=crop" 
              alt="Métodos de pago" 
              className="h-6 opacity-60" 
            />
          </div>
        </div>
      </div>
    </footer>
  );
}