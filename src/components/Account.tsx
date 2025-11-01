import React from 'react';
import { CREDIT_PACKAGES, SUBSCRIPTION_PACKAGE } from '../constants';

interface AccountProps {
  credits: number;
  onAddCredits: (amount: number) => void;
  onSubscribe: () => void;
  isSubscribed: boolean;
  isProcessingPayment: boolean;
  paymentState: 'idle' | 'generating' | 'confirming';
  checkoutUrl: string | null;
  onConfirmPayment: () => void;
  onCancelPaymentProcess: () => void;
}

const Account: React.FC<AccountProps> = ({ 
  credits, 
  onAddCredits, 
  onSubscribe, 
  isSubscribed, 
  isProcessingPayment,
  paymentState,
  checkoutUrl,
  onConfirmPayment,
  onCancelPaymentProcess
}) => {

  const processingMessage = paymentState === 'generating' 
    ? 'Gerando link de pagamento...' 
    : 'Confirmando pagamento, aguarde...';

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

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 relative">
        {(isProcessingPayment || checkoutUrl) && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-2xl p-4 text-center">
            {checkoutUrl ? (
              <>
                <h3 className="text-xl font-bold text-gray-800">Finalize seu Pagamento</h3>
                <p className="text-gray-600 mt-2 mb-4">
                  Use o link seguro do Mercado Pago e depois confirme o pagamento.
                </p>
                <a 
                  href={checkoutUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full max-w-xs bg-blue-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-600 transition-transform transform hover:scale-105 duration-200 shadow-lg"
                >
                  <span>Pagar Agora</span>
                </a>
                <button 
                  onClick={onConfirmPayment} 
                  className="w-full max-w-xs mt-3 bg-green-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-green-600 transition-transform transform hover:scale-105 duration-200 shadow-lg"
                >
                  <span>Já Paguei, Confirmar</span>
                </button>
                <button onClick={onCancelPaymentProcess} className="text-sm text-gray-500 mt-4 hover:text-gray-800 transition-colors">
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-gray-700 font-semibold">{processingMessage}</p>
              </>
            )}
          </div>
        )}
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
