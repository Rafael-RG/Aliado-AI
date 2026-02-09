
import { GoogleGenAI } from "@google/genai";
import { BotConfig } from "../types";

export async function chatWithTrainedBot(
  message: string, 
  config: BotConfig, 
  imagePart?: { data: string; mimeType: string }
) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Consolidar activos en el contexto
    const assetsContext = config.assets.length > 0 
      ? `INFORMACIÓN ADICIONAL DE DOCUMENTOS CARGADOS:\n${config.assets.map(a => `- ${a.name}: ${a.contentSummary}`).join('\n')}`
      : '';

    const trainingContext = `
      Eres un asistente de WhatsApp de última generación para el negocio: "${config.name}".
      Tipo de negocio: ${config.businessType}.
      Tu rol es: ${config.role}.
      Tono de voz: ${config.tone}.
      
      BASE DE CONOCIMIENTO PRINCIPAL:
      ${config.knowledgeBase}
      
      ${assetsContext}
      
      REGLAS DE VISIÓN Y ARCHIVOS:
      1. Si el usuario envía una imagen, analízala basándote en tu conocimiento del negocio.
      2. Si te preguntan por algo que está en los documentos (PDFs), responde con seguridad.
      3. Mantén respuestas cortas, usa emojis y sé resolutivo.
    `;

    const parts: any[] = [{ text: message || "Analiza esta imagen por favor." }];
    
    if (imagePart) {
      parts.push({
        inlineData: {
          data: imagePart.data.split(',')[1], // Quitar el prefijo data:image/png;base64,
          mimeType: imagePart.mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: trainingContext,
        temperature: 0.6,
      },
    });

    return response.text || "He recibido el archivo pero no puedo procesarlo ahora mismo.";
  } catch (error) {
    console.error("Bot Multimodal Error:", error);
    return "Error al procesar el mensaje multimodal.";
  }
}
