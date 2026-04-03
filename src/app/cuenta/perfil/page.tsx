'use client'

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/authContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Shield, ArrowLeft, Pencil, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function PerfilPage() {
    const auth = useContext(AuthContext);
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [nombre, setNombre] = useState(auth?.user?.nombre || '');

    useEffect(() => {
        if (!auth?.isAuthenticated) {
            router.push('/login');
        }
    }, [auth?.isAuthenticated, router]);

    if (!auth?.isAuthenticated) {
        return (
            <div className="min-h-screen bg-stone-50 pt-44">
                <div className="max-w-2xl mx-auto px-4">
                    <Skeleton className="h-10 w-48 mb-6" />
                    <Skeleton className="h-96" />
                </div>
            </div>
        );
    }

    const handleSave = () => {
        if (!nombre.trim()) {
            toast.error('El nombre no puede estar vacío');
            return;
        }
        toast.info('Funcionalidad de edición próximamente disponible');
        setIsEditing(false);
    };

    const handleCancel = () => {
        setNombre(auth.user?.nombre || '');
        setIsEditing(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-stone-50 pt-44 pb-16">
            <div className="max-w-2xl mx-auto px-4">
                <Link href="/cuenta" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm">Volver a mi cuenta</span>
                </Link>

                <h1 className="font-serif text-3xl tracking-wide mb-8">Mi Perfil</h1>

                <Card className="mb-6 overflow-hidden">
                    <div className="h-24 bg-linear-to-r from-amber-100 via-stone-100 to-amber-50" />
                    <CardContent className="relative pt-0 pb-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
                            <div className="w-24 h-24 rounded-full bg-amber-200 border-4 border-white shadow-md flex items-center justify-center shrink-0">
                                <span className="text-2xl font-serif text-amber-800">
                                    {getInitials(auth.user?.nombre || '')}
                                </span>
                            </div>
                            <div className="text-center sm:text-left pb-1">
                                <h2 className="text-xl font-medium">{auth.user?.nombre}</h2>
                                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 mt-1">
                                    <Shield className="h-3 w-3" />
                                    {auth.user?.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="text-lg">Información Personal</CardTitle>
                        {!isEditing ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="text-stone-500 hover:text-stone-900"
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCancel}
                                    className="text-stone-500"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancelar
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    className="bg-stone-900 hover:bg-stone-800 text-white"
                                >
                                    <Save className="h-4 w-4 mr-1" />
                                    Guardar
                                </Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 rounded-lg bg-stone-100 mt-0.5">
                                <User className="h-4 w-4 text-stone-600" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-stone-500 uppercase tracking-wider">Nombre</label>
                                {isEditing ? (
                                    <Input
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        className="mt-1 border-stone-200 focus:border-stone-400 focus:ring-stone-400"
                                    />
                                ) : (
                                    <p className="font-medium mt-1">{auth.user?.nombre}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2.5 rounded-lg bg-stone-100 mt-0.5">
                                <Mail className="h-4 w-4 text-stone-600" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-stone-500 uppercase tracking-wider">Email</label>
                                <p className="font-medium mt-1">{auth.user?.email}</p>
                                <p className="text-xs text-stone-400 mt-0.5">El email no se puede modificar</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2.5 rounded-lg bg-stone-100 mt-0.5">
                                <Shield className="h-4 w-4 text-stone-600" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-stone-500 uppercase tracking-wider">Tipo de cuenta</label>
                                <p className="font-medium mt-1">
                                    {auth.user?.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Seguridad</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-stone-50">
                            <div>
                                <p className="font-medium text-sm">Contraseña</p>
                                <p className="text-xs text-stone-500 mt-0.5">••••••••</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toast.info('Funcionalidad próximamente disponible')}
                                className="text-stone-600"
                            >
                                Cambiar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
