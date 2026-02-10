'use client';

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { AuthContext } from '@/context/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Tag, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function CarritoPage() {
  const {
    items,
    isLoading,
    updateQuantity,
    removeItem,
    subtotal,
    clearCart
  } = useCart();

  const auth = useContext(AuthContext);
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    telefono: '',
    notas: ''
  });

  const shipping = subtotal >= 50000 ? 0 : 5000;
  const totalWithShipping = subtotal + shipping;

  const handleCheckoutClick = () => {
    if (!auth?.isAuthenticated) {
      toast.error('Debés iniciar sesión para finalizar la compra');
      router.push('/login');
      return;
    }
    setCheckoutOpen(true);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const direccionCompleta = `${formData.direccion}, ${formData.ciudad}, CP ${formData.codigoPostal}. Tel: ${formData.telefono}${formData.notas ? `. Notas: ${formData.notas}` : ''}`;

    try {
      await fetch(`${API_URL}/carrito/vaciar`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${auth?.token}` }
      });

      for (const item of items) {
        await fetch(`${API_URL}/carrito/agregar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.token}`
          },
          body: JSON.stringify({
            productoId: item.producto.id,
            cantidad: item.cantidad
          })
        });
      }

      const response = await fetch(`${API_URL}/ordenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth?.token}`
        },
        body: JSON.stringify({ direccionEnvio: direccionCompleta })
      });

      if (response.ok) {
        const data = await response.json();
        setOrderId(data.id);
        setOrderSuccess(true);
        clearCart();
        toast.success('¡Pedido realizado con éxito!');
      } else {
        if (response.status === 403) {
          toast.error('No tienes permiso para realizar esta acción. Intentá iniciar sesión nuevamente.');
        } else {
          const text = await response.text();
          try {
            const error = JSON.parse(text);
            toast.error(error.message || 'Error al crear el pedido');
          } catch {
            toast.error('Error al crear el pedido');
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setCheckoutOpen(false);
    setOrderSuccess(false);
    router.push('/pedidos');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag
              className="h-20 w-20 mx-auto mb-6 text-stone-200"
              strokeWidth={1}
            />
            <h1 className="font-serif text-3xl md:text-4xl tracking-wide mb-4 text-stone-900">
              Tu carrito está vacío
            </h1>
            <p className="text-stone-500 mb-8 font-light">
              Descubrí nuestra colección y encontrá lo que buscás
            </p>
            <Link href="/productos">
              <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-none px-8 h-12 text-sm tracking-wider font-light">
                EXPLORAR PRODUCTOS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12 pb-6 border-b border-stone-200">
            <h1 className="font-serif text-3xl md:text-4xl tracking-wide text-stone-900">
              Carrito
            </h1>
            <Link
              href="/productos"
              className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors font-light"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Seguir comprando</span>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <AnimatePresence mode="popLayout">
                  {items.filter(item => item.producto?.id).map((item) => (
                    <motion.div
                      key={item.producto.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-6 pb-8 border-b border-stone-100 last:border-0 last:pb-0"
                    >
                      <Link
                        href={`/productos/${item.producto?.id}`}
                        className="flex-shrink-0 group"
                      >
                        <div className="relative w-28 h-36 bg-stone-100 overflow-hidden">
                          {item.producto?.imagenes?.[0] ? (
                            <Image
                              src={item.producto.imagenes[0]}
                              alt={item.producto.nombre || 'Producto'}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-stone-300" />
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-4">
                          <div className="flex-1">
                            <Link
                              href={`/productos/${item.producto?.id}`}
                              className="font-medium text-stone-900 hover:text-stone-600 transition-colors line-clamp-2"
                            >
                              {item.producto?.nombre || 'Producto'}
                            </Link>

                            {(item.talle || item.color) && (
                              <p className="text-sm text-stone-500 mt-2 font-light">
                                {item.talle && `Talle: ${item.talle}`}
                                {item.color && item.talle && ' • '}
                                {item.color && `Color: ${item.color}`}
                              </p>
                            )}

                            <p className="font-medium mt-3 text-stone-900">
                              ${item.producto?.precio?.toLocaleString('es-AR')}
                            </p>
                          </div>

                          <div className="hidden sm:block text-right">
                            <p className="font-medium text-stone-900">
                              ${((item.producto?.precio || 0) * item.cantidad).toLocaleString('es-AR')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center border border-stone-200">
                            <button
                              onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                              className="p-2.5 hover:bg-stone-50 transition-colors disabled:opacity-50"
                              disabled={item.cantidad <= 1}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-12 text-center text-sm font-light">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                              className="p-2.5 hover:bg-stone-50 transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.producto.id)}
                            className="text-stone-400 hover:text-red-500 transition-colors p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="sm:hidden mt-4 text-right">
                          <p className="font-medium text-stone-900">
                            ${((item.producto?.precio || 0) * item.cantidad).toLocaleString('es-AR')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="border border-stone-200 p-6 lg:sticky lg:top-40">
                <h2 className="font-serif text-xl tracking-wide mb-6 text-stone-900">
                  Resumen del pedido
                </h2>

                <div className="flex gap-2 mb-8">
                  <Input
                    placeholder="Código de descuento"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="rounded-none border-stone-300 focus:border-stone-900 focus:ring-stone-900 font-light"
                  />
                  <Button
                    variant="outline"
                    className="rounded-none border-stone-300 hover:bg-stone-50 flex-shrink-0 px-3"
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3 py-6 border-y border-stone-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600 font-light">Subtotal</span>
                    <span className="text-stone-900">${subtotal.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600 font-light">Envío</span>
                    <span className={shipping === 0 ? 'text-green-600' : 'text-stone-900'}>
                      {shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-AR')}`}
                    </span>
                  </div>
                  {subtotal < 50000 && subtotal > 0 && (
                    <p className="text-xs text-stone-600 pt-2 font-light">
                      Agregá ${(50000 - subtotal).toLocaleString('es-AR')} más para envío gratis
                    </p>
                  )}
                </div>

                <div className="flex justify-between py-6 text-lg">
                  <span className="font-medium text-stone-900">Total</span>
                  <span className="font-medium text-stone-900">
                    ${totalWithShipping.toLocaleString('es-AR')}
                  </span>
                </div>

                <p className="text-xs text-stone-500 mb-6 font-light text-center">
                  3 cuotas sin interés de ${(totalWithShipping / 3).toLocaleString('es-AR')}
                </p>

                <Button
                  onClick={handleCheckoutClick}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-none h-12 text-sm tracking-wider font-light mb-6"
                >
                  FINALIZAR COMPRA
                </Button>

                <div className="text-center pt-6 border-t border-stone-200">
                  <p className="text-xs text-stone-500 mb-3 font-light tracking-wide">
                    MÉTODOS DE PAGO
                  </p>
                  <div className="flex justify-center gap-3 text-xs text-stone-400 font-light">
                    <span>VISA</span>
                    <span>•</span>
                    <span>MASTERCARD</span>
                    <span>•</span>
                    <span>MERCADO PAGO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {orderSuccess ? '¡Pedido Confirmado!' : 'Finalizar Compra'}
            </DialogTitle>
          </DialogHeader>

          {orderSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">¡Gracias por tu compra!</p>
              <p className="text-stone-500 mb-6">
                Tu pedido #{orderId} ha sido registrado.<br />
                Te contactaremos pronto para coordinar el pago y envío.
              </p>
              <Button
                onClick={handleCloseSuccess}
                className="bg-amber-700 hover:bg-amber-800"
              >
                Ver mis pedidos
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="space-y-2">
                <Label>Dirección de envío *</Label>
                <Input
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Calle y número"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ciudad *</Label>
                  <Input
                    value={formData.ciudad}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                    placeholder="Ciudad"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Código Postal *</Label>
                  <Input
                    value={formData.codigoPostal}
                    onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                    placeholder="CP"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Teléfono *</Label>
                <Input
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Tu número de contacto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Notas adicionales</Label>
                <Textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Instrucciones de entrega, etc. (opcional)"
                  rows={2}
                />
              </div>

              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Total a pagar</span>
                  <span className="font-bold text-lg">${totalWithShipping.toLocaleString('es-AR')}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCheckoutOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-amber-700 hover:bg-amber-800"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      'Confirmar Pedido'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}