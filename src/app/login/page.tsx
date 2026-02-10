'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage(): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
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
        <div className="max-w-md w-full">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-light text-stone-900 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-sm text-stone-500">
              Accedé a tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-light text-stone-700 mb-2 tracking-wide"
              >
                EMAIL
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="h-12 border-stone-300 focus:border-stone-900 focus:ring-stone-900 rounded-none"
                required
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-light text-stone-700 mb-2 tracking-wide"
              >
                CONTRASEÑA
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 border-stone-300 focus:border-stone-900 focus:ring-stone-900 rounded-none pr-12"
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
            </div>

            <div className="text-right">
              <Link 
                href="/recuperar-password" 
                className="text-sm text-stone-600 hover:text-stone-900 underline underline-offset-4 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white text-sm tracking-wider font-light rounded-none transition-colors"
            >
              {loading ? 'INICIANDO...' : 'INICIAR SESIÓN'}
            </Button>
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
              ¿No tenés cuenta?{' '}
              <Link 
                href="/registro" 
                className="text-stone-900 font-medium underline underline-offset-4 hover:text-stone-700 transition-colors"
              >
                Crear cuenta
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