
import { GoogleGenAI, Type } from "@google/genai";
import { Debt, StrategyType } from "../types";

export const getFinancialAdvice = async (debts: Debt[], strategy: StrategyType) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Analiza mi situación de deuda actual y dame consejos financieros. 
  Tengo las siguientes deudas: ${JSON.stringify(debts)}. 
  Estoy usando la estrategia de ${strategy === 'snowball' ? 'Bola de Nieve (pagar primero la menor)' : 'Avalancha (pagar primero la de mayor interés)'}.
  Por favor, responde en formato JSON con un resumen de mi situación, 3 recomendaciones clave para pagar más rápido y una fecha estimada optimista para ser libre de deudas.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedFreedomDate: { type: Type.STRING }
          },
          required: ["summary", "recommendations", "estimatedFreedomDate"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error fetching AI advice:", error);
    return null;
  }
};
