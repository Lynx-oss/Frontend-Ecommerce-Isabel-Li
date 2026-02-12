import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('isabel-li-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)


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

export const getCategorias = async () => {
    try {
        const response = await api.get('/categorias');
        return response.data;
    } catch (error){
        console.error('error fetching categorias: ', error);
        throw error;
    }
}
