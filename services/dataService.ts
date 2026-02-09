/**
 * Data Service - Frontend
 * Connects to backend API to fetch demo and real data from Azure Storage
 */

const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  name: string;
  isSubscribed: boolean;
  plan: string;
  subscriptionExpiry?: string;
  businesses: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  type: string;
  industry: string;
  description: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  bots: string[];
  whatsappConnections: string[];
  subscriptions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Bot {
  id: string;
  businessId: string;
  name: string;
  role: string;
  tone: string;
  businessType: string;
  knowledgeBase: string;
  customInstructions?: string;
  webConfig?: {
    primaryColor: string;
    welcomeMessage: string;
    position: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TrainingData {
  id: string;
  businessId: string;
  botId: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Metrics {
  id: string;
  businessId: string;
  botId: string;
  date: string;
  conversations: {
    total: number;
    new: number;
    returning: number;
    completed: number;
  };
  messages: {
    sent: number;
    received: number;
    failed: number;
  };
  performance: {
    avgResponseTime: number;
    resolutionRate: number;
    satisfactionScore: number;
  };
  business: {
    leadsCaptured: number;
    salesConverted: number;
    revenue: number;
    timeSaved: number;
  };
}

export interface StorageStatus {
  storageType: string;
  isAzureStorage: boolean;
  connectionString: string;
  statistics: {
    totalUsers: number;
    totalBusinesses: number;
    totalBots: number;
    totalTrainingData: number;
    totalMetrics: number;
    lastUpdated: string;
  };
  demoUser: string;
  message: string;
}

class DataService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get storage status and statistics
   */
  async getStorageStatus(): Promise<StorageStatus | null> {
    try {
      const response = await fetch(`${this.baseUrl}/storage/status`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to fetch storage status');
    } catch (error) {
      console.error('Error getting storage status:', error);
      return null;
    }
  }

  /**
   * Get demo data details
   */
  async getDemoData(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/storage/demo-data`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to fetch demo data');
    } catch (error) {
      console.error('Error getting demo data:', error);
      return null;
    }
  }

  /**
   * Get all users
   */
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users`);
      const result = await response.json();
      
      if (result.success) {
        return result.data || [];
      }
      throw new Error(result.error || 'Failed to fetch users');
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  /**
   * Get demo user
   */
  async getDemoUser(): Promise<User | null> {
    try {
      const users = await this.getUsers();
      return users.find(u => u.email === 'demo@aliado-ai.com') || null;
    } catch (error) {
      console.error('Error getting demo user:', error);
      return null;
    }
  }

  /**
   * Get all businesses
   */
  async getBusinesses(): Promise<Business[]> {
    try {
      const response = await fetch(`${this.baseUrl}/businesses`);
      const result = await response.json();
      
      if (result.success) {
        return result.data || [];
      }
      throw new Error(result.error || 'Failed to fetch businesses');
    } catch (error) {
      console.error('Error getting businesses:', error);
      return [];
    }
  }

  /**
   * Get demo business
   */
  async getDemoBusiness(): Promise<Business | null> {
    try {
      const businesses = await this.getBusinesses();
      return businesses.find(b => b.name === 'Demo Restaurant') || null;
    } catch (error) {
      console.error('Error getting demo business:', error);
      return null;
    }
  }

  /**
   * Get all bots
   */
  async getBots(): Promise<Bot[]> {
    try {
      const response = await fetch(`${this.baseUrl}/bots`);
      const result = await response.json();
      
      if (result.success) {
        return result.data || [];
      }
      throw new Error(result.error || 'Failed to fetch bots');
    } catch (error) {
      console.error('Error getting bots:', error);
      return [];
    }
  }

  /**
   * Get bots for a specific business
   */
  async getBusinessBots(businessId: string): Promise<Bot[]> {
    try {
      const bots = await this.getBots();
      return bots.filter(bot => bot.businessId === businessId);
    } catch (error) {
      console.error('Error getting business bots:', error);
      return [];
    }
  }

  /**
   * Get demo bot
   */
  async getDemoBot(): Promise<Bot | null> {
    try {
      const bots = await this.getBots();
      return bots.find(b => b.name === 'Asistente de Restaurante') || null;
    } catch (error) {
      console.error('Error getting demo bot:', error);
      return null;
    }
  }

  /**
   * Get metrics for a business
   */
  async getBusinessMetrics(businessId: string): Promise<Metrics[]> {
    try {
      const response = await fetch(`${this.baseUrl}/metrics?businessId=${businessId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data || [];
      }
      throw new Error(result.error || 'Failed to fetch metrics');
    } catch (error) {
      console.error('Error getting business metrics:', error);
      return [];
    }
  }

  /**
   * Get training data for a bot (placeholder - endpoint doesn't exist yet)
   */
  async getBotTrainingData(botId: string): Promise<TrainingData[]> {
    try {
      // For now, get all training data and filter
      const demoData = await this.getDemoData();
      return demoData?.training?.SampleQuestions?.map((q: any, index: number) => ({
        id: `training_${index}`,
        businessId: '',
        botId: botId,
        question: q,
        answer: '',
        category: 'Demo',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })) || [];
    } catch (error) {
      console.error('Error getting bot training data:', error);
      return [];
    }
  }

  /**
   * Get complete demo data bundle
   */
  async getCompleteDemoData(): Promise<{
    user: User | null;
    business: Business | null;
    bot: Bot | null;
    trainingData: TrainingData[];
    metrics: Metrics[];
    storageStatus: StorageStatus | null;
  }> {
    try {
      const [user, business, bot, storageStatus] = await Promise.all([
        this.getDemoUser(),
        this.getDemoBusiness(),
        this.getDemoBot(),
        this.getStorageStatus()
      ]);

      let trainingData: TrainingData[] = [];
      let metrics: Metrics[] = [];

      if (bot) {
        trainingData = await this.getBotTrainingData(bot.id);
      }

      if (business) {
        metrics = await this.getBusinessMetrics(business.id);
      }

      return {
        user,
        business,
        bot,
        trainingData,
        metrics,
        storageStatus
      };
    } catch (error) {
      console.error('Error getting complete demo data:', error);
      return {
        user: null,
        business: null,
        bot: null,
        trainingData: [],
        metrics: [],
        storageStatus: null
      };
    }
  }
}

// Export singleton instance
export const dataService = new DataService();