/**
 * Enhanced Message Processing Service
 * Handles incoming WhatsApp messages with context, AI processing, and smart responses
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { conversationManager, ResponseTemplates } = require('./whatsapp-utils');

class MessageProcessor {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.maxRetries = 3;
    this.responseTimeout = 15000; // 15 seconds
  }

  /**
   * Main message processing pipeline
   */
  async processMessage(message, metadata, botConfig, whatsappService) {
    try {
      const senderPhone = message.from;
      const messageText = message.text?.body?.trim();
      const messageType = message.type;

      console.log(`📥 Processing message from ${senderPhone}: "${messageText}" (type: ${messageType})`);

      // Handle different message types
      switch (messageType) {
        case 'text':
          return await this.processTextMessage(messageText, senderPhone, botConfig, whatsappService);
        
        case 'image':
          return await this.processImageMessage(message, senderPhone, botConfig, whatsappService);
        
        case 'button':
          return await this.processButtonResponse(message, senderPhone, botConfig, whatsappService);
        
        case 'interactive':
          return await this.processInteractiveResponse(message, senderPhone, botConfig, whatsappService);
        
        default:
          return await this.processUnsupportedMessage(messageType, senderPhone, whatsappService);
      }

    } catch (error) {
      console.error('❌ Error in message processing pipeline:', error);
      
      // Send error response to user
      const errorResponse = this.getRandomResponse(ResponseTemplates.technical_error);
      await whatsappService.sendTextMessage(message.from, errorResponse);
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Process text messages with AI
   */
  async processTextMessage(messageText, senderPhone, botConfig, whatsappService) {
    try {
      // Get conversation context
      const conversationHistory = conversationManager.getRecentHistory(senderPhone, 3);
      
      // Add user message to conversation
      conversationManager.addMessage(senderPhone, messageText, false);

      // Detect intent and handle special cases
      const intent = this.detectIntent(messageText);
      
      if (intent.requiresHuman) {
        const handoffResponse = this.getRandomResponse(ResponseTemplates.humanHandoff);
        await whatsappService.sendTextMessage(senderPhone, handoffResponse);
        
        // Set context flag for human handoff
        conversationManager.setContext(senderPhone, 'needsHuman', true);
        
        return { success: true, handedOff: true, intent };
      }

      // Generate AI response
      const aiResponse = await this.generateAIResponse(messageText, botConfig, conversationHistory, intent);
      
      // Add bot response to conversation
      conversationManager.addMessage(senderPhone, aiResponse, true);

      // Send response with typing indicator simulation
      await this.sendWithTypingIndicator(whatsappService, senderPhone, aiResponse);

      // Handle follow-up actions based on intent
      await this.handleFollowUpActions(intent, senderPhone, botConfig, whatsappService);

      return { 
        success: true, 
        response: aiResponse, 
        intent,
        conversationLength: conversationManager.getConversationContext(senderPhone).messages.length
      };

    } catch (error) {
      console.error('Error processing text message:', error);
      
      const errorResponse = this.getRandomResponse(ResponseTemplates.notUnderstood);
      await whatsappService.sendTextMessage(senderPhone, errorResponse);
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Process image messages
   */
  async processImageMessage(message, senderPhone, botConfig, whatsappService) {
    try {
      const imageCaption = message.image?.caption || '';
      
      // For now, acknowledge image and ask for clarification
      const response = `📷 He recibido tu imagen${imageCaption ? ` con el mensaje: "${imageCaption}"` : ''}. ` +
                      `¿En qué puedo ayudarte específicamente?`;

      await whatsappService.sendTextMessage(senderPhone, response);

      conversationManager.addMessage(senderPhone, '[Imagen enviada]' + (imageCaption ? `: ${imageCaption}` : ''), false);
      conversationManager.addMessage(senderPhone, response, true);

      return { success: true, response, type: 'image_acknowledgment' };

    } catch (error) {
      console.error('Error processing image message:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process button/interactive responses
   */
  async processButtonResponse(message, senderPhone, botConfig, whatsappService) {
    try {
      const buttonResponse = message.button?.payload || message.interactive?.button_reply?.id;
      
      return await this.processTextMessage(buttonResponse, senderPhone, botConfig, whatsappService);

    } catch (error) {
      console.error('Error processing button response:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle unsupported message types
   */
  async processUnsupportedMessage(messageType, senderPhone, whatsappService) {
    const response = `Lo siento, aún no puedo procesar mensajes de tipo "${messageType}". ` +
                    `¿Puedes enviarme un mensaje de texto? 📝`;

    await whatsappService.sendTextMessage(senderPhone, response);
    
    return { success: true, response, type: 'unsupported_acknowledgment' };
  }

  /**
   * Detect user intent from message
   */
  detectIntent(messageText) {
    const text = messageText.toLowerCase();
    
    // Define intent patterns
    const intents = {
      greeting: /^(hola|hello|hi|buenas|buenos|buen día|buenos días|buenas tardes|buenas noches)/,
      question: /\?(.*)?|\bpregunta\b|\bcómo\b|\bqué\b|\bcuándo\b|\bdónde\b|\bpor qué\b/,
      pricing: /\bprecio|\bcosto|\bcuesta|\btarifa|\bvaor|\b\$|\b\$$|\bdinero/,
      availability: /\bdisponible|\bstock|\btiene|\bhay|\babierto|\bcerrado|\bhorario/,
      complaint: /\bproblema|\bmal|\berror|\bfalla|\bno funciona|\breclamo|\bmolesto/,
      compliment: /\bgracias|\bbuen|\bexcelente|\bperfecto|\bgenial|\bamazing|\bawesome/,
      human_request: /\bhumano|\bpersona|\bagente|\boperador|\bhablar con|\batención personal/,
      goodbye: /\badios|\bchau|\bbye|\bhasta luego|\bnos vemos/
    };

    const detected = {
      type: 'general',
      confidence: 0.5,
      requiresHuman: false,
      priority: 'normal'
    };

    // Check each intent pattern
    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(text)) {
        detected.type = intent;
        detected.confidence = 0.8;
        
        if (intent === 'human_request' || intent === 'complaint') {
          detected.requiresHuman = true;
          detected.priority = 'high';
        }
        
        break;
      }
    }

    // Check for urgency indicators
    if (/\burgente|\brapido|\bya|\bahora|\bemergencia/.test(text)) {
      detected.priority = 'urgent';
    }

    return detected;
  }

  /**
   * Generate AI response using Gemini with enhanced context
   */
  async generateAIResponse(messageText, botConfig, conversationHistory, intent) {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 150, // Keep responses concise for WhatsApp
        }
      });

      // Build enhanced system prompt
      const systemPrompt = this.buildSystemPrompt(botConfig, intent, conversationHistory);
      
      const prompt = `${systemPrompt}

CONVERSACIÓN PREVIA:
${conversationHistory || 'Primera interacción'}

MENSAJE ACTUAL DEL USUARIO:
${messageText}

RESPUESTA (máximo 150 caracteres, incluir emoji apropiado):`;

      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI response timeout')), this.responseTimeout)
        )
      ]);

      const response = await result.response;
      let aiText = response.text().trim();

      // Ensure response is appropriate length for WhatsApp
      if (aiText.length > 160) {
        aiText = aiText.substring(0, 157) + '...';
      }

      return aiText || this.getRandomResponse(ResponseTemplates.notUnderstood);

    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback responses based on intent
      return this.getFallbackResponse(intent);
    }
  }

  /**
   * Build system prompt based on bot config and context
   */
  buildSystemPrompt(botConfig, intent, conversationHistory) {
    const toneInstructions = {
      'professional': 'Mantén un tono serio y profesional sin emojis excesivos.',
      'friendly': 'Sé amigable y usa emojis moderadamente. Muestra entusiasmo.',
      'empathetic': 'Sé comprensivo y empático. Escucha activamente.',
      'aggressive': 'Enfócate en cerrar ventas rápido. Sé directo pero cortés.'
    };

    return `Eres el asistente virtual de WhatsApp para "${botConfig.name}".

INFORMACIÓN DEL NEGOCIO:
- Tipo: ${botConfig.businessType}
- Tu rol: ${botConfig.role}
- Tono: ${botConfig.tone}

CONOCIMIENTO BASE:
${botConfig.knowledgeBase}

INSTRUCCIONES:
- Respuestas cortas y directas (máximo 1-2 oraciones)
- ${toneInstructions[botConfig.tone] || 'Mantén un tono apropiado'}
- Include un emoji relevante
- Si no sabes algo, deriva al equipo humano
- Para precios específicos, indica que un especialista contactará
- Prioridad: servicio al cliente y generación de leads

CONTEXTO ACTUAL:
- Intent detectado: ${intent.type}
- Prioridad: ${intent.priority}`;
  }

  /**
   * Get fallback response for failed AI generation
   */
  getFallbackResponse(intent) {
    const fallbacks = {
      greeting: '¡Hola! 👋 ¿En qué puedo ayudarte?',
      pricing: 'Permíteme consultar los precios actualizados. Un especialista te contactará pronto 💰',
      availability: 'Verificando disponibilidad... Te confirmo en un momento ⏰',
      complaint: 'Entiendo tu preocupación. Estoy conectando con nuestro equipo para solucionarlo 🔧',
      goodbye: '¡Hasta pronto! Estamos aquí cuando nos necesites 👋',
      general: this.getRandomResponse(ResponseTemplates.welcome)
    };

    return fallbacks[intent.type] || fallbacks.general;
  }

  /**
   * Send message with simulated typing indicator
   */
  async sendWithTypingIndicator(whatsappService, senderPhone, message) {
    // Simulate typing delay based on message length
    const typingDelay = Math.min(Math.max(message.length * 30, 500), 2000);
    
    await new Promise(resolve => setTimeout(resolve, typingDelay));
    
    return await whatsappService.sendTextMessage(senderPhone, message);
  }

  /**
   * Handle follow-up actions based on intent
   */
  async handleFollowUpActions(intent, senderPhone, botConfig, whatsappService) {
    try {
      switch (intent.type) {
        case 'pricing':
          // Set context for sales follow-up
          conversationManager.setContext(senderPhone, 'interestedInPricing', true);
          break;
          
        case 'complaint':
          // Flag for priority human review
          conversationManager.setContext(senderPhone, 'complaint', true);
          conversationManager.setContext(senderPhone, 'priority', 'high');
          break;
          
        case 'greeting':
          // First time user? Send welcome with options
          const conversation = conversationManager.getConversationContext(senderPhone);
          if (conversation.messages.length <= 2) {
            setTimeout(async () => {
              await whatsappService.sendTextMessage(
                senderPhone, 
                '¿Te puedo ayudar con información sobre productos, precios o tienes alguna consulta? 🤔'
              );
            }, 2000);
          }
          break;
      }
    } catch (error) {
      console.error('Error in follow-up actions:', error);
    }
  }

  /**
   * Get random response from template array
   */
  getRandomResponse(templates) {
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Check if conversation needs human handoff
   */
  shouldHandoffToHuman(senderPhone, messageCount = 0) {
    const context = conversationManager.getConversationContext(senderPhone);
    
    // Auto handoff conditions
    return context.context.needsHuman ||
           context.context.complaint ||
           messageCount > 10 || // Long conversations
           context.context.priority === 'urgent';
  }
}

module.exports = MessageProcessor;