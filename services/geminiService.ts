
import { GoogleGenAI, Modality } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// For image editing and placing products on models
export const editImageWithPrompt = async (imageFile: File, prompt: string): Promise<string> => {
  try {
    const base64Data = await fileToBase64(imageFile);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: imageFile.type,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("Nenhuma imagem foi gerada. Tente novamente.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Falha ao editar a imagem. Verifique o console para mais detalhes.");
  }
};

// For creating banners from scratch
export const generateBanner = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    }
    throw new Error("Nenhum banner foi gerado. Tente novamente.");
  } catch (error) {
    console.error("Error generating banner:", error);
    throw new Error("Falha ao gerar o banner. Verifique o console para mais detalhes.");
  }
};

// For generating captions for an image
export const generateCaptionForImage = async (imageFile: File): Promise<string> => {
  try {
    const base64Data = await fileToBase64(imageFile);
    const internalPrompt = "Crie 3 opções de legendas criativas e vendedoras para esta foto de um produto de moda feminina. Use emojis e hashtags relevantes.";
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: imageFile.type,
            },
          },
          { text: internalPrompt },
        ],
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating caption:", error);
    throw new Error("Falha ao gerar a legenda. Verifique o console para mais detalhes.");
  }
};

// For generating social media content plans
export const generateSocialMediaPlan = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: "Você é um especialista em marketing de mídia social para marcas de moda feminina. Crie planos de conteúdo detalhados, estruturados e acionáveis.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating social media plan:", error);
    throw new Error("Falha ao gerar o plano de mídia social. Verifique o console para mais detalhes.");
  }
};
