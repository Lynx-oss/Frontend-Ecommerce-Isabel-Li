'use client'
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AuthContext } from '@/context/authContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ChevronLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    imagenes: string[];
    categoria?: { nombre: string };
}

export default function FavoritosPage() {
    const auth = useContext(AuthContext);
    const router = useRouter();
    const [favoritos, setFavoritos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth?.isAuthenticated) {
            router.push('/login');
            return;
        }
        loadFavoritos();
    }, [auth?.isAuthenticated, router]);

    const loadFavoritos = () => {
        try {
            const saved = localStorage.getItem('isabel-li-favoritos');
            if (saved) {
                setFavoritos(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading favoritos:', error);
        }
        setLoading(false);
    };

    const removeFavorito = (id: number) => {
        const updated = favoritos.filter(p => p.id !== id);
        setFavoritos(updated);
        localStorage.setItem('isabel-li-favoritos', JSON.stringify(updated));
        toast.success('Eliminado de favoritos');
    };

    if (!auth?.isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 pt-8">
                <div className="max-w-6xl mx-auto px-4">
                    <Skeleton className="h-10 w-48 mb-6" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-64" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 pt-44 pb-16">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/cuenta">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-serif text-3xl tracking-wide">Mis Favoritos</h1>
                        <p className="text-stone-500">{favoritos.length} productos guardados</p>
                    </div>
                </div>

                {favoritos.length === 0 ? (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <Heart className="h-16 w-16 mx-auto mb-4 text-stone-300" />
                            <p className="text-stone-500 mb-4">Aún no tienes favoritos</p>
                            <p className="text-sm text-stone-400 mb-6">
                                Guarda productos que te gusten para verlos más tarde
                            </p>
                            <Link href="/productos">
                                <Button className="bg-amber-700 hover:bg-amber-800">
                                    Explorar productos
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {favoritos.map((producto) => (
                            <Card key={producto.id} className="overflow-hidden group">
                                <div className="relative aspect-[3/4]">
                                    {producto.imagenes?.[0] ? (
                                        <Image
                                            src={producto.imagenes[0]}
                                            alt={producto.nombre}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                                            <Heart className="h-12 w-12 text-stone-300" />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => removeFavorito(producto.id)}
                                        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                                <CardContent className="p-4">
                                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">
                                        {producto.categoria?.nombre}
                                    </p>
                                    <Link href={`/productos/${producto.id}`}>
                                        <h3 className="font-medium hover:text-amber-700 transition-colors line-clamp-1">
                                            {producto.nombre}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="font-medium">${producto.precio?.toLocaleString()}</p>
                                        <Link href={`/productos/${producto.id}`}>
                                            <Button size="sm" variant="outline" className="h-8">
                                                <ShoppingCart className="h-3 w-3 mr-1" />
                                                Ver
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
