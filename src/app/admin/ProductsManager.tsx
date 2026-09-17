'use client'
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/authContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Image as ImageIcon, Upload, X, Loader2, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Categoria { id: number; nombre: string; }
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  inventario: number;
  imagenes: string[];
  categoriaId: number;
  categoriaNombre: string;
  destacado?: boolean;
  nuevo?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function ProductsManager() {
  const auth = useContext(AuthContext);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    inventario: '',
    categoriaId: '',
    imagenes: [''],
    destacado: false,
    nuevo: false
  });

  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  // Reemplazar sortByStock simple con configuración completa
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => { fetchData(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    console.log('=== DEBUG UPLOAD ===');
    console.log('Token:', auth?.token ? 'Presente' : 'FALTA');
    console.log('User:', auth?.user);
    console.log('IsAdmin:', auth?.isAdmin);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formDataFile = new FormData();
      formDataFile.append('file', file);

      try {
        const response = await fetch(`${API_URL}/imagenes/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${auth?.token}` },
          body: formDataFile,
        });

        if (response.ok) {
          const data = await response.json();
          newUrls.push(data.url);
        } else {
          toast.error(`Error al subir ${file.name}`);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error(`Error al subir ${file.name}`);
      }
    }

    if (newUrls.length > 0) {
      const currentImages = formData.imagenes.filter(img => img.trim() !== '');
      setFormData({ ...formData, imagenes: [...currentImages, ...newUrls] });
      toast.success(`${newUrls.length} imagen(es) subida(s)`);
    }

    setUploading(false);
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.imagenes.filter((_, i) => i !== index);
    setFormData({ ...formData, imagenes: newImages.length > 0 ? newImages : [''] });
  };

    const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_URL}/productos`),
        fetch(`${API_URL}/categorias`),
      ]);
      
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProductos(Array.isArray(prodData) ? prodData : (prodData?.content || []));
      setCategorias(Array.isArray(catData) ? catData : (catData?.content || []));
 
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product: Producto | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio?.toString() || '',
        inventario: product.inventario?.toString() || '',
        categoriaId: product.categoriaId?.toString() || '',
        imagenes: product.imagenes?.length > 0 ? product.imagenes : [''],
        destacado: product.destacado || false,
        nuevo: product.nuevo || false
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        inventario: '',
        categoriaId: '',
        imagenes: [''],
        destacado: false,
        nuevo: false
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      inventario: parseInt(formData.inventario),
      imagenes: formData.imagenes.filter(img => img.trim() !== ''),
      categoria: { id: parseInt(formData.categoriaId) },
    };

    try {
      const url = editingProduct ? `${API_URL}/productos/${editingProduct.id}` : `${API_URL}/productos`;
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth?.token}` },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        toast.success(editingProduct ? 'Producto actualizado' : 'Producto creado');
        setDialogOpen(false);
        fetchData();
      } else {
        toast.error('Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${auth?.token}` },
      });
      if (response.ok) {
        toast.success('Eliminado');
        fetchData();
      } else if (response.status === 409) {
        const data = await response.json();
        toast.error(data.error || 'No se puede eliminar: el producto tiene órdenes asociadas');
      } else {
        toast.error('Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredProducts = productos
    .filter(p => p.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || p.categoriaId?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => !showLowStockOnly || (p.inventario || 0) < 10)
    .sort((a, b) => {
      if (!sortConfig) return 0;

      const { key, direction } = sortConfig;

      if (key === 'stock') {
        const stockA = a.inventario || 0;
        const stockB = b.inventario || 0;
        return direction === 'asc' ? stockA - stockB : stockB - stockA;
      }

      if (key === 'precio') {
        const precioA = a.precio || 0;
        const precioB = b.precio || 0;
        return direction === 'asc' ? precioA - precioB : precioB - precioA;
      }

      if (key === 'categoria') {
        const catA = a.categoriaNombre || '';
        const catB = b.categoriaNombre || '';
        return direction === 'asc'
          ? catA.localeCompare(catB)
          : catB.localeCompare(catA);
      }

      if (key === 'nombre') {
        const nombreA = a.nombre || '';
        const nombreB = b.nombre || '';
        return direction === 'asc'
          ? nombreA.localeCompare(nombreB)
          : nombreB.localeCompare(nombreA);
      }

      return 0;
    });
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gestión de Productos</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-amber-700 hover:bg-amber-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoría *</Label>
                    <Select value={formData.categoriaId} onValueChange={(v) => setFormData({ ...formData, categoriaId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map(cat => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>{cat.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Precio *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock *</Label>
                    <Input
                      type="number"
                      value={formData.inventario}
                      onChange={(e) => setFormData({ ...formData, inventario: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Imágenes</Label>

                  {formData.imagenes.filter(img => img.trim() !== '').length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {formData.imagenes.filter(img => img.trim() !== '').map((img, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={img}
                            alt={`Imagen ${i + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <label className="flex-1">
                      <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors">
                        {uploading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin text-amber-700" />
                            <span className="text-sm text-stone-600">Subiendo...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-stone-500" />
                            <span className="text-sm text-stone-600">Clic para subir imágenes</span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.destacado}
                      onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Destacado</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.nuevo}
                      onChange={(e) => setFormData({ ...formData, nuevo: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Nueva llegada</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
                    {editingProduct ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={showLowStockOnly}
                onChange={(e) => setShowLowStockOnly(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Solo stock bajo</span>
            </label>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-stone-50" onClick={() => handleSort('nombre')}>
                  <div className="flex items-center gap-1">
                    Producto
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-stone-50" onClick={() => handleSort('categoria')}>
                  <div className="flex items-center gap-1">
                    Categoría
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-stone-50" onClick={() => handleSort('precio')}>
                  <div className="flex items-center gap-1">
                    Precio
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-stone-50" onClick={() => handleSort('stock')}>
                  <div className="flex items-center gap-1">
                    Stock
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.imagenes?.[0] ? (
                        <img
                          src={product.imagenes[0]}
                          alt={product.nombre}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-stone-100 rounded flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-stone-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{product.nombre}</p>
                        {product.destacado && (
                          <Badge variant="secondary" className="text-xs mt-1">Destacado</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{product.categoriaNombre}</TableCell>
                  <TableCell>${product.precio?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={product.inventario < 10 ? 'destructive' : 'default'}>
                      {product.inventario || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.nuevo && (
                      <Badge className="bg-blue-100 text-blue-800">Nuevo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}