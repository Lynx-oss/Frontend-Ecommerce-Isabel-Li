'use client'
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/authContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, ChevronLeft, Eye, ShoppingBag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface OrdenItem {
    id: number;
    producto: { nombre: string };
    cantidad: number;
    subtotal: number;
    talla?: string;
    color?: string;
}

interface Orden {
    id: number;
    estado: string;
    total: number;
    subtotal?: number;
    costoEnvio?: number;
    direccionEnvio: string;
    createdAt: string;
    items: OrdenItem[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const statusColors: Record<string, string> = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    PAGADO: 'bg-blue-100 text-blue-800',
    PROCESANDO: 'bg-purple-100 text-purple-800',
    ENVIADO: 'bg-indigo-100 text-indigo-800',
    ENTREGADO: 'bg-green-100 text-green-800',
    CANCELADO: 'bg-red-100 text-red-800'
};

const statusLabels: Record<string, string> = {
    PENDIENTE: 'Pendiente',
    PAGADO: 'Pagado',
    PROCESANDO: 'Procesando',
    ENVIADO: 'Enviado',
    ENTREGADO: 'Entregado',
    CANCELADO: 'Cancelado'
};

export default function PedidosPage() {
    const auth = useContext(AuthContext);
    const router = useRouter();
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Orden | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (!auth?.isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchOrdenes();
    }, [auth?.isAuthenticated, auth?.token, router]);

    const fetchOrdenes = async () => {
        try {
            const res = await fetch(`${API_URL}/ordenes/mis-ordenes`, {
                headers: { 'Authorization': `Bearer ${auth?.token}` },
            });
            if (res.ok) {
                setOrdenes(await res.json());
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar pedidos');
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (order: Orden) => {
        setSelectedOrder(order);
        setDialogOpen(true);
    };

    if (!auth?.isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 pt-8">
                <div className="max-w-4xl mx-auto px-4">
                    <Skeleton className="h-10 w-48 mb-6" />
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-32" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-stone-50 pt-44 pb-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/cuenta">
                            <Button variant="outline" size="icon">
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="font-serif text-3xl tracking-wide">Mis Pedidos</h1>
                            <p className="text-stone-500">Historial de compras</p>
                        </div>
                    </div>

                    {ordenes.length === 0 ? (
                        <Card>
                            <CardContent className="py-16 text-center">
                                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-stone-300" />
                                <p className="text-stone-500 mb-4">Aún no tienes pedidos</p>
                                <Link href="/productos">
                                    <Button className="bg-amber-700 hover:bg-amber-800">
                                        Explorar productos
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {ordenes.map((orden) => (
                                <Card key={orden.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-lg bg-blue-50">
                                                    <Package className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Pedido #{orden.id}</p>
                                                    <p className="text-sm text-stone-500">
                                                        {orden.createdAt ? format(new Date(orden.createdAt), 'dd/MM/yyyy') : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="font-medium">${orden.total?.toLocaleString()}</p>
                                                    <Badge className={statusColors[orden.estado] || 'bg-gray-100'}>
                                                        {statusLabels[orden.estado] || orden.estado}
                                                    </Badge>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleViewOrder(orden)}
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalle del Pedido #{selectedOrder?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-stone-500">Fecha</p>
                                    <p className="font-medium">
                                        {selectedOrder.createdAt ? format(new Date(selectedOrder.createdAt), 'dd/MM/yyyy HH:mm') : '-'}
                                    </p>
                                </div>
                                <Badge className={statusColors[selectedOrder.estado] || 'bg-gray-100'}>
                                    {statusLabels[selectedOrder.estado] || selectedOrder.estado}
                                </Badge>
                            </div>

                            {selectedOrder.direccionEnvio && (
                                <div>
                                    <p className="text-sm text-stone-500 mb-2">Dirección de Envío</p>
                                    <div className="p-3 bg-stone-50 rounded">
                                        <p>{selectedOrder.direccionEnvio}</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-stone-500 mb-2">Productos</p>
                                <div className="space-y-2">
                                    {selectedOrder.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between p-3 bg-stone-50 rounded">
                                            <div>
                                                <p className="font-medium">{item.producto?.nombre}</p>
                                                <p className="text-sm text-stone-600">
                                                    {item.talla && `Talla: ${item.talla}`}
                                                    {item.color && ` • Color: ${item.color}`}
                                                    {` • Cantidad: ${item.cantidad}`}
                                                </p>
                                            </div>
                                            <p className="font-medium">${item.subtotal?.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                {selectedOrder.subtotal && (
                                    <div className="flex justify-between mb-2">
                                        <span>Subtotal</span>
                                        <span>${selectedOrder.subtotal?.toLocaleString()}</span>
                                    </div>
                                )}
                                {selectedOrder.costoEnvio && (
                                    <div className="flex justify-between mb-2">
                                        <span>Envío</span>
                                        <span>${selectedOrder.costoEnvio?.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${selectedOrder.total?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
