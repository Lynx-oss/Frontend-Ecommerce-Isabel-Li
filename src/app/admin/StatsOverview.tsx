'use client'
import { useEffect, useState, useContext, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { AuthContext } from '@/context/authContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FolderTree, ShoppingCart, DollarSign, TrendingUp, Users, AlertTriangle, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import ExcelJs from 'exceljs';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface Producto {
  id: number;
  nombre: string;
  inventario: number;
  imagenes: string[];
  categoria: { id: number; nombre: string };
  precio: number;
}

interface Orden {
  id: number;
  total: number;
  estado: string;
  createdAt: string;
  usuario?: { nombre: string; email: string };
  user?: { nombre: string; email: string };
  cliente?: { nombre: string; email: string };
}

export default function StatsOverview() {
  const auth = useContext(AuthContext);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([]);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, catRes, ordRes] = await Promise.all([
          fetch(`${API_URL}/productos`),
          fetch(`${API_URL}/categorias`),
          fetch(`${API_URL}/ordenes/admin/todas`, {
            headers: { 'Authorization': `Bearer ${auth?.token}` }
          }).catch(() => ({ ok: false, json: () => Promise.resolve([]) }))
        ]);

        setProductos(await prodRes.json());
        setCategorias(await catRes.json());
        if (ordRes.ok) {
          setOrdenes(await ordRes.json());
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [auth?.token]);

  const validRevenueStatuses = ['PAGADO', 'PROCESANDO', 'ENVIADO', 'ENTREGADO'];

  const totalRevenue = ordenes
    .filter(order => validRevenueStatuses.includes(order.estado))
    .reduce((sum, order) => sum + (order.total || 0), 0);

  const pendingOrders = ordenes.filter(o => o.estado === 'PENDIENTE' || o.estado === 'PROCESANDO').length;
  const lowStockProducts = productos.filter(p => (p.inventario || 0) < 10);

  const salesData = useMemo(() => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const daysInMonth = eachDayOfInterval({ start, end });

    return daysInMonth.map(day => {
      const dailyTotal = ordenes
        .filter(order => {
          if (!order.createdAt) return false;
          if (!validRevenueStatuses.includes(order.estado)) return false;
          return isSameDay(new Date(order.createdAt), day);
        })
        .reduce((sum, order) => sum + (order.total || 0), 0);

      return {
        name: format(day, 'd'), // Día del mes (1, 2, 3...)
        ventas: dailyTotal,
        fullDate: format(day, 'd MMMM', { locale: es })
      };
    });
  }, [ordenes, selectedDate]);

  const categoryData = productos.reduce((acc: Record<string, number>, product) => {
    const cat = product.categoria?.nombre || 'Sin categoría';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    cantidad: value
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Ingresos Totales',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      textColor: 'black',
      change: '+12.5%'
    },
    {
      title: 'Pedidos',
      value: ordenes.length,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      textColor: 'text-black',
      change: `${pendingOrders} pendientes`
    },
    {
      title: 'Productos',
      value: productos.length,
      icon: Package,
      color: 'bg-purple-500',
      textColor: 'text-black',
      change: `${lowStockProducts.length} stock bajo`
    },
    {
      title: 'Categorías',
      value: categorias.length,
      icon: FolderTree,
      color: 'bg-amber-500',
      textColor: 'text-black',
      change: 'Activas'
    }
  ];

  const exportToExcel = async () => {
    const workbook = new ExcelJs.Workbook();
    workbook.creator = 'Isabel Li';
    workbook.created = new Date();

    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const monthName = format(selectedDate, 'MMMM yyyy', { locale: es });
    const cleanMonthName = format(selectedDate, 'MMM-yyyy', { locale: es });

    const ordenesMes = ordenes.filter(orden => {
      if (!orden.createdAt) return false;
      const fechaOrden = new Date(orden.createdAt);
      return fechaOrden >= start && fechaOrden <= end;
    });

    const sheet1 = workbook.addWorksheet('Detalle Órdenes');
    sheet1.columns = [
      { header: 'N° Orden', key: 'id', width: 12 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Cliente', key: 'cliente', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Total', key: 'total', width: 12 },
      { header: 'Estado', key: 'estado', width: 15 }
    ];

    sheet1.getRow(1).font = { bold: true };
    sheet1.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '' } };

    ordenesMes.forEach(orden => {
      const usuario = orden.usuario || orden.user || orden.cliente;
      const email = usuario?.email || '-';

      sheet1.addRow({
        id: orden.id,
        fecha: orden.createdAt ? format(new Date(orden.createdAt), 'dd/MM/yyyy') : '-',
        cliente: usuario?.nombre || 'Cliente',
        email: email,
        total: orden.total || 0,
        estado: orden.estado
      });
    });

    const sheet2 = workbook.addWorksheet('Ventas Diarias');
    sheet2.columns = [
      { header: 'Día', key: 'dia', width: 10 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Cantidad Órdenes', key: 'cantidad', width: 18 },
      { header: 'Total Ventas', key: 'ventas', width: 15 }
    ];

    sheet2.getRow(1).font = { bold: true };
    sheet2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4ECDC4' } };

    const ventasPorDia: Record<string, { cantidad: number; total: number; fullDate: string }> = {};

    const daysInMonth = eachDayOfInterval({ start, end });
    daysInMonth.forEach(day => {
      const dayKey = format(day, 'dd');
      ventasPorDia[dayKey] = {
        cantidad: 0,
        total: 0,
        fullDate: format(day, 'dd/MM/yyyy')
      };
    });

    ordenesMes.forEach(orden => {
      if (orden.createdAt && validRevenueStatuses.includes(orden.estado)) {
        const fecha = new Date(orden.createdAt);
        const dayKey = format(fecha, 'dd');
        if (ventasPorDia[dayKey]) {
          ventasPorDia[dayKey].cantidad++;
          ventasPorDia[dayKey].total += orden.total || 0;
        }
      }
    });

    Object.entries(ventasPorDia).forEach(([dia, data]) => {
      sheet2.addRow({
        dia: dia,
        fecha: data.fullDate,
        cantidad: data.cantidad,
        ventas: data.total
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_ventas_${cleanMonthName}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-stone-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-stone-400">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ventas: {format(selectedDate, 'MMMM yyyy', { locale: es })}</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={() => setSelectedDate(subMonths(selectedDate, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setSelectedDate(addMonths(selectedDate, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" label={{ value: 'Día', position: 'insideBottom', offset: -5 }} />
                <YAxis stroke="#888" />
                <Tooltip
                  labelFormatter={(label) => `Día ${label}`}
                  formatter={(value: any) => [`$${value}`, 'Ventas']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="#b45309"
                  strokeWidth={2}
                  dot={{ fill: '#b45309', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-end mt-4">
              <Button onClick={exportToExcel} className="bg-amber-700 hover:bg-amber-800 text-white">
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="cantidad" fill="#b45309" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>


      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Productos con Stock Bajo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockProducts.length === 0 ? (
            <p className="text-stone-500 text-center py-8">Todos los productos tienen stock suficiente</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {product.imagenes?.[0] && (
                      <img
                        src={product.imagenes[0]}
                        alt={product.nombre}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.nombre}</p>
                      <p className="text-sm text-stone-500">{product.categoria?.nombre}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-red-600">
                    Stock: {product.inventario || 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}