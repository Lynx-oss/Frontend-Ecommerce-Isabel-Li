import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": 'application/json',
    },
});


export const getProductos = async () => {
    try {
        const response = await api.get('/productos');
        return response.data;
    } catch (error) {
        console.error('error fetching productos', error);
        throw error;
    }
}

export const getProductosById = async (id) => {
    try {
        const response = await api.get(`/productos/${id}`);
        return response.data;
    } catch (error) {
        console.error('error fetching producto: ', error);
        throw error;
    }
}

export const getProductosByCategoria = async (categoriaId) => {
    try {
        const response = await api.get(`/productos/categoria/${categoriaId}`);
        return response.data;
    } catch (error) {
        console.error('error fetching productos by categoria: ', error);
        throw error;
    }
}

export const getCategorias = () => {
    return [
        { id: 1, nombre: 'Remeras y Tops', imagen: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400&h=500&fit=crop' },
        { id: 2, nombre: 'Pantalones', imagen: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=500&fit=crop' },
        { id: 3, nombre: 'Vestidos', imagen: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop' },
        { id: 4, nombre: 'Buzos y Sweaters', imagen: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop' },
        { id: 5, nombre: 'Camperas y Abrigos', imagen: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop' },
        { id: 6, nombre: 'Accesorios', imagen: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=500&fit=crop' },
    ]
}
