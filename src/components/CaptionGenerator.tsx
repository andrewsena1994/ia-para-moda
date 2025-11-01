
import React, { useState } from 'react';
import { generateCaptionForImage } from '../services/geminiService';
import UploadIcon from './icons/UploadIcon';
import PhotoIcon from './icons/PhotoIcon';

interface CaptionGeneratorProps {
  requestAction: (cost: number, action: () => Promise<void>) => void;
}

const CaptionGenerator: React.FC<CaptionGeneratorProps> = ({ requestAction }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [captions, setCaptions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setCaptions(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      setError("Por favor, envie uma imagem primeiro.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCaptions(null);

    const action = async () => {
      try {
        const result = await generateCaptionForImage(imageFile);
        setCaptions(result);
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Gerador de Legendas</h1>
        <p className="text-gray-600 mt-2">Envie a foto do seu produto e deixe a IA criar legendas que vendem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 w-full h-80 flex flex-col justify-center items-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
            ) : (
              <>
                <UploadIcon className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-600">Arraste e solte ou <span className="font-semibold text-pink-600">clique para enviar</span></p>
                <p className="text-xs text-gray-400 mt-1">Envie a imagem para gerar legendas</p>
              </>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !imageFile}
            className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-pink-700 transition-transform transform hover:scale-105 duration-200 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
          >
            <PhotoIcon className="w-5 h-5"/>
            <span>{isLoading ? 'Gerando...' : 'Gerar Legendas (1 crédito)'}</span>
          </button>
        </div>

        <div className="w-full h-[23.5rem] bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-y-auto">
          {isLoading && (
            <div className="flex h-full flex-col justify-center items-center text-gray-500">
              <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2">Criando legendas perfeitas...</p>
            </div>
          )}
          {error && <p className="text-red-500 p-4">{error}</p>}
          {captions && (
            <pre className="whitespace-pre-wrap text-gray-700 font-sans p-2">{captions}</pre>
          )}
          {!isLoading && !error && !captions && (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500 text-center">As sugestões de legendas aparecerão aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptionGenerator;
