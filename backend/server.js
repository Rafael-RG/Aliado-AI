const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store bot configurations (in production, use a database)
const botConfigurations = new Map();

// Enhanced services
const MessageProcessor = require('./message-processor');
const MetaBusinessManager = require('./meta-business');
const { WhatsAppService } = require('./whatsapp-utils');

const messageProcessor = new MessageProcessor();
const metaManager = new MetaBusinessManager();

/**
 * Send message to WhatsApp Business API
 */
async function sendWhatsAppMessage(to, message, phoneNumberId) {
  try {
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      to: to,
      text: { body: message },
      type: 'text'
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Extract bot ID from webhook URL
 */
function extractBotId(req) {
  // URL format: /api/whatsapp/webhook/bot-id
  const pathParts = req.path.split('/');
  return pathParts[pathParts.length - 1];
}

/**
 * WEBHOOK VERIFICATION - Meta requires this for initial setup (fixed endpoint)
 */
app.get('/whatsapp/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('🔍 Webhook verification request:', { mode, token, challenge });

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.status(403).send('Forbidden');
  }
});

/**
 * WEBHOOK VERIFICATION - For specific bot (with botId)
 */
app.get('/api/whatsapp/webhook/:botId', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('🔍 Webhook verification request:', { mode, token, challenge });

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.status(403).send('Forbidden');
  }
});

/**
 * RECEIVE WHATSAPP MESSAGES - Main webhook endpoint (fixed endpoint)
 */
app.post('/whatsapp/webhook', async (req, res) => {
  try {
    const body = req.body;

    console.log('📱 Incoming WhatsApp webhook:', JSON.stringify(body, null, 2));

    // Acknowledge receipt immediately to Meta
    res.status(200).send('OK');

    // Check if it's a message event
    if (body.object === 'whatsapp_business_account' && body.entry) {
      for (const entry of body.entry) {
        for (const change of entry.changes || []) {
          if (change.field === 'messages') {
            const value = change.value;
            
            // For now, use a default bot ID or determine it from the message
            const botId = 'default-bot';
            
            // Process each message
            if (value.messages) {
              for (const message of value.messages) {
                await processIncomingMessage(message, value.metadata, botId);
              }
            }
          }
        }
      }
    }

    return;
  } catch (error) {
    console.error('❌ Error processing WhatsApp webhook:', error);
    return;
  }
});

/**
 * RECEIVE WHATSAPP MESSAGES - Main webhook endpoint
 */
