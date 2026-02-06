'use client'
import React, { createContext, useState, useEffect, } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Usuario, AuthResponse, LoginRequest, RegisterRequest, AuthContextType, AuthProviderProps, ApiErrorResponse } from '@/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';


function getInitialAuth(): { token: string | null; user: Usuario | null } {
    if (typeof window === 'undefined') {
        return { token: null, user: null };
    }

    try {
        const savedToken = localStorage.getItem('isabel-li-token');
        const savedUser = localStorage.getItem('isabel-li-user');

        if (savedToken && savedUser) {
            return {
                token: savedToken,
                user: JSON.parse(savedUser)
            };
        }
    } catch (error) {
        console.error('Error cargando auth:', error);
        localStorage.removeItem('isabel-li-token');
        localStorage.removeItem('isabel-li-user');
    }

    return { token: null, user: null };
}

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
    const initialAuth = getInitialAuth();
    const [user, setUser] = useState<Usuario | null>(initialAuth.user);
    const [token, setToken] = useState<string | null>(initialAuth.token);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (token && user) {
            localStorage.setItem('isabel-li-token', token);
            localStorage.setItem('isabel-li-user', JSON.stringify(user));
        } else {
            localStorage.removeItem('isabel-li-token');
            localStorage.removeItem('isabel-li-user');
        }
    }, [token, user]);

    const login = async (data: LoginRequest): Promise<void> => {
        setLoading(true);
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
                email: data.email,
                password: data.password,
            });

            const { token: newToken, email: userEmail, nombre, rol } = response.data;

            const userData: Usuario = {
                email: userEmail,
                nombre,
                rol: rol as 'USER' | 'ADMIN',
            };

            setToken(newToken);
            setUser(userData);

            toast.success(`¡Bienvenido, ${nombre}!`);
            router.push('/');
        } catch (error) {
            console.error('Login error:', error);

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                const message = axiosError.response?.data?.message ||
                    axiosError.response?.data?.error ||
                    'Error al iniciar sesión';
                toast.error(message);
                throw new Error(message);
            }

            const message = 'Error inesperado al iniciar sesión';
            toast.error(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterRequest): Promise<void> => {
        setLoading(true);
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, data);

            const { token: newToken, email: userEmail, nombre, rol } = response.data;

            const userData: Usuario = {
                email: userEmail,
                nombre,
                rol: rol as 'USER' | 'ADMIN',
            };

            setToken(newToken);
            setUser(userData);

            toast.success('Cuenta creada exitosamente');
            router.push('/');
        } catch (error) {
            console.error('Register error:', error);

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                const message = axiosError.response?.data?.message ||
                    axiosError.response?.data?.error ||
                    'Error al registrarse';
                toast.error(message);
                throw new Error(message);
            }

            const message = 'Error inesperado al registrarse';
            toast.error(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const logout = (): void => {
        setToken(null);
        setUser(null);
        toast.info('Sesión cerrada');
        router.push('/');
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.rol === 'ADMIN',
        login,
        register,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}