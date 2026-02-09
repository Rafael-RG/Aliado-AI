const { responseManager } = require('./response-manager');

/**
 * WhatsApp Business API utilities and helpers
 */

class WhatsAppService {
  constructor(accessToken, phoneNumberId) {
    this.accessToken = accessToken;
    this.phoneNumberId = phoneNumberId;
  }

  /**
   * Send text message using enhanced response manager
   */
  async sendTextMessage(to, message) {
    return await responseManager.sendTextMessage(
      this.accessToken,
      this.phoneNumberId,
      to,
      message
    );
  }

  /**
   * Send message with quick reply buttons
   */
  async sendButtonMessage(to, text, buttons) {
    return await responseManager.sendButtonMessage(
      this.accessToken,
      this.phoneNumberId,
      to,
      text,
      buttons
    );
  }

  /**
   * Send image message
   */
  async sendImageMessage(to, imageUrl, caption = '') {
    return await responseManager.sendImageMessage(
      this.accessToken,
      this.phoneNumberId,
      to,
      imageUrl,
      caption
    );
  }

  /**
   * Send list message
   */
  async sendListMessage(to, text, sections, buttonText = 'Opciones') {
    return await responseManager.sendListMessage(
      this.accessToken,
      this.phoneNumberId,
      to,
      text,
      sections,
      buttonText
    );
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId) {
    return await responseManager.markAsRead(
      this.accessToken,
      this.phoneNumberId,
      messageId
    );
  }

  /**
   * Get business profile
   */
  async getBusinessProfile() {
    const axios = require('axios');
    const url = `https://graph.facebook.com/v18.0/${this.phoneNumberId}`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error getting business profile:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }
}

/**
 * Message validation utilities
 */
const MessageValidator = {
  /**
   * Validate incoming webhook payload
   */
  isValidWhatsAppPayload(body) {
    return body && 
           body.object === 'whatsapp_business_account' && 
           body.entry && 
           Array.isArray(body.entry);
  },

  /**
   * Extract messages from webhook payload
   */
  extractMessages(entry) {
    const messages = [];
    
    for (const item of entry) {
      if (item.changes) {
        for (const change of item.changes) {
          if (change.field === 'messages' && change.value.messages) {
            messages.push(...change.value.messages);
          }
        }
      }
    }
    
    return messages;
  },

  /**
   * Check if message is from business (avoid echoing own messages)
   */
  isFromUser(message, businessPhoneId) {
    return message.from !== businessPhoneId;
  }
};

/**
 * Bot response templates for common interactions
 */
const ResponseTemplates = {
  welcome: [
    "¡Hola! 👋 Soy tu Aliado virtual. ¿En qué puedo ayudarte hoy?",
    "¡Bienvenido! 🎉 Estoy aquí para asistirte. ¿Qué necesitas?",
    "¡Hola! 😊 Soy el asistente de este negocio. ¿Cómo puedo ayudarte?"
  ],

  notUnderstood: [
    "No estoy seguro de entender. ¿Podrías explicarlo de otra manera? 🤔",
    "Disculpa, no logré procesar tu mensaje. ¿Puedes ser más específico? 🙏",
    "No entiendo bien lo que necesitas. ¿Podrías darme más detalles? 💬"
  ],

  technical_error: [
    "Disculpa, hay un problema técnico. Estoy trabajando en solucionarlo... ⚠️",
    "Algo salió mal de mi lado. Un momento por favor... 🔧",
    "Error temporal. Estoy comunicándome con mi equipo técnico... 🚀"
  ],

  humanHandoff: [
    "Estoy derivando tu consulta a nuestro equipo humano para una mejor atención 👥",
    "Un especialista te contactará pronto para ayudarte mejor 🤝",
    "Tu consulta requiere atención personalizada. Te conectamos con un experto ✨"
  ]
};

/**
 * Enhanced conversation context manager
 */
class ConversationManager {
  constructor() {
    this.conversations = new Map();
    this.conversationTimeout = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Get or create conversation context
   */
  getConversationContext(userId) {
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, {
        messages: [],
        startTime: new Date(),
        lastActivity: new Date(),
        context: {}
      });
    }

    const conversation = this.conversations.get(userId);
    conversation.lastActivity = new Date();
    
    return conversation;
  }

  /**
   * Add message to conversation
   */
  addMessage(userId, message, isFromBot = false) {
    const conversation = this.getConversationContext(userId);
    
    conversation.messages.push({
      text: message,
      timestamp: new Date(),
      fromBot: isFromBot
    });

    // Keep only last 10 messages to prevent memory bloat
    if (conversation.messages.length > 10) {
      conversation.messages = conversation.messages.slice(-10);
    }
  }

  /**
   * Get recent conversation history for context
   */
  getRecentHistory(userId, limit = 5) {
    const conversation = this.getConversationContext(userId);
    
    return conversation.messages
      .slice(-limit)
      .map(msg => `${msg.fromBot ? 'Bot' : 'Usuario'}: ${msg.text}`)
      .join('\n');
  }

  /**
   * Clean old conversations
   */
  cleanOldConversations() {
    const now = new Date();
    
    for (const [userId, conversation] of this.conversations.entries()) {
      if (now - conversation.lastActivity > this.conversationTimeout) {
        this.conversations.delete(userId);
        console.log(`🧹 Cleaned conversation for user ${userId}`);
      }
    }
  }

  /**
   * Set conversation context variable
   */
  setContext(userId, key, value) {
    const conversation = this.getConversationContext(userId);
    conversation.context[key] = value;
  }

  /**
   * Get conversation context variable
   */
  getContext(userId, key) {
    const conversation = this.getConversationContext(userId);
    return conversation.context[key];
  }
}

// Clean conversations every 15 minutes
const conversationManager = new ConversationManager();
setInterval(() => {
  conversationManager.cleanOldConversations();
}, 15 * 60 * 1000);

module.exports = {
  WhatsAppService,
  MessageValidator,
  ResponseTemplates,
  ConversationManager,
  conversationManager
};