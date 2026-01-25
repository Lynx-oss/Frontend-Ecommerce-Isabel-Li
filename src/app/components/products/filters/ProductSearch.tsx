'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface ProductSearchProps {
    onSearchChange: (query: string) => void;
    placeholder?: string;
}

export default function ProductSearch({
    onSearchChange,
    placeholder = "Buscar productos..."
}: ProductSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, onSearchChange]);

    const handleClear = () => {
        setSearchQuery('');
        onSearchChange('');
    };

    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 pr-12 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all"
            />
            {searchQuery && (
                <button
                    onClick={handleClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
