'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

export default function RegistroPage(): React.JSX.Element {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    telefono: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido) {
      newErrors.apellido = 'El apellido es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono || undefined,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="inline-block">
            <h1 className="font-serif text-2xl md:text-3xl tracking-[0.3em] text-stone-900 text-center">
              ISABEL-LI
            </h1>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-light text-stone-900 mb-2">
              Crear Cuenta
            </h2>
            <p className="text-sm text-stone-500">
              Unite a ISABEL-LI
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  htmlFor="nombre" 
                  className="block text-sm font-light text-stone-700 mb-2 tracking-wide"
                >
                  NOMBRE *
                </label>
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Isabel"
                  className={`h-12 border-stone-300 focus:border-stone-900 focus:ring-stone-900 rounded-none ${
                    errors.nombre ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  required
                />
                {errors.nombre && (
                  <p className="text-xs text-red-600 mt-1.5">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="apellido" 
                  className="block text-sm font-light text-stone-700 mb-2 tracking-wide"
                >
                  APELLIDO *
                </label>
                <Input
                  id="apellido"
                  name="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Li"
                  className={`h-12 border-stone-300 focus:border-stone-900 focus:ring-stone-900 rounded-none ${
                    errors.apellido ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  required
                />
                {errors.apellido && (
                  <p className="text-xs text-red-600 mt-1.5">{errors.apellido}</p>
                )}
              </div>
            </div>

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-light text-stone-700 mb-2 tracking-wide"
              >
                EMAIL *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className={`h-12 border-stone-300 focus:border-stone-900 focus:ring-stone-900 rounded-none ${
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                required
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor="telefono" 
                className="block text-sm font-light text-stone-700 mb-2 tracking-wide"
              >
                TELÉFONO <span className="text-stone-400">(opcional)</span>
              </label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+54 9 11 1234-5678"
                className="h-12 border-stone-300 focus:border-stone-900 focus:ring-stone-900 rounded-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-light text-stone-700 mb-2 tracking-wide"
                >
                  CONTRASEÑA *
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`h-12 border-stone-300 focus:border-stone-900 focus:ring-stone-900 rounded-none pr-12 ${
                      errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1.5">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-light text-stone-700 mb-2 tracking-wide"
                >
                  CONFIRMAR *
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`h-12 border-stone-300 focus:border-stone-900 focus:ring-stone-900 rounded-none ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1.5">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white text-sm tracking-wider font-light rounded-none transition-colors"
              >
                {loading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
              </Button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-stone-400 tracking-wider">
                O
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-stone-600">
              ¿Ya tenés cuenta?{' '}
              <Link 
                href="/login" 
                className="text-stone-900 font-medium underline underline-offset-4 hover:text-stone-700 transition-colors"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/" 
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors inline-flex items-center gap-2"
            >
              <span>←</span>
              <span>Volver a la tienda</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}