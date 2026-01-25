'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

interface ProductSortProps {
    sortBy: SortOption;
    onSortChange: (option: SortOption) => void;
}

export default function ProductSort({ sortBy, onSortChange }: ProductSortProps) {
    return (
        <div className="flex items-center gap-3">
            <ArrowUpDown className="w-4 h-4 text-stone-500" />
            <span className="text-sm text-stone-600 hidden sm:inline">Ordenar por:</span>
            <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent cursor-pointer transition-all bg-white"
            >
                <option value="default">Más relevantes</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="name-asc">Nombre: A-Z</option>
            </select>
        </div>
    );
}
