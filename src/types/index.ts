import { ReactNode } from 'react';

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
  imagenes: string[];
  categoriaId?: number;
  categoriaNombre?: string;
}

export interface CategoriaConImagen extends Categoria {
  imagen: string;
  slug: string;
}

export interface CartItem {
  id: number;
  producto: Producto;
  cantidad: number;
  talle?: string;
  color?: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (producto: Producto, cantidad?: number) => void;
  removeItem: (productoId: number) => void;
  updateQuantity: (productoId: number, cantidad: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  subtotal: number;
}

export interface Usuario {
  email: string;
  nombre: string;
  rol: 'USER' | 'ADMIN';
}


export interface AuthResponse {
  token: string;
  email: string;
  nombre: string;
  rol: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}


export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  apellido?: string;
  telefono?: string;
}

export interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface CategoriasContextType {
  categorias: CategoriaConImagen[];
  loading: boolean;
  error: string | null;
}


export interface AuthProviderProps {
  children: ReactNode;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}


