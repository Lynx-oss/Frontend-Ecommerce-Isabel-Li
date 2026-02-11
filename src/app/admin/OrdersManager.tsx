'use client'
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/authContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Package } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

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
  usuario?: {
    nombre: string;
    email: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const statusColors: Record<string, string> = {
  PENDIENTE: 'bg-yellow-100 text-black-800 hover:bg-yellow-100',
  PAGADO: 'bg-blue-100 text-black-800 hover:bg-blue-100',
  ENVIADO: 'bg-indigo-100 text-black-800 hover:bg-indigo-100',
  ENTREGADO: 'bg-green-100 text-black-800 hover:bg-green-100',
  CANCELADO: 'bg-red-100 text-black-800 hover:bg-red-100'
};

const statusLabels: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  PAGADO: 'Pagado',
  ENVIADO: 'Enviado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado'
};

const ESTADOS = ['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

export default function OrdersManager() {
  const auth = useContext(AuthContext);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Orden | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/ordenes/admin/todas`, {
        headers: { 'Authorization': `Bearer ${auth?.token}` },
      });
      if (res.ok) {
        setOrdenes(await res.json());
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id: number, estado: string) => {
    try {
      const res = await fetch(`${API_URL}/ordenes/admin/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth?.token}` },
        body: JSON.stringify({ estado }),
      });
      if (res.ok) {
        toast.success('Estado actualizado');
        fetchData();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error');
    }
  };

  const handleViewOrder = (order: Orden) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {ordenes.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-stone-300" />
              <p className="text-stone-500">No hay pedidos todavía</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Orden</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordenes.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.usuario?.nombre || 'Cliente'}</p>
                          <p className="text-sm text-stone-500">{order.usuario?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.createdAt ? format(new Date(order.createdAt), 'dd/MM/yyyy') : '-'}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${order.total?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.estado}
                          onValueChange={(status) => cambiarEstado(order.id, status)}
                        >
                          <SelectTrigger className="w-36">
                            <Badge className={statusColors[order.estado] || 'bg-gray-100'}>
                              {statusLabels[order.estado] || order.estado}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {ESTADOS.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {statusLabels[estado]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del Pedido #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-stone-500">Cliente</p>
                  <p className="font-medium">{selectedOrder.usuario?.nombre || 'Cliente'}</p>
                  <p className="text-sm text-stone-600">{selectedOrder.usuario?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Estado</p>
                  <Badge className={statusColors[selectedOrder.estado] || 'bg-gray-100'}>
                    {statusLabels[selectedOrder.estado] || selectedOrder.estado}
                  </Badge>
                </div>
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