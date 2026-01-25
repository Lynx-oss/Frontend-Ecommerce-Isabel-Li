'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Categoria } from '@/types';



interface ProductFilterProps {
    categorias: Categoria[];
    selectedCategoria: number | null;
    onCategoriaChange: (categoriaId: number | null) => void;
}

export default function ProductFilter({
    categorias,
    selectedCategoria,
    onCategoriaChange
}: ProductFilterProps) {
    return (
        <div className="bg-white border border-stone-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-stone-900">Filtros</h3>
                {selectedCategoria && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCategoriaChange(null)}
                        className="text-xs text-stone-600 hover:text-stone-900"
                    >
                        Limpiar
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-medium text-stone-900 mb-3 tracking-wide">
                        CATEGORÍAS
                    </h4>
                    <div className="space-y-2">
                        <button
                            onClick={() => onCategoriaChange(null)}
                            className={`w-full text-left px-4 py-2.5 rounded-md transition-all ${selectedCategoria === null
                                ? 'bg-stone-900 text-white'
                                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                                }`}
                        >
                            Todas las categorías
                        </button>
                        {categorias.map((categoria) => (
                            <button
                                key={categoria.id}
                                onClick={() => onCategoriaChange(categoria.id)}
                                className={`w-full text-left px-4 py-2.5 rounded-md transition-all ${selectedCategoria === categoria.id
                                    ? 'bg-stone-900 text-white'
                                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                                    }`}
                            >
                                {categoria.nombre}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
