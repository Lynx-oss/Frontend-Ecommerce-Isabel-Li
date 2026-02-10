'use client'

import React, { createContext, useState, ReactNode, useEffect } from 'react'
import { Producto, CartItem, CartContextType } from '@/types'
import { toast } from 'sonner'

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

// Función helper para cargar el carrito inicial
function getInitialCart(): CartItem[] {
    if (typeof window === 'undefined') return [];

    try {
        const savedCart = localStorage.getItem('isabel-li-cart');
        if (savedCart) {
            return JSON.parse(savedCart);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
    return [];
}

export function CartProvider({ children }: CartProviderProps): React.JSX.Element {
    const [items, setItems] = useState<CartItem[]>(getInitialCart);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Solo guardar cuando cambien los items
    useEffect(() => {
        localStorage.setItem('isabel-li-cart', JSON.stringify(items));
    }, [items]);

    const addItem = (producto: Producto, cantidad: number = 1): void => {
        const existingItem = items.find((item) => item.producto.id === producto.id);
        const currentQty = existingItem ? existingItem.cantidad : 0;

        if (currentQty + cantidad > producto.inventario) {
            toast.error(`No puedes agregar más. Stock disponible: ${producto.inventario}`);
            return;
        }

        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.producto.id === producto.id);

            if (existingItem) {
                return currentItems.map((item) =>
                    item.producto.id === producto.id
                        ? { ...item, cantidad: item.cantidad + cantidad }
                        : item
                )
            } else {
                const cartItemId = Date.now();
                return [...currentItems, {
                    id: cartItemId,
                    producto,
                    cantidad
                }];
            }
        })
        toast.success('Producto agregado al carrito');
    }

    const removeItem = (productoId: number): void => {
        setItems((currentItems) => currentItems.filter((item) => item.producto.id !== productoId));
    }

    const updateQuantity = (productoId: number, cantidad: number): void => {
        if (cantidad <= 0) {
            removeItem(productoId);
            return;
        }

        const itemToUpdate = items.find(i => i.producto.id === productoId);
        if (itemToUpdate && cantidad > itemToUpdate.producto.inventario) {
            toast.error(`Stock máximo alcanzado (${itemToUpdate.producto.inventario})`);
            return;
        }

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.producto.id === productoId
                    ? { ...item, cantidad }
                    : item
            )
        );
    }

    const clearCart = (): void => {
        setItems([]);
    }

    const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);
    const subtotal = totalPrice; // Alias for compatibility

    const value: CartContextType = {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
        subtotal,
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}