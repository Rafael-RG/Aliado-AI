/**
 * WhatsApp Response Manager
 * Handles sending different types of messages with retry logic and error handling
 */

const axios = require('axios');

class WhatsAppResponseManager {
  constructor() {
    this.baseUrl = 'https://graph.facebook.com/v18.0';
    this.maxRetries = 3;
    this.retryDelay = 1000; // Start with 1 second
    this.messageQueue = new Map(); // Queue for failed messages
  }

  /**
   * Send text message with retry logic
   */
  async sendTextMessage(accessToken, phoneNumberId, to, message, options = {}) {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: { 
        body: message,
        preview_url: options.preview_url || false
      }
    };

    return await this.sendMessage(accessToken, phoneNumberId, payload, 'text');
  }

  /**
   * Send interactive button message
   */
  async sendButtonMessage(accessToken, phoneNumberId, to, text, buttons, options = {}) {
    if (buttons.length > 3) {
      throw new Error('WhatsApp allows maximum 3 buttons per message');
    }

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { 
          text: text 
        },
        action: {
          buttons: buttons.map((button, index) => ({
            type: 'reply',
            reply: {
              id: `btn_${index}_${Date.now()}`,
              title: button.title.substring(0, 20) // Max 20 chars
            }
          }))
        }
      }
    };

    if (options.header) {
      payload.interactive.header = {
        type: 'text',
        text: options.header
      };
    }

    if (options.footer) {
      payload.interactive.footer = {
        text: options.footer
      };
    }

    return await this.sendMessage(accessToken, phoneNumberId, payload, 'button');
  }

  /**
   * Send list message (for multiple options)
   */
  async sendListMessage(accessToken, phoneNumberId, to, text, sections, buttonText = 'Opciones') {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'interactive',
      interactive: {
        type: 'list',
        body: {
          text: text
        },
        action: {
          button: buttonText,
          sections: sections.map(section => ({
            title: section.title,
            rows: section.options.map((option, index) => ({
              id: `list_${section.title}_${index}`,
              title: option.title.substring(0, 24),
              description: option.description?.substring(0, 72)
            }))
          }))
        }
      }
    };

    return await this.sendMessage(accessToken, phoneNumberId, payload, 'list');
  }

  /**
   * Send image with caption
   */
  async sendImageMessage(accessToken, phoneNumberId, to, imageUrl, caption = '') {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'image',
      image: {
        link: imageUrl,
        caption: caption.substring(0, 1024) // Max caption length
      }
    };

    return await this.sendMessage(accessToken, phoneNumberId, payload, 'image');
  }

  /**
   * Send document (PDF, DOC, etc.)
   */
  async sendDocumentMessage(accessToken, phoneNumberId, to, documentUrl, filename, caption = '') {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'document',
      document: {
        link: documentUrl,
        filename: filename,
        caption: caption.substring(0, 1024)
      }
    };

    return await this.sendMessage(accessToken, phoneNumberId, payload, 'document');
  }

  /**
   * Send template message (for notifications)
   */
  async sendTemplateMessage(accessToken, phoneNumberId, to, templateName, languageCode = 'es', parameters = []) {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode
        },
        components: parameters.length > 0 ? [{
          type: 'body',
          parameters: parameters.map(param => ({
            type: 'text',
            text: param
          }))
        }] : []
      }
    };

    return await this.sendMessage(accessToken, phoneNumberId, payload, 'template');
  }

  /**
   * Mark message as read
   */
  async markAsRead(accessToken, phoneNumberId, messageId) {
    const payload = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId
    };

    return await this.sendMessage(accessToken, phoneNumberId, payload, 'read_receipt');
  }

  /**
   * Core message sending with retry logic
   */
  async sendMessage(accessToken, phoneNumberId, payload, messageType) {
    const url = `${this.baseUrl}/${phoneNumberId}/messages`;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`📤 Sending ${messageType} message (attempt ${attempt}/${this.maxRetries})`);
        
        const response = await axios.post(url, payload, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        });

        console.log(`✅ Message sent successfully:`, {
          messageId: response.data.messages?.[0]?.id,
          type: messageType,
          to: payload.to
        });

        return {
          success: true,
          data: response.data,
          messageId: response.data.messages?.[0]?.id,
          attempt
        };

      } catch (error) {
        console.error(`❌ Attempt ${attempt} failed:`, {
          error: error.response?.data || error.message,
          type: messageType,
          to: payload.to
        });

        // Check if it's a retryable error
        if (this.isRetryableError(error) && attempt < this.maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Final failure
        const errorDetails = {
          success: false,
          error: error.response?.data?.error || error.message,
          code: error.response?.status,
          type: messageType,
          to: payload.to,
          attempts: attempt,
          retryable: this.isRetryableError(error)
        };

        // Queue for later retry if it's a temporary error
        if (this.isRetryableError(error)) {
          this.queueFailedMessage(payload, accessToken, phoneNumberId, messageType);
        }

        return errorDetails;
      }
    }
  }

  /**
   * Check if error is retryable
   */
  isRetryableError(error) {
    const status = error.response?.status;
    const errorCode = error.response?.data?.error?.code;

    // Retryable HTTP status codes
    const retryableStatuses = [429, 500, 502, 503, 504];
    
    // Retryable WhatsApp API error codes
    const retryableWACodes = [
      4, // Message failed but may work if retried
      100, // Temporary connection issues
      190, // Temporary token issues (might refresh)
    ];

    return (
      retryableStatuses.includes(status) ||
      retryableWACodes.includes(errorCode) ||
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT'
    );
  }

  /**
   * Queue failed message for later retry
   */
  queueFailedMessage(payload, accessToken, phoneNumberId, messageType) {
    const queueKey = `${payload.to}_${Date.now()}`;
    
    this.messageQueue.set(queueKey, {
      payload,
      accessToken,
      phoneNumberId,
      messageType,
      queuedAt: Date.now(),
      retries: 0
    });

    console.log(`📮 Message queued for retry: ${queueKey}`);
    
    // Schedule retry
    setTimeout(() => {
      this.retryQueuedMessage(queueKey);
    }, 60000); // Retry after 1 minute
  }

  /**
   * Retry queued message
   */
  async retryQueuedMessage(queueKey) {
    const queuedMessage = this.messageQueue.get(queueKey);
    
    if (!queuedMessage) {
      return;
    }

    queuedMessage.retries++;
    
    if (queuedMessage.retries > 5) {
      console.log(`❌ Giving up on queued message: ${queueKey}`);
      this.messageQueue.delete(queueKey);
      return;
    }

    console.log(`🔄 Retrying queued message: ${queueKey} (attempt ${queuedMessage.retries})`);
    
    const result = await this.sendMessage(
      queuedMessage.accessToken,
      queuedMessage.phoneNumberId,
      queuedMessage.payload,
      queuedMessage.messageType
    );

    if (result.success) {
      console.log(`✅ Queued message sent successfully: ${queueKey}`);
      this.messageQueue.delete(queueKey);
    } else {
      // Schedule another retry
      setTimeout(() => {
        this.retryQueuedMessage(queueKey);
      }, 120000); // Wait 2 minutes before next retry
    }
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      totalQueued: this.messageQueue.size,
      messages: Array.from(this.messageQueue.entries()).map(([key, msg]) => ({
        key,
        to: msg.payload.to,
        type: msg.messageType,
        queuedAt: new Date(msg.queuedAt).toISOString(),
        retries: msg.retries
      }))
    };
  }

  /**
   * Clear old queued messages (cleanup)
   */
  cleanupQueue() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    for (const [key, message] of this.messageQueue.entries()) {
      if (now - message.queuedAt > maxAge) {
        console.log(`🧹 Removing old queued message: ${key}`);
        this.messageQueue.delete(key);
      }
    }
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber) {
    // WhatsApp phone numbers should be in format: country code + number
    const regex = /^\d{10,15}$/;
    const cleaned = phoneNumber.replace(/[^\d]/g, '');
    
    return {
      valid: regex.test(cleaned),
      cleaned,
      formatted: cleaned.startsWith('1') ? cleaned : cleaned
    };
  }

  /**
   * Smart message splitter for long texts
   */
  splitLongMessage(text, maxLength = 4096) {
    if (text.length <= maxLength) {
      return [text];
    }

    const chunks = [];
    let currentChunk = '';
    
    const sentences = text.split(/[.!?]\s+/);
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxLength - 10) {
        currentChunk += sentence + '. ';
      } else {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = sentence + '. ';
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}

// Cleanup queue every hour
const responseManager = new WhatsAppResponseManager();
setInterval(() => {
  responseManager.cleanupQueue();
}, 3600000);

module.exports = {
  WhatsAppResponseManager,
  responseManager
};