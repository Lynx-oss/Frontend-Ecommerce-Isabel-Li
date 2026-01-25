'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProductos, getCategorias } from '@/lib/api';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/filters/ProductFilter';
import ProductSearch from '../components/products/filters/ProductSearch';
import ProductSort, { SortOption } from '../components/products/filters/ProductSort';
import Pagination from '../components/products/Pagination';
import { Filter, X } from 'lucide-react';
import { Producto } from '@/types';


const ITEMS_PER_PAGE = 12;

export default function ProductosPage() {
    const searchParams = useSearchParams();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const urlCategoria = searchParams.get('categoria');
    const urlSearch = searchParams.get('search');

    const [selectedCategoria, setSelectedCategoria] = useState<number | null>(
        urlCategoria ? parseInt(urlCategoria) : null
    );
    const [searchQuery, setSearchQuery] = useState(urlSearch || '');
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [currentPage, setCurrentPage] = useState(1);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const categorias = getCategorias();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                const data = await getProductos();
                setProductos(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching productos:', err);
                setError('Error al cargar los productos. Por favor, intentá de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...productos];

        if (selectedCategoria !== null) {
            result = result.filter(p => p.categoria?.id === selectedCategoria);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(p =>
                p.nombre.toLowerCase().includes(query) ||
                p.descripcion?.toLowerCase().includes(query)
            );
        }

        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.precio - b.precio);
                break;
            case 'price-desc':
                result.sort((a, b) => b.precio - a.precio);
                break;
            case 'name-asc':
                result.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            default:
                break;
        }

        return result;
    }, [productos, selectedCategoria, searchQuery, sortBy]);

    const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedProducts, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategoria, searchQuery, sortBy]);

    const handleCategoriaChange = (categoriaId: number | null) => {
        setSelectedCategoria(categoriaId);
        setShowMobileFilters(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
                    <p className="text-stone-600">Cargando productos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <section className="bg-white border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                    <span className="text-amber-700 text-xs tracking-[0.3em] mb-2 block text-center">
                        COLECCIÓN
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-stone-900 mb-4 text-center">
                        {selectedCategoria ? categorias.find(c => c.id === selectedCategoria)?.nombre : 'Todos los Productos'}
                    </h1>
                    <p className="text-stone-600 text-center">
                        {filteredAndSortedProducts.length} productos encontrados
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-4">
                            <ProductFilter
                                categorias={categorias}
                                selectedCategoria={selectedCategoria}
                                onCategoriaChange={handleCategoriaChange}
                            />
                        </div>
                    </aside>

                    <div className="lg:hidden fixed bottom-6 right-6 z-40">
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full shadow-lg hover:bg-stone-800 transition-colors"
                        >
                            <Filter className="w-5 h-5" />
                            Filtros
                        </button>
                    </div>

                    {showMobileFilters && (
                        <div className="lg:hidden fixed inset-0 z-50 flex">
                            <div
                                className="flex-1 bg-black bg-opacity-50"
                                onClick={() => setShowMobileFilters(false)}
                            />
                            <div className="w-80 max-w-full bg-white h-full overflow-y-auto p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-serif text-xl">Filtros</h3>
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <ProductFilter
                                    categorias={categorias}
                                    selectedCategoria={selectedCategoria}
                                    onCategoriaChange={handleCategoriaChange}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex-1">
                                <ProductSearch onSearchChange={setSearchQuery} />
                            </div>
                            <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
                        </div>

                        {(selectedCategoria || searchQuery) && (
                            <div className="mb-6 flex flex-wrap items-center gap-2">
                                <span className="text-sm text-stone-600">Filtros activos:</span>
                                {selectedCategoria && (
                                    <span className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm px-3 py-1 rounded-full">
                                        {categorias.find((c: { id: number; nombre: string }) => c.id === selectedCategoria)?.nombre}
                                        <button
                                            onClick={() => setSelectedCategoria(null)}
                                            className="hover:bg-stone-700 rounded-full p-0.5 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                                {searchQuery && (
                                    <span className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm px-3 py-1 rounded-full">
                                        Búsqueda: &quot;{searchQuery}&quot;
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="hover:bg-stone-700 rounded-full p-0.5 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}

                        {paginatedProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                    {paginatedProducts.map((producto) => (
                                        <ProductCard key={producto.id} producto={producto} />
                                    ))}
                                </div>

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={filteredAndSortedProducts.length}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-stone-600 text-lg mb-2">
                                    No se encontraron productos
                                </p>
                                <p className="text-stone-500 text-sm mb-6">
                                    Intentá ajustar los filtros o términos de búsqueda
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategoria(null);
                                        setSearchQuery('');
                                        setSortBy('default');
                                    }}
                                    className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
                                >
                                    Limpiar todos los filtros
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
