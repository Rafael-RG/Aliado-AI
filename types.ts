
export interface Asset {
  id: string;
  ticker: string;
  name: string;
  type: string;
  value: number;
  change24h: number;
}

export interface KnowledgeAsset {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc';
  contentSummary: string;
  url?: string;
}

export interface BotStats {
  messagesSent: number;
  leadsCaptured: number;
  timeSavedHours: number;
  satisfactionRate: number;
  dailyData: { day: string; messages: number }[];
}

export interface WebWidgetConfig {
  primaryColor: string;
  position: 'right' | 'left';
  welcomeMessage: string;
  launcherIcon: 'bubble' | 'support' | 'ai';
}

export interface BotConfig {
  id: string;
  name: string;
  businessType: string;
  role: string;
  knowledgeBase: string;
  tone: 'professional' | 'friendly' | 'aggressive' | 'empathetic';
  assets: KnowledgeAsset[];
  status: 'active' | 'paused';
  stats?: BotStats;
  webConfig?: WebWidgetConfig;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isSubscribed: boolean;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  media?: {
    data: string;
    mimeType: string;
  };
}
