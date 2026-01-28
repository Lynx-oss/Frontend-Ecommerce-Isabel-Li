'use client'

import React, { createContext,  useState, ReactNode, useEffect } from 'react'
import { Producto, CartItem, CartContextType } from '@/types'

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

    // Solo guardar cuando cambien los items
    useEffect(() => {
        localStorage.setItem('isabel-li-cart', JSON.stringify(items));
    }, [items]);

    const addItem = (producto: Producto, cantidad: number = 1): void => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.producto.id === producto.id);

            if (existingItem) {
                return currentItems.map((item) => 
                    item.producto.id === producto.id 
                        ? { ...item, cantidad: item.cantidad + cantidad } 
                        : item
                )
            } else {
                return [...currentItems, { producto, cantidad }];
            }
        })
    }

    const removeItem = (productoId: number): void => {
        setItems((currentItems) => currentItems.filter((item) => item.producto.id !== productoId));
    }

    const updateQuantity = (productoId: number, cantidad: number): void => {
        if (cantidad <= 0) {
            removeItem(productoId);
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

    const value: CartContextType = {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}