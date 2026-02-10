'use client'
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/authContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Package, Heart, Settings, LogOut, ChevronRight } from 'lucide-react';

export default function CuentaPage() {
    const auth = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!auth?.isAuthenticated) {
            router.push('/login');
        }
    }, [auth?.isAuthenticated, router]);

    if (!auth?.isAuthenticated) {
        return (
            <div className="min-h-screen bg-stone-50 pt-8">
                <div className="max-w-4xl mx-auto px-4">
                    <Skeleton className="h-10 w-48 mb-6" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    const menuItems = [
        {
            icon: User,
            label: 'Mi perfil',
            description: 'Ver y editar mi información personal',
            href: '/cuenta',
            color: 'bg-stone-100 text-stone-600'
        },
        {
            icon: Package,
            label: 'Mis pedidos',
            description: 'Ver historial de compras y estado de envíos',
            href: '/pedidos',
            color: 'bg-blue-50 text-blue-600'
        },
        {
            icon: Heart,
            label: 'Favoritos',
            description: 'Productos guardados para después',
            href: '/favoritos',
            color: 'bg-rose-50 text-rose-600'
        },
    ];

    return (
        <div className="min-h-screen bg-stone-50 pt-44 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="font-serif text-3xl tracking-wide mb-2">Mi Cuenta</h1>
                    <p className="text-stone-500">Bienvenida, {auth.user?.nombre}</p>
                </div>

                <Card className="mb-8">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Información Personal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                                <User className="h-8 w-8 text-amber-700" />
                            </div>
                            <div>
                                <p className="font-medium text-lg">{auth.user?.nombre}</p>
                                <p className="text-stone-500">{auth.user?.email}</p>
                                <p className="text-sm text-amber-700 mt-1 capitalize">
                                    {auth.user?.rol === 'ADMIN' ? ' Administrador' : ' Cliente'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 mb-8">
                    {menuItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg ${item.color}`}>
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.label}</p>
                                            <p className="text-sm text-stone-500">{item.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-stone-400" />
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {auth.isAdmin && (
                    <Link href="/admin">
                        <Card className="mb-8 hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-stone-100 text-stone-700">
                                        <Settings className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Panel de Administración</p>
                                        <p className="text-sm text-stone-500">Gestionar productos, categorías y pedidos</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-stone-400" />
                            </CardContent>
                        </Card>
                    </Link>
                )}

                <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => auth.logout()}
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                </Button>
            </div>
        </div>
    );
}
