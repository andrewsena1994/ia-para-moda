import React from 'react';
import { CREDIT_PACKAGES, SUBSCRIPTION_PACKAGE } from '../constants';
import CloseIcon from './icons/CloseIcon';
import SparklesIcon from './icons/SparklesIcon';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCredits: (amount: number) => void;
  onSubscribe: () => void;
}

// components/PricingModal.tsx (trecho principal)
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAddCredits: (amountCredits: number) => void;
  onSubscribe: () => void;
};

export default function PricingModal({ isOpen, onClose, onAddCredits, onSubscribe }: Props) {
  if (!isOpen) return null;

  return (
    <div /* seu overlay e conteúdo */>
      <button onClick={() => onSubscribe()}>40 Créditos / Mês — R$ 39,90</button>
      <button onClick={() => onAddCredits(10)}>10 Créditos — R$ 19,90</button>
      <button onClick={() => onAddCredits(20)}>20 Créditos — R$ 29,90</button>
    </div>
  );
}


const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onAddCredits, onSubscribe }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative transform transition-all duration-300 scale-95 animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="text-center">
            <SparklesIcon className="w-12 h-12 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Créditos insuficientes</h2>
          <p className="text-gray-600 mt-2">
            Você não tem créditos suficientes para esta ação. Escolha um plano para continuar criando!
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="relative border-2 border-pink-500 rounded-lg p-1 bg-pink-50/50">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">ASSINATURA MENSAL</div>
            <button
              onClick={onSubscribe}
              className="w-full text-pink-800 font-semibold py-3 px-4 rounded-lg flex justify-between items-center hover:bg-pink-100 transition-colors duration-200"
            >
              <span>{SUBSCRIPTION_PACKAGE.credits} créditos / {SUBSCRIPTION_PACKAGE.interval}</span>
              <span className="font-bold text-lg">{SUBSCRIPTION_PACKAGE.price}</span>
            </button>
          </div>

          {CREDIT_PACKAGES.map((pkg) => (
            <button
              key={pkg.credits}
              onClick={() => onAddCredits(pkg.credits)}
              className="w-full bg-pink-100 text-pink-800 font-semibold py-3 px-4 rounded-lg flex justify-between items-center hover:bg-pink-200 transition-colors duration-200"
            >
              <span>{pkg.credits} Créditos</span>
              <span className="font-bold">{pkg.price}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
