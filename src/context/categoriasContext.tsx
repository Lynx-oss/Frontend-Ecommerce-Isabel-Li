'use client'
import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { getCategorias } from '@/lib/api'
import { CategoriaConImagen, CategoriasContextType } from '@/types'

export const CategoriasContext = createContext<CategoriasContextType | undefined>(undefined);

export const CategoriasProvider = ({ children }: { children: ReactNode }) => {
    const [categorias, setCategorias] = useState<CategoriaConImagen[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const data = await getCategorias();
                setCategorias(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Error al cargar las categorías. Por favor, intentá de nuevo.');
            } finally {
                setLoading(false);
            }
        }
        fetchCats();
    }, []);

    return (
        <CategoriasContext.Provider value={{ categorias, loading, error }}>
            {children}
        </CategoriasContext.Provider>
    );
}