app.post('/api/whatsapp/webhook/:botId', async (req, res) => {
  try {
    const botId = extractBotId(req);
    const body = req.body;

    console.log('📱 Incoming WhatsApp webhook:', JSON.stringify(body, null, 2));

    // Acknowledge receipt immediately to Meta
    res.status(200).send('OK');

    // Check if it's a message event
    if (body.object === 'whatsapp_business_account' && body.entry) {
      for (const entry of body.entry) {
        for (const change of entry.changes || []) {
          if (change.field === 'messages') {
            const value = change.value;
            
            // Process each message
            if (value.messages) {
              for (const message of value.messages) {
                await processIncomingMessage(message, value.metadata, botId);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
  }
});

/**
 * Process individual incoming message
 */
async function processIncomingMessage(message, metadata, botId) {
  try {
    console.log(`💬 Processing message for bot ${botId}:`, {
      from: message.from,
      type: message.type,
      text: message.text?.body?.substring(0, 50) + '...'
    });

    // Get bot configuration
    const botConfig = botConfigurations.get(botId);
    
    if (!botConfig) {
      console.log(`❌ Bot configuration not found for ID: ${botId}`);
      return;
    }

    // Initialize WhatsApp service for this conversation
    const whatsappService = new WhatsAppService(
      process.env.WHATSAPP_ACCESS_TOKEN,
      metadata.phone_number_id
    );

    // Use enhanced message processor
    const result = await messageProcessor.processMessage(
      message, 
      metadata, 
      botConfig, 
      whatsappService
    );

    console.log('✅ Message processed successfully:', {
      success: result.success,
      intent: result.intent?.type,
      handedOff: result.handedOff,
      conversationLength: result.conversationLength
    });

  } catch (error) {
    console.error('❌ Error processing message:', error);

    // Emergency fallback - send simple error message
    try {
      const whatsappService = new WhatsAppService(
        process.env.WHATSAPP_ACCESS_TOKEN,
        metadata.phone_number_id
      );
      
      await whatsappService.sendTextMessage(
        message.from,
        'Disculpa, hay un problema técnico temporal. Estamos trabajando en solucionarlo... 🔧'
      );
    } catch (fallbackError) {
      console.error('❌ Even fallback message failed:', fallbackError);
    }
  }
}

/**
 * API ENDPOINTS FOR FRONTEND
 */

// Meta Business Setup and Validation
app.post('/api/meta/validate-token', async (req, res) => {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({ success: false, error: 'Access token required' });
    }

    const validation = await metaManager.validateAccessToken(accessToken);
    res.json(validation);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/meta/accounts/:accessToken', async (req, res) => {
  try {
    const { accessToken } = req.params;
    const accounts = await metaManager.getWhatsAppBusinessAccounts(accessToken);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/meta/test-setup', async (req, res) => {
  try {
    const { accessToken, phoneNumberId, testPhoneNumber, webhookUrl } = req.body;
    
    const validation = await metaManager.validateCompleteSetup(
      accessToken, 
      phoneNumberId, 
      testPhoneNumber, 
      webhookUrl
    );

    const instructions = metaManager.generateSetupInstructions(
      validation,
      webhookUrl,
      process.env.WHATSAPP_VERIFY_TOKEN
    );

    res.json({
      success: true,
      validation,
      instructions,
      ready: validation.allValid
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Register/Update bot configuration
app.post('/api/bots/:botId/config', (req, res) => {
  try {
    const botId = req.params.botId;
    const config = req.body;

    console.log(`💾 Saving bot config for ${botId}:`, config);
    
    botConfigurations.set(botId, {
      id: botId,
      name: config.name || 'Aliado Bot',
      businessType: config.businessType || 'General',
      role: config.role || 'Asistente',
      tone: config.tone || 'friendly',
      knowledgeBase: config.knowledgeBase || 'Soy un asistente virtual.',
      ...config
    });

    res.json({ 
      success: true, 
      message: 'Bot configuration saved',
      webhookUrl: `${process.env.WEBHOOK_BASE_URL}/api/whatsapp/webhook/${botId}`,
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN
    });
  } catch (error) {
    console.error('❌ Error saving bot config:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get bot configuration
app.get('/api/bots/:botId/config', (req, res) => {
  const botId = req.params.botId;
  const config = botConfigurations.get(botId);
  
  if (config) {
    res.json(config);
  } else {
    res.status(404).json({ error: 'Bot not found' });
  }
});

// Get all registered bots
app.get('/api/bots', (req, res) => {
  const bots = Array.from(botConfigurations.values());
  res.json(bots);
});

// Test endpoint - send a test message
app.post('/api/test/send', async (req, res) => {
  try {
    const { to, message, phoneNumberId } = req.body;
    
    const result = await sendWhatsAppMessage(to, message, phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID);
    
    res.json({ 
      success: true, 
      result,
      message: 'Test message sent successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    bots: botConfigurations.size
  });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    service: 'Aliado AI WhatsApp Backend',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      'GET /health': 'Health check',
      'GET/POST /api/whatsapp/webhook/:botId': 'WhatsApp webhook for specific bot',
      'POST /api/bots/:botId/config': 'Save bot configuration',
      'GET /api/bots/:botId/config': 'Get bot configuration',
      'GET /api/bots': 'List all bots',
      'POST /api/test/send': 'Send test message'
    },
    documentation: 'https://developers.facebook.com/docs/whatsapp'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Aliado AI Backend Server
📱 WhatsApp Integration Ready
🔥 Server running on http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}
  `);
  
  // Log current configuration
  console.log('📋 Environment Check:');
  console.log('✅ Gemini API Key:', process.env.GEMINI_API_KEY ? 'Configured' : '❌ Missing');
  console.log('📞 WhatsApp Token:', process.env.WHATSAPP_ACCESS_TOKEN ? 'Configured' : '❌ Needs Meta Business Setup');
  console.log('🔒 Verify Token:', process.env.WHATSAPP_VERIFY_TOKEN);
  
  if (!process.env.WHATSAPP_ACCESS_TOKEN) {
    console.log(`
⚠️  NEXT STEPS TO ACTIVATE WHATSAPP:
1. Go to https://developers.facebook.com/
2. Create a WhatsApp Business App
3. Get your Access Token and Phone Number ID
4. Update .env file with real values
5. Use ngrok to expose this server: ngrok http 3001
    `);
  }
});

module.exports = app;