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
import { createMpCheckout } from './services/payments';
import { CREDIT_PACKAGES, SUBSCRIPTION_PACKAGE } from './constants';


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

// converte "19,90" para 19.90
const toNumber = (v: string) => parseFloat(v.replace('.', '').replace(',', '.'));

async function purchaseCredits(amountCredits: number) {
  if (!currentUser) return;
  const pkg = CREDIT_PACKAGES.find(p => p.credits === amountCredits);
  if (!pkg) return;
  const price = toNumber(pkg.price);
  const url = await createMpCheckout(currentUser.email, `${pkg.credits} créditos`, price);
  if (url) window.location.href = url;
}

async function purchaseSubscription() {
  if (!currentUser || isSubscribed) return;
  const price = toNumber(SUBSCRIPTION_PACKAGE.price);
  const url = await createMpCheckout(currentUser.email, 'Plano mensal', price);
  if (url) window.location.href = url;
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
        return <Account
  credits={credits}
  onAddCredits={purchaseCredits}
  onSubscribe={purchaseSubscription}
  isSubscribed={isSubscribed}
/>
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
Integração do checkout Mercado Pago no App.tsx
