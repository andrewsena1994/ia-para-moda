
import React, { useState } from 'react';
import type { MagicStudioMode } from '../types';
import { editImageWithPrompt, generateBanner } from '../services/geminiService';
import UploadIcon from './icons/UploadIcon';
import SparklesIcon from './icons/SparklesIcon';

interface MagicStudioProps {
  requestAction: (cost: number, action: () => Promise<void>) => void;
}

const ImagePlaceholder: React.FC<{ onFileSelect: (file: File) => void, uploadedImagePreview?: string }> = ({ onFileSelect, uploadedImagePreview }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 w-full h-64 flex flex-col justify-center items-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
      <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
      {uploadedImagePreview ? (
        <img src={uploadedImagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
      ) : (
        <>
          <UploadIcon className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-gray-600">Arraste e solte uma imagem ou <span className="font-semibold text-pink-600">clique para enviar</span></p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
        </>
      )}
    </div>
  );
};


const MagicStudio: React.FC<MagicStudioProps> = ({ requestAction }) => {
  const [mode, setMode] = useState<MagicStudioMode>('model');
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);
    setGeneratedImage(null);

    const action = async () => {
      try {
        let result: string;
        if (mode === 'banner') {
          if (!prompt) throw new Error("O prompt não pode estar vazio para gerar um banner.");
          result = await generateBanner(prompt);
        } else {
          if (!imageFile) throw new Error("Por favor, envie uma imagem.");
          if (!prompt) throw new Error("O prompt não pode estar vazio.");
          result = await editImageWithPrompt(imageFile, prompt);
        }
        setGeneratedImage(`data:image/jpeg;base64,${result}`);
      } catch (e: any) {
        setError(e.message || 'Ocorreu um erro desconhecido.');
      } finally {
        setIsLoading(false);
      }
    };

    requestAction(2, action);
  };

  const getPromptPlaceholder = () => {
    switch (mode) {
      case 'model':
        return 'Ex: modelo loira em uma rua ensolarada de Paris, fundo desfocado...';
      case 'edit':
        return 'Ex: adicione um filtro retrô, remova o fundo, mude a cor para azul...';
      case 'banner':
        return 'Ex: banner promocional de verão com 50% de desconto, cores vibrantes...';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Estúdio Mágico</h1>
            <p className="text-gray-600 mt-2">Dê vida às suas ideias com o poder da IA. Escolha uma opção para começar.</p>
        </div>

        <div className="flex justify-center bg-gray-200/50 p-1.5 rounded-xl">
            {(['model', 'edit', 'banner'] as MagicStudioMode[]).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 text-sm md:text-base font-semibold rounded-lg transition-all duration-200 w-full ${mode === m ? 'bg-white text-pink-600 shadow' : 'text-gray-600'}`}>
                    {m === 'model' ? 'Modelo Virtual' : m === 'edit' ? 'Edição Rápida' : 'Criar Banner'}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
                {mode !== 'banner' && (
                    <ImagePlaceholder onFileSelect={handleFileSelect} uploadedImagePreview={imagePreview} />
                )}
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={getPromptPlaceholder()}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition h-28 resize-none"
                    rows={4}
                />
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || (!prompt || (mode !== 'banner' && !imageFile))}
                    className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-pink-700 transition-transform transform hover:scale-105 duration-200 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                >
                    <SparklesIcon className="w-5 h-5"/>
                    <span>{isLoading ? 'Gerando...' : 'Gerar Imagem (2 créditos)'}</span>
                </button>
            </div>

            <div className="w-full h-96 bg-gray-100 rounded-xl flex justify-center items-center border border-gray-200">
                {isLoading && (
                    <div className="flex flex-col items-center text-gray-500">
                        <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-2">Aguarde, a mágica está acontecendo...</p>
                    </div>
                )}
                {error && <p className="text-red-500 p-4">{error}</p>}
                {generatedImage && (
                    <img src={generatedImage} alt="Generated result" className="max-h-full max-w-full object-contain rounded-lg" />
                )}
                {!isLoading && !error && !generatedImage && (
                    <p className="text-gray-500">Sua imagem aparecerá aqui</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default MagicStudio;
