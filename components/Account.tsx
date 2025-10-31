
import React from 'react';
import { CREDIT_PACKAGES, SUBSCRIPTION_PACKAGE } from '../constants';

interface AccountProps {
  credits: number;
  onAddCredits: (amount: number) => void;
  onSubscribe: () => void;
  isSubscribed: boolean;
}
type Props = {
  credits: number;
  onAddCredits?: (amount: number) => void;
  onSubscribe?: () => void;
  isSubscribed?: boolean;
};

export default function Account({
  credits,
  onAddCredits,
  onSubscribe,
  isSubscribed
}: Props) {
  return (
    <div>
      {/* Plano mensal */}
      <button
        type="button"
        onClick={() => onSubscribe?.()}
        className="w-full rounded-lg py-4 px-5 bg-pink-100 hover:bg-pink-200"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase tracking-wide">Plano Mensal</span>
          <span className="font-semibold">R$ 39,90</span>
        </div>
      </button>

      <div className="my-4 text-center text-xs text-gray-400">ou compra única</div>

      {/* 10 créditos */}
      <button
        type="button"
        onClick={() => onAddCredits?.(10)}
        className="w-full rounded-lg py-4 px-5 bg-pink-100 hover:bg-pink-200"
      >
        <div className="flex items-center justify-between">
          <span>10 Créditos</span>
          <span className="font-semibold">R$ 19,90</span>
        </div>
      </button>

      {/* 20 créditos */}
      <button
        type="button"
        onClick={() => onAddCredits?.(20)}
        className="mt-3 w-full rounded-lg py-4 px-5 bg-pink-100 hover:bg-pink-200"
      >
        <div className="flex items-center justify-between">
          <span>20 Créditos</span>
          <span className="font-semibold">R$ 29,90</span>
        </div>
      </button>
    </div>
  );
}


const Account: React.FC<AccountProps> = ({ credits, onAddCredits, onSubscribe, isSubscribed }) => {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-pink-100">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Minha Conta</h1>
        <p className="text-gray-600 mt-4">Gerencie seus créditos e continue criando.</p>
        <div className="mt-8">
          <p className="text-lg text-gray-500">Seu saldo atual é de</p>
          <p className="text-6xl font-extrabold text-pink-600 my-2">{credits}</p>
          <p className="text-lg text-gray-500">crédito(s)</p>
        </div>
      </div>
      
      {isSubscribed && (
        <div className="text-center p-4 bg-green-100 text-green-800 rounded-2xl shadow-md">
          <p className="font-semibold">Você é um assinante! 🎉</p>
          <p className="text-sm">Seus {SUBSCRIPTION_PACKAGE.credits} créditos serão renovados mensalmente.</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Adicionar mais créditos</h2>
        <div className="space-y-4">

          <div className="relative border-2 border-pink-500 rounded-xl p-1 mb-4">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">PLANO MENSAL</div>
              <button
                onClick={onSubscribe}
                disabled={isSubscribed}
                className="w-full bg-pink-50 text-pink-800 font-semibold py-4 px-5 rounded-lg flex justify-between items-center hover:bg-pink-100 hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="text-lg">{SUBSCRIPTION_PACKAGE.credits} Créditos / Mês</span>
                <span className="text-lg font-bold bg-white px-3 py-1 rounded-md">{SUBSCRIPTION_PACKAGE.price}</span>
              </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">OU COMPRA ÚNICA</span>
            </div>
          </div>


          {CREDIT_PACKAGES.map((pkg) => (
            <button
              key={pkg.credits}
              onClick={() => onAddCredits(pkg.credits)}
              className="w-full bg-pink-100 text-pink-800 font-semibold py-4 px-5 rounded-xl flex justify-between items-center hover:bg-pink-200 hover:shadow-md transition-all duration-200"
            >
              <span className="text-lg">{pkg.credits} Créditos</span>
              <span className="text-lg font-bold bg-white px-3 py-1 rounded-md">{pkg.price}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Account;
