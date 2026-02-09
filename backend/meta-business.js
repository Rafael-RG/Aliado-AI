/**
 * Meta Business API Setup and Management
 * This module handles all Meta WhatsApp Business API authentication and setup
 */

const axios = require('axios');

class MetaBusinessManager {
  constructor() {
    this.baseUrl = 'https://graph.facebook.com/v18.0';
    this.requiredScopes = [
      'whatsapp_business_messaging',
      'whatsapp_business_management'
    ];
  }

  /**
   * Validate access token and get account info
   */
  async validateAccessToken(accessToken) {
    try {
      // First, validate the token by getting basic user info
      const response = await axios.get(`${this.baseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          fields: 'id,name'
        }
      });

      const data = response.data;
      
      // For WhatsApp Business tokens, try to get business info to confirm it has WhatsApp access
      try {
        const businessResponse = await axios.get(`${this.baseUrl}/me/businesses`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          params: {
            fields: 'id,name'
          }
        });

        return {
          valid: true,
          account: {
            id: data.id,
            name: data.name,
            hasBusinessAccess: true,
            businesses: businessResponse.data.data
          },
          hasRequiredScopes: true, // Assume true if we can access business data
          missingScopes: []
        };

      } catch (businessError) {
        // Token is valid but might not have business access
        console.warn('Token valid but no business access:', businessError.response?.data);
        
        return {
          valid: true,
          account: {
            id: data.id,
            name: data.name,
            hasBusinessAccess: false
          },
          hasRequiredScopes: false,
          missingScopes: ['whatsapp_business_messaging']
        };
      }

    } catch (error) {
      console.error('Token validation failed:', error.response?.data || error.message);
      
      // Handle Meta API error responses better
      let errorMessage = 'Token validation failed';
      
      if (error.response?.data) {
        if (error.response.data.error) {
          if (typeof error.response.data.error === 'object') {
            errorMessage = error.response.data.error.message || 
                          error.response.data.error.error_user_title || 
                          JSON.stringify(error.response.data.error);
          } else {
            errorMessage = error.response.data.error;
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        valid: false,
        error: errorMessage
      };
    }
  }

  /**
   * Get WhatsApp Business Account info
   */
  async getWhatsAppBusinessAccounts(accessToken) {
    try {
      const response = await axios.get(`${this.baseUrl}/me/businesses`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          fields: 'whatsapp_business_accounts{id,name,phone_numbers{id,display_phone_number,verified_name,code_verification_status}}'
        }
      });

      return {
        success: true,
        businesses: response.data.data
      };

    } catch (error) {
      console.error('Error fetching WhatsApp accounts:', error.response?.data || error.message);
      
      // Handle Meta API error responses better
      let errorMessage = 'Failed to fetch WhatsApp accounts';
      
      if (error.response?.data) {
        if (error.response.data.error) {
          if (typeof error.response.data.error === 'object') {
            errorMessage = error.response.data.error.message || 
                          error.response.data.error.error_user_title || 
                          JSON.stringify(error.response.data.error);
          } else {
            errorMessage = error.response.data.error;
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Get phone numbers for a WhatsApp Business Account
   */
  async getPhoneNumbers(accessToken, whatsappBusinessAccountId) {
    try {
      const response = await axios.get(`${this.baseUrl}/${whatsappBusinessAccountId}/phone_numbers`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          fields: 'id,display_phone_number,verified_name,code_verification_status,quality_rating'
        }
      });

      return {
        success: true,
        phoneNumbers: response.data.data
      };

    } catch (error) {
      console.error('Error fetching phone numbers:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  /**
   * Test message sending capability
   */
  async testMessageSending(accessToken, phoneNumberId, testPhoneNumber) {
    try {
      const response = await axios.post(`${this.baseUrl}/${phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        to: testPhoneNumber,
        type: 'text',
        text: {
          body: '🔥 ¡Aliado AI conectado exitosamente! Tu bot está listo para automatizar conversaciones.'
        }
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data
      };

    } catch (error) {
      console.error('Test message failed:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  /**
   * Setup webhook subscription
   */
  async setupWebhookSubscription(accessToken, whatsappBusinessAccountId, webhookUrl, verifyToken) {
    try {
      const response = await axios.post(`${this.baseUrl}/${whatsappBusinessAccountId}/subscribed_apps`, {
        subscribed_fields: ['messages']
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        subscription: response.data,
        webhookUrl,
        verifyToken,
        instructions: [
          '1. Ve a tu App de Meta Business',
          '2. Whatsapp > Configuration > Webhook',
          `3. Callback URL: ${webhookUrl}`,
          `4. Verify Token: ${verifyToken}`,
          '5. Webhook fields: messages',
          '6. Save configuration'
        ]
      };

    } catch (error) {
      console.error('Webhook setup failed:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  /**
   * Comprehensive setup validation
   */
  async validateCompleteSetup(accessToken, phoneNumberId, testPhoneNumber, webhookUrl) {
    const results = {
      steps: [],
      allValid: true
    };

    // Step 1: Validate token
    console.log('🔍 Validating access token...');
    const tokenValidation = await this.validateAccessToken(accessToken);
    results.steps.push({
      step: 'Access Token Validation',
      success: tokenValidation.valid,
      data: tokenValidation
    });

    if (!tokenValidation.valid) {
      results.allValid = false;
      return results;
    }

    // Step 2: Get WhatsApp accounts
    console.log('📱 Fetching WhatsApp Business accounts...');
    const accounts = await this.getWhatsAppBusinessAccounts(accessToken);
    results.steps.push({
      step: 'WhatsApp Business Accounts',
      success: accounts.success,
      data: accounts
    });

    if (!accounts.success) {
      results.allValid = false;
      return results;
    }

    // Step 3: Test messaging
    if (phoneNumberId && testPhoneNumber) {
      console.log('💬 Testing message sending...');
      const messageTest = await this.testMessageSending(accessToken, phoneNumberId, testPhoneNumber);
      results.steps.push({
        step: 'Message Sending Test',
        success: messageTest.success,
        data: messageTest
      });

      if (!messageTest.success) {
        results.allValid = false;
      }
    }

    return results;
  }

  /**
   * Generate setup instructions based on current state
   */
  generateSetupInstructions(validationResults, webhookUrl, verifyToken) {
    const instructions = [];
    
    instructions.push({
      title: '🏗️ Meta Business App Setup',
      steps: [
        'Go to https://developers.facebook.com/',
        'Create new app > Business',
        'Add WhatsApp product',
        'Generate access token'
      ],
      status: validationResults?.steps[0]?.success ? 'completed' : 'pending'
    });

    instructions.push({
      title: '📱 Phone Number Configuration', 
      steps: [
        'In WhatsApp > Getting Started',
        'Add phone number or use test number',
        'Get Phone Number ID',
        'Update .env with WHATSAPP_PHONE_NUMBER_ID'
      ],
      status: 'manual'
    });

    instructions.push({
      title: '🔗 Webhook Configuration',
      steps: [
        'In WhatsApp > Configuration',
        `Callback URL: ${webhookUrl}`,
        `Verify Token: ${verifyToken}`,
        'Webhook fields: messages',
        'Subscribe to webhook'
      ],
      status: 'manual'
    });

    instructions.push({
      title: '🧪 Testing',
      steps: [
        'Send test message to your WhatsApp number',
        'Check server logs for incoming webhook',
        'Verify bot responds automatically',
        'Test complete conversation flow'
      ],
      status: 'testing'
    });

    return instructions;
  }

  /**
   * Get app permissions and requirements
   */
  async getAppPermissions(accessToken) {
    try {
      const response = await axios.get(`${this.baseUrl}/me/permissions`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const permissions = response.data.data;
      const requiredPermissions = [
        'whatsapp_business_messaging',
        'whatsapp_business_management'
      ];

      return {
        success: true,
        permissions,
        requiredPermissions,
        hasAllRequired: requiredPermissions.every(perm => 
          permissions.some(p => p.permission === perm && p.status === 'granted')
        )
      };

    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }
}

module.exports = MetaBusinessManager;