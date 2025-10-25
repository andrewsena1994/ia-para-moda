
import React, { useState } from 'react';
import { generateSocialMediaPlan } from '../services/geminiService';
import CalendarIcon from './icons/CalendarIcon';

interface SocialPlannerProps {
  requestAction: (cost: number, action: () => Promise<void>) => void;
}

const SocialPlanner: React.FC<SocialPlannerProps> = ({ requestAction }) => {
  const [prompt, setPrompt] = useState('');
  const [plan, setPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!prompt) {
      setError("Por favor, descreva o que você precisa.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setPlan(null);
    
    const action = async () => {
      try {
        const fullPrompt = `Crie um plano de conteúdo para Instagram para uma loja de roupas femininas. O objetivo é ${prompt}. O plano deve ser detalhado, com ideias de posts para stories e feed, sugestões de formatos (reels, carrossel, etc) e temas.`;
        const result = await generateSocialMediaPlan(fullPrompt);
        setPlan(result);
      } catch (e: any) {
        setError(e.message || 'Ocorreu um erro desconhecido.');
      } finally {
        setIsLoading(false);
      }
    };
    
    requestAction(1, action);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Planejador de Conteúdo</h1>
        <p className="text-gray-600 mt-2">Organize suas postagens com um plano de conteúdo semanal ou mensal.</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: um plano semanal focado no lançamento de uma coleção de inverno..."
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition h-24 resize-none"
          rows={3}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !prompt}
          className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-pink-700 transition-transform transform hover:scale-105 duration-200 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
        >
          <CalendarIcon className="w-5 h-5"/>
          <span>{isLoading ? 'Planejando...' : 'Gerar Plano (1 crédito)'}</span>
        </button>
      </div>

      <div className="w-full h-96 bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-y-auto">
        {isLoading && (
          <div className="flex h-full flex-col justify-center items-center text-gray-500">
            <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2">Elaborando seu plano estratégico...</p>
          </div>
        )}
        {error && <p className="text-red-500 p-4">{error}</p>}
        {plan && (
          <pre className="whitespace-pre-wrap text-gray-700 font-sans p-2">{plan}</pre>
        )}
        {!isLoading && !error && !plan && (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500 text-center">Seu plano de conteúdo aparecerá aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialPlanner;
