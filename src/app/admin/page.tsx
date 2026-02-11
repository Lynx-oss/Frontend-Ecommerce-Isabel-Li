'use client'
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/authContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldAlert, LayoutDashboard, Package, Tags, ShoppingCart } from 'lucide-react';
import StatsOverview from './StatsOverview';
import ProductsManager from './ProductsManager';
import CategoriesManager from './CategoriesManager';
import OrdersManager from './OrdersManager';
export default function AdminDashboard() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const isAdmin = auth?.isAdmin ?? false;

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-stone-50 pt-6">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl tracking-wide">Panel de Administración</h1>
              <p className="text-stone-500 mt-1">Bienvenida, {auth?.user?.nombre}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg">
              <ShieldAlert className="h-5 w-5 text-amber-700" />
              <span className="text-sm font-medium text-amber-700">Administrador</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-stone-200 h-auto p-1">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-emerald-50 data-[state=active]: text-black:" 
            >
              <span className="p-1.5 rounded-md bg-black-50/70">  
                <LayoutDashboard className="h-4 w-4 " />
              </span>
              Resumen
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-violet-50 data-[state=active]:text-black"
            >
              <span className="p-1.5 rounded-md bg-black-50/70">
                <Package className="h-4 w-4 " />
              </span>
              Productos
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-orange-50 data-[state=active]:text-black"
            >
              <span className="p-1.5 rounded-md bg-black-50/70">
                <Tags className="h-4 w-4 " />
              </span>
              Categorías
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-black"
            >
              <span className="p-1.5 rounded-md bg-black-50/70">
                <ShoppingCart className="h-4 w-4 " />
              </span>
              Pedidos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <StatsOverview />
          </TabsContent>
          <TabsContent value="products">
            <ProductsManager />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesManager />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}