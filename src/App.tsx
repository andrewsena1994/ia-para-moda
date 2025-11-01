import React, { useState, useCallback, useEffect } from 'react';
import type { ActiveTab, User } from './types';
import { INITIAL_FREE_CREDITS, SUBSCRIPTION_PACKAGE } from './constants';
import Header from './components/Header';
import MagicStudio from './components/MagicStudio';
import CaptionGenerator from './components/CaptionGenerator';
import SocialPlanner from './components/SocialPlanner';
import Account from './components/Account';
import PricingModal from './components/PricingModal';
import Auth from './components/Auth';
import { db_getUser, db_saveUser } from './services/db';
import { createPreference, createSubscription } from './services/paymentService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [credits, setCredits] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  
  const [paymentState, setPaymentState] = useState<'idle' | 'generating' | 'confirming'>('idle');
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [purchaseToConfirm, setPurchaseToConfirm] = useState<{ amount: number; isSubscription: boolean } | null>(null);

  const [pendingAction, setPendingAction] = useState<{ cost: number, action: (() => Promise<void>) | null }>({ cost: 0, action: null });

  useEffect(() => {
    // Check for a logged in user in localStorage on initial load
    const loggedInUserEmail = localStorage.getItem('currentUserEmail');
    if (loggedInUserEmail) {
      const user = db_getUser(loggedInUserEmail);
      if (user) {
        setCurrentUser({ email: loggedInUserEmail });
        setCredits(user.credits);
        setIsSubscribed(user.isSubscribed);
      }
    }
  }, []);

  const handleAuthSuccess = (user: User, isNewUser: boolean) => {
    setCurrentUser(user);
    localStorage.setItem('currentUserEmail', user.email);
    
    if (isNewUser) {
      setCredits(INITIAL_FREE_CREDITS);
      setIsSubscribed(false);
      db_saveUser(user.email, { credits: INITIAL_FREE_CREDITS, isSubscribed: false });
    } else {
      const userData = db_getUser(user.email);
      setCredits(userData?.credits ?? 0);
      setIsSubscribed(userData?.isSubscribed ?? false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentUserEmail');
    setCurrentUser(null);
    setCredits(0);
    setIsSubscribed(false);
    setActiveTab('studio');
  };

  const updateUserCredits = useCallback((newCreditAmount: number) => {
    setCredits(newCreditAmount);
    if(currentUser) {
        db_saveUser(currentUser.email, { credits: newCreditAmount, isSubscribed });
    }
  }, [currentUser, isSubscribed]);


  const cancelPaymentProcess = () => {
    setCheckoutUrl(null);
    setPurchaseToConfirm(null);
    setPaymentState('idle');
  };

  const addCredits = async (amount: number) => {
    if (paymentState !== 'idle') return;
    setPaymentState('generating');
    setCheckoutUrl(null);
    
    try {
      // Esta é a chamada para o seu backend para criar o pagamento.
      // A função createPreference está em /services/paymentService.ts
      const { checkoutUrl } = await createPreference(amount, `${amount} Créditos - Estúdio de IA`);
      
      setCheckoutUrl(checkoutUrl);
      setPurchaseToConfirm({ amount, isSubscription: false });
      setPaymentState('idle'); // Reseta para o estado normal para mostrar o link
    } catch (error) {
      console.error("Erro ao gerar link de pagamento:", error);
      alert("Desculpe, não foi possível gerar o link de pagamento. Tente novamente mais tarde.");
      setPaymentState('idle'); // Reseta o estado em caso de erro
    }
  };
  
  const startSubscription = async () => {
    if (isSubscribed || paymentState !== 'idle') return;
    setPaymentState('generating');
    setCheckoutUrl(null);
    
    // =====================================================================================
    // IMPORTANTE: Substitua 'SEU_PLAN_ID_AQUI' pelo ID real do seu plano de assinatura.
    // Você cria este plano no painel de desenvolvedor do Mercado Pago.
    // O erro na sua imagem (SUB04-WOODPRVPTXML) provavelmente é por um ID de plano inválido.
    // =====================================================================================
    const MERCADO_PAGO_PLAN_ID = '1361129000437770';
    
    try {
      // Esta é a chamada para o seu backend para criar a assinatura.
      // A função createSubscription está em /services/paymentService.ts
      const { checkoutUrl } = await createSubscription(MERCADO_PAGO_PLAN_ID);

      const creditsToAdd = SUBSCRIPTION_PACKAGE.credits;
      setCheckoutUrl(checkoutUrl);
      setPurchaseToConfirm({ amount: creditsToAdd, isSubscription: true });
      setPaymentState('idle'); // Reseta para o estado normal para mostrar o link
    } catch (error) {
      console.error("Erro ao gerar link de assinatura:", error);
      alert("Desculpe, não foi possível gerar o link de assinatura. Tente novamente mais tarde.");
      setPaymentState('idle'); // Reseta o estado em caso de erro
    }
  };

  const confirmPayment = () => {
    if (!purchaseToConfirm || paymentState !== 'idle') return;
    
    setPaymentState('confirming');
    setCheckoutUrl(null);

    // Simulação da confirmação de pagamento.
    // Em um sistema real, o Mercado Pago enviaria uma notificação (webhook) para o seu backend
    // quando o pagamento fosse aprovado. Seu backend então atualizaria os créditos do usuário
    // no banco de dados. O botão "Já Paguei" é uma alternativa manual para o usuário confirmar,
    // mas o webhook é o método ideal e mais seguro para automatizar a liberação dos créditos.
    setTimeout(() => {
      if (purchaseToConfirm.isSubscription) {
        const creditsToAdd = purchaseToConfirm.amount;
        const creditsAfterSubscription = credits + creditsToAdd;
        let finalCredits = creditsAfterSubscription;
        
        setIsSubscribed(true);

        if (pendingAction.action && creditsAfterSubscription >= pendingAction.cost) {
          finalCredits = creditsAfterSubscription - pendingAction.cost;
          pendingAction.action();
          setPendingAction({ cost: 0, action: null });
        }
        
        setCredits(finalCredits);
        if (currentUser) {
            db_saveUser(currentUser.email, { credits: finalCredits, isSubscribed: true });
        }
        alert('Assinatura ativada com sucesso! Créditos adicionados.');

      } else { // One-time credit purchase
        const amount = purchaseToConfirm.amount;
        const newCreditAmount = credits + amount;

        if (pendingAction.action && newCreditAmount >= pendingAction.cost) {
          const finalCredits = newCreditAmount - pendingAction.cost;
          updateUserCredits(finalCredits);
          pendingAction.action();
          setPendingAction({ cost: 0, action: null });
        } else {
          updateUserCredits(newCreditAmount);
        }
        alert('Pagamento bem-sucedido! Créditos adicionados.');
      }

      setIsPricingModalOpen(false);
      setPaymentState('idle');
      setPurchaseToConfirm(null);
    }, 2000);
  };

  const requestAction = useCallback((cost: number, action: () => Promise<void>) => {
    if (credits >= cost) {
      updateUserCredits(credits - cost);
      action();
    } else {
      setPendingAction({cost: cost, action: action});
      setIsPricingModalOpen(true);
    }
  }, [credits, updateUserCredits]);

  if (!currentUser) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'studio':
        return <MagicStudio requestAction={requestAction} />;
      case 'caption':
        return <CaptionGenerator requestAction={requestAction} />;
      case 'planner':
        return <SocialPlanner requestAction={requestAction} />;
      case 'account':
        return <Account 
                  credits={credits} 
                  onAddCredits={addCredits} 
                  onSubscribe={startSubscription} 
                  isSubscribed={isSubscribed} 
                  isProcessingPayment={paymentState !== 'idle'}
                  paymentState={paymentState}
                  checkoutUrl={checkoutUrl}
                  onConfirmPayment={confirmPayment}
                  onCancelPaymentProcess={cancelPaymentProcess}
                />;
      default:
        return <MagicStudio requestAction={requestAction} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        credits={credits}
        userEmail={currentUser.email}
        onLogout={handleLogout}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => {
          setIsPricingModalOpen(false);
          cancelPaymentProcess();
        }}
        onAddCredits={addCredits}
        onSubscribe={startSubscription}
        isProcessingPayment={paymentState !== 'idle'}
        paymentState={paymentState}
        checkoutUrl={checkoutUrl}
        onConfirmPayment={confirmPayment}
      />
    </div>
  );
};

export default App;
