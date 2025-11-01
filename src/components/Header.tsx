import React from 'react';
import type { ActiveTab } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import PhotoIcon from './icons/PhotoIcon';
import CalendarIcon from './icons/CalendarIcon';
import UserIcon from './icons/UserIcon';
import LogOutIcon from './icons/LogOutIcon';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  credits: number;
  userEmail: string;
  onLogout: () => void;
}

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${
      isActive
        ? 'bg-pink-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-pink-100 hover:text-pink-700'
    }`}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
  </button>
);

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, credits, userEmail, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-10 p-2 md:p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-8 h-8 text-pink-500" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 hidden sm:block">
            Estúdio de IA para Moda
          </h1>
        </div>

        <nav className="flex items-center space-x-1 md:space-x-2 bg-gray-100 p-1 rounded-xl">
          <NavItem
            label="Estúdio Mágico"
            icon={<SparklesIcon className="w-5 h-5" />}
            isActive={activeTab === 'studio'}
            onClick={() => setActiveTab('studio')}
          />
          <NavItem
            label="Legendas"
            icon={<PhotoIcon className="w-5 h-5" />}
            isActive={activeTab === 'caption'}
            onClick={() => setActiveTab('caption')}
          />
          <NavItem
            label="Planejador"
            icon={<CalendarIcon className="w-5 h-5" />}
            isActive={activeTab === 'planner'}
            onClick={() => setActiveTab('planner')}
          />
           <NavItem
            label="Minha Conta"
            icon={<UserIcon className="w-5 h-5" />}
            isActive={activeTab === 'account'}
            onClick={() => setActiveTab('account')}
          />
        </nav>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm md:text-base font-semibold text-pink-600 bg-pink-100 px-3 py-2 rounded-lg">
            <span>Créditos:</span>
            <span className="font-bold">{credits}</span>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-100 rounded-full transition-colors"
            title="Sair"
          >
            <LogOutIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
