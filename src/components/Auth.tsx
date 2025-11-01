import React, { useState } from 'react';
import type { User } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import { db_getUser, db_saveUser } from '../services/db';

interface AuthProps {
  onAuthSuccess: (user: User, isNewUser: boolean) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (isLoginMode) {
      // Login logic
      const user = db_getUser(email);
      if (user && user.password === password) {
        onAuthSuccess({ email }, false);
      } else {
        setError('Email ou senha inválidos.');
      }
    } else {
      // Registration logic
      if (db_getUser(email)) {
        setError('Este email já está cadastrado. Tente fazer login.');
      } else {
        db_saveUser(email, { password, credits: 0, isSubscribed: false });
        onAuthSuccess({ email }, true);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
            <SparklesIcon className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">
                Bem-vindo(a)!
            </h2>
            <p className="mt-2 text-gray-600">
                {isLoginMode ? 'Faça login para continuar' : 'Crie sua conta para começar'}
            </p>
        </div>

        <div className="flex justify-center bg-gray-100 p-1.5 rounded-xl">
            <button onClick={() => { setIsLoginMode(true); setError(''); }} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 w-full ${isLoginMode ? 'bg-white text-pink-600 shadow' : 'text-gray-600'}`}>
                Entrar
            </button>
            <button onClick={() => { setIsLoginMode(false); setError(''); }} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 w-full ${!isLoginMode ? 'bg-white text-pink-600 shadow' : 'text-gray-600'}`}>
                Cadastrar
            </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-pink-500"
              placeholder="seu@email.com"
            />
            <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                Email
            </label>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-pink-500"
              placeholder="Senha"
            />
            <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                Senha
            </label>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-transform transform hover:scale-105"
            >
              {isLoginMode ? 'Entrar' : 'Criar Conta e Ganhar 5 Créditos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
