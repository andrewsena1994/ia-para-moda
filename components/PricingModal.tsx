import React from 'react';
import { CREDIT_PACKAGES, SUBSCRIPTION_PACKAGE } from '../constants';
import CloseIcon from './icons/CloseIcon';
import SparklesIcon from './icons/SparklesIcon';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCredits: (amount: number) => void;
  onSubscribe: () => void;
  isProcessingPayment: boolean;
  paymentState: 'idle' | 'generating' | 'confirming';
  checkoutUrl: string | null;
  onConfirmPayment: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddCredits, 
  onSubscribe, 
  isProcessingPayment,
  paymentState,
  checkoutUrl,
  onConfirmPayment
}) => {
  if (!isOpen) return null;

  const processingMessage = paymentState === 'generating' 
    ? 'Gerando link de pagamento seguro...' 
    : 'Confirmando seu pagamento, aguarde...';

  if (checkoutUrl) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative transform transition-all duration-300 scale-95 animate-scale-in">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <CloseIcon className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Finalize seu Pagamento</h2>
            <p className="text-gray-600 mt-2">
              Clique no botão para ser redirecionado(a) ao Mercado Pago. Após concluir, volte aqui e confirme.
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-600 transition-transform transform hover:scale-105 duration-200 shadow-lg"
            >
              <span>Pagar com Mercado Pago</span>
            </a>
            <button
              onClick={onConfirmPayment}
              className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-green-600 transition-transform transform hover:scale-105 duration-200 shadow-lg"
            >
              <span>Já Paguei, Adicionar Créditos</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative transform transition-all duration-300 scale-95 animate-scale-in">
        {isProcessingPayment && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-2xl">
            <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-700 font-semibold">{processingMessage}</p>
          </div>
        )}
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
