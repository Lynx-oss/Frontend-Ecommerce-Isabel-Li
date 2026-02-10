'use client'
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/authContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Tags } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Categoria { id: number; nombre: string; }

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function CategoriesManager() {
  const auth = useContext(AuthContext);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [nombre, setNombre] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/categorias`);
      setCategorias(await res.json());
    } catch { toast.error('Error al cargar'); }
    finally { setLoading(false); }
  };

  const handleOpenDialog = (categoria: Categoria | null = null) => {
    if (categoria) {
      setEditing(categoria);
      setNombre(categoria.nombre);
    } else {
      setEditing(null);
      setNombre('');
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `${API_URL}/categorias/${editing.id}` : `${API_URL}/categorias`;
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth?.token}` },
        body: JSON.stringify({ nombre }),
      });
      if (res.ok) {
        toast.success(editing ? 'Categoría actualizada' : 'Categoría creada');
        setDialogOpen(false);
        setNombre('');
        setEditing(null);
        fetchData();
      } else { toast.error('Error al guardar'); }
    } catch { toast.error('Error de conexión'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      const res = await fetch(`${API_URL}/categorias/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${auth?.token}` },
      });
      if (res.ok) {
        toast.success('Categoría eliminada');
        fetchData();
      } else {
        toast.error('Error al eliminar');
      }
    } catch { toast.error('Error de conexión'); }
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
              <Skeleton key={i} className="h-12" />
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
          <CardTitle>Gestión de Categorías</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-amber-700 hover:bg-amber-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editing ? 'Editar Categoría' : 'Nueva Categoría'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre de la categoría *</Label>
                  <Input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Remeras, Vestidos, Accesorios..."
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
                    {editing ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {categorias.length === 0 ? (
          <div className="text-center py-12">
            <Tags className="h-16 w-16 mx-auto mb-4 text-stone-300" />
            <p className="text-stone-500">No hay categorías todavía</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categorias.map((categoria) => (
                  <TableRow key={categoria.id}>
                    <TableCell className="font-medium">#{categoria.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-md bg-orange-50">
                          <Tags className="h-4 w-4 text-orange-500" />
                        </span>
                        {categoria.nombre}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(categoria)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(categoria.id)}
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
        )}
      </CardContent>
    </Card>
  );
}