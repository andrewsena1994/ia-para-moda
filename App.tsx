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
import { createMpCheckout } from "./services/payments";
import { CREDIT_PACKAGES } from "./constants";


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [credits, setCredits] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  
  const [pendingAction, setPendingAction] = useState<{ cost: number, action: (() => Promise<void>) | null }>({ cost: 0, action: null });

  useEffect(() => {
    // Check for a logged in user in localStorage on initial load
    const loggedInUserEmail = localStorage.getItem('currentUserEmail');
    if (loggedInUserEmail) {
      const user = db_getUser(loggedInUserEmail);
      if (user) {
        // Fix: The 'user' object (UserData) doesn't contain the email. Use 'loggedInUserEmail' instead.
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
      setits(INITIAL_FREE_ITS);
      setIsSubscribed(false);
      db_saveUser(user.email, { its: INITIAL_FREE_ITS, isSubscribed: false });
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

  const updateUserCredits = (newCreditAmount: number) => {
    setCredits(newCreditAmount);
    if(currentUser) {
        db_saveUser(currentUser.email, { credits: newCreditAmount, isSubscribed });
    }
  };

  const updateUserSubscription = (newIsSubscribed: boolean, creditsToAdd: number) => {
    setIsSubscribed(newIsSubscribed);
    const newCreditAmount = credits + creditsToAdd;
    setCredits(newCreditAmount);
     if(currentUser) {
        db_saveUser(currentUser.email, { credits: newCreditAmount, isSubscribed: newIsSubscribed });
    }
  };

// 🔹 Função para comprar créditos
async function purchaseCredits(pkg) {
  const user = await db_getUser();
  const amount = parseFloat(pkg.price.replace("R$", "").replace(",", "."));
  const data = await createMpCheckout(user.email, pkg.name, amount);
  if (data?.ok && data?.url) {
    window.location.href = data.url; // redireciona pro Mercado Pago
  } else {
    alert("Erro ao criar pagamento, tente novamente.");
  }
}

// 🔹 Função para assinar plano mensal
async function purchaseSubscription() {
  const user = await db_getUser();
  const amount = 29.9; // valor do plano PRO
  const data = await createMpCheckout(user.email, "Plano PRO Mensal", amount);
  if (data?.ok && data?.url) {
    window.location.href = data.url;
  } else {
    alert("Erro ao iniciar assinatura.");
  }
}

  const requestAction = useCallback((cost: number, action: () => Promise<void>) => {
    if (credits >= cost) {
      updateUserCredits(credits - cost);
      action();
    } else {
      setPendingAction({cost: cost, action: action});
      setIsPricingModalOpen(true);
    }
  }, [credits, currentUser]);

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
        return <Account credits={credits} onAddCredits={addCredits} onSubscribe={startSubscription} isSubscribed={isSubscribed} />;
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
        onClose={() => setIsPricingModalOpen(false)}
        onAddCredits={addCredits}
        onSubscribe={startSubscription}
      />
    </div>
  );
};

export default App;
