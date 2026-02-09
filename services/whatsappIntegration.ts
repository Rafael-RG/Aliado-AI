/**
 * Real WhatsApp Integration Service - Frontend
 * Connects to the real backend API for WhatsApp functionality
 */

const API_BASE_URL = 'http://localhost:3001/api';

export interface WhatsAppSetup {
  accessToken: string;
  phoneNumberId: string;
  verifyToken: string;
  webhookUrl: string;
}

export interface BotConfiguration {
  id: string;
  name: string;
  businessType: string;
  role: string;
  tone: string;
  knowledgeBase: string;
}

class WhatsAppIntegrationService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Validate Meta Business access token
   */
  async validateMetaToken(accessToken: string): Promise<{
    valid: boolean;
    account?: any;
    hasRequiredScopes?: boolean;
    missingScopes?: string[];
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/meta/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken })
      });

      return await response.json();
    } catch (error) {
      console.error('Error validating Meta token:', error);
      return {
        valid: false,
        error: 'Network error validating token'
      };
    }
  }

  /**
   * Get WhatsApp Business accounts for access token
   */
  async getWhatsAppAccounts(accessToken: string): Promise<{
    success: boolean;
    businesses?: any[];
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/meta/accounts/${encodeURIComponent(accessToken)}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting WhatsApp accounts:', error);
      return {
        success: false,
        error: 'Network error fetching accounts'
      };
    }
  }

  /**
   * Test complete Meta setup
   */
  async testMetaSetup(setup: {
    accessToken: string;
    phoneNumberId: string;
    testPhoneNumber: string;
    webhookUrl: string;
  }): Promise<{
    success: boolean;
    validation?: any;
    instructions?: any[];
    ready?: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/meta/test-setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setup)
      });

      return await response.json();
    } catch (error) {
      console.error('Error testing Meta setup:', error);
      return {
        success: false,
        error: 'Network error during setup test'
      };
    }
  }

  /**
   * Save bot configuration to backend
   */
  async saveBotConfig(botId: string, config: BotConfiguration): Promise<{
    success: boolean;
    webhookUrl?: string;
    verifyToken?: string;
    message?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/bots/${botId}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });

      return await response.json();
    } catch (error) {
      console.error('Error saving bot config:', error);
      return {
        success: false,
        error: 'Failed to save bot configuration'
      };
    }
  }

  /**
   * Get bot configuration from backend
   */
  async getBotConfig(botId: string): Promise<BotConfiguration | null> {
    try {
      const response = await fetch(`${this.baseUrl}/bots/${botId}/config`);
      
      if (response.ok) {
        return await response.json();
      } else {
        console.log(`Bot ${botId} not found in backend`);
        return null;
      }
    } catch (error) {
      console.error('Error getting bot config:', error);
      return null;
    }
  }

  /**
   * Get all bot configurations
   */
  async getAllBots(): Promise<BotConfiguration[]> {
    try {
      const response = await fetch(`${this.baseUrl}/bots`);
      return await response.json();
    } catch (error) {
      console.error('Error getting all bots:', error);
      return [];
    }
  }

  /**
   * Send test message
   */
  async sendTestMessage(to: string, message: string, phoneNumberId?: string): Promise<{
    success: boolean;
    result?: any;
    message?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/test/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          message,
          phoneNumberId
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error sending test message:', error);
      return {
        success: false,
        error: 'Failed to send test message'
      };
    }
  }

  /**
   * Check backend health
   */
  async checkBackendHealth(): Promise<{
    status: string;
    timestamp?: string;
    bots?: number;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl.replace('/api', '')}/health`);
      
      if (response.ok) {
        return await response.json();
      } else {
        return {
          status: 'ERROR',
          error: `Backend returned ${response.status}`
        };
      }
    } catch (error) {
      console.error('Backend health check failed:', error);
      return {
        status: 'OFFLINE',
        error: 'Cannot connect to backend server'
      };
    }
  }

  /**
   * Generate webhook URL for a bot
   */
  getWebhookUrl(botId: string): string {
    // In production, replace localhost with your actual domain
    const baseWebhookUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-domain.com' 
      : 'http://localhost:3001';
    
    return `${baseWebhookUrl}/api/whatsapp/webhook/${botId}`;
  }

  /**
   * Get verify token
   */
  getVerifyToken(): string {
    return 'aliado_webhook_verify_token_2024';
  }

  /**
   * Sync frontend bot with backend
   */
  async syncBotWithBackend(botConfig: BotConfiguration): Promise<boolean> {
    try {
      console.log(`🔄 Syncing bot ${botConfig.name} with backend...`);
      
      const result = await this.saveBotConfig(botConfig.id, botConfig);
      
      if (result.success) {
        console.log(`✅ Bot ${botConfig.name} synced successfully`);
        return true;
      } else {
        console.error(`❌ Failed to sync bot ${botConfig.name}:`, result.error);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error syncing bot ${botConfig.name}:`, error);
      return false;
    }
  }

  /**
   * Auto-sync all frontend bots with backend on app start
   */
  async autoSyncBots(frontendBots: BotConfiguration[]): Promise<{
    synced: number;
    failed: number;
    results: Array<{botId: string, success: boolean, error?: string}>
  }> {
    console.log(`🔄 Auto-syncing ${frontendBots.length} bots with backend...`);
    
    const results = [];
    let synced = 0;
    let failed = 0;

    for (const bot of frontendBots) {
      try {
        const success = await this.syncBotWithBackend(bot);
        
        results.push({
          botId: bot.id,
          success
        });

        if (success) {
          synced++;
        } else {
          failed++;
        }

        // Small delay between syncs
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        failed++;
        results.push({
          botId: bot.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log(`✅ Auto-sync complete: ${synced} synced, ${failed} failed`);
    
    return { synced, failed, results };
  }
}

// Export singleton instance
export const whatsappIntegration = new WhatsAppIntegrationService();

export default WhatsAppIntegrationService;