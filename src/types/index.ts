export interface Categoria {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  inventario: number;
  imagenUrl: string;
  categoria?: Categoria;
}

export interface CategoriaConImagen extends Categoria {
  imagen: string;
  slug: string;
}