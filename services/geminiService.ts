
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `Eres Aliado, un consultor experto en crecimiento de negocios para Latinoamérica.
Tu misión es ayudar a dueños de negocios (PYMES y emprendedores) a automatizar su atención al cliente y ventas.
Tu tono es cercano, motivador, empático y muy práctico. Eres como ese socio de confianza que sabe mucho de tecnología.
Evita el lenguaje técnico aburrido. Habla de "hacer crecer el negocio", "ganar tiempo", "atender bien a la gente" y "vender más por WhatsApp".
Tu objetivo es que el usuario sienta que tiene un aliado real trabajando con él.`;

export async function getVesperAdvice(userPrompt: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 1500 }
      },
    });

    return response.text || "Disculpa, socio, no pude procesar eso ahora. ¿Lo intentamos de nuevo?";
  } catch (error) {
    console.error("Aliado API Error:", error);
    return "Hubo un problemita de conexión con Aliado. Estamos trabajando para arreglarlo rápido.";
  }
}
