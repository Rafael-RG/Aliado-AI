
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `Eres Aliado, el estratega senior de automatización para negocios. Tu objetivo es diseñar formas de crecimiento para empresas.
Enfócate en el ahorro de tiempo y el aumento de ventas automáticas.
Habla de forma cercana pero profesional. El usuario es un dueño de negocio que busca resultados reales.`;

export async function getBotStrategy(prompt: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    return { 
      text: response.text || "Aliado no pudo procesar la estrategia en este momento.", 
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (error) {
    console.error("Aliado Strategy Error:", error);
    return { text: "Error de conexión con Aliado.", sources: [] };
  }
}
