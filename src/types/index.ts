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

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (producto: Producto, cantidad?: number) => void;
  removeItem: (productoId: number) => void;
  updateQuantity: (productoId: number, cantidad: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;

}