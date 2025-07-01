export enum Page {
  HOME = "HOME",
  CAMPAIGN_OPTIMIZER = "CAMPAIGN_OPTIMIZER",
  ABOUT = "ABOUT",
  SETTINGS = "SETTINGS",
}

export enum AnalysisType {
  PERFORMANCE_ANALYSIS = "PERFORMANCE_ANALYSIS",
  TARGETING_OPTIMIZATION = "TARGETING_OPTIMIZATION",
  BIDDING_STRATEGIES = "BIDDING_STRATEGIES",
  MESSAGING_OPTIMIZATION = "MESSAGING_OPTIMIZATION",
  PREDICTIVE_ANALYTICS = "PREDICTIVE_ANALYTICS",
  ACTIONABLE_RECOMMENDATIONS = "ACTIONABLE_RECOMMENDATIONS",
  CROSS_CHANNEL_ATTRIBUTION = "CROSS_CHANNEL_ATTRIBUTION",
  COMPETITIVE_INTELLIGENCE = "COMPETITIVE_INTELLIGENCE",
}

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}


// For structured responses, if we parse them from Gemini output
export interface ExecutiveSummary {
  keyInsights: string[];
  priorityActions: string[];
}

export interface PerformanceMetric {
  name: string; // e.g., CTR, CPA, ROAS
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  channel?: string;
  segment?: string;
}

export interface OptimizationRecommendation {
  id: string;
  description: string;
  implementationSteps: string[];
  predictedImpact: string; // e.g., "+5% CTR", "Reduce CPA by $2"
  confidenceLevel?: 'High' | 'Medium' | 'Low';
  priority?: 'High' | 'Medium' | 'Low';
}

export interface RiskAssessment {
  risk: string;
  mitigation: string;
}

export interface StructuredAnalysisResponse {
  executiveSummary: ExecutiveSummary;
  detailedPerformance?: PerformanceMetric[]; // Optional, may not apply to all analysis types
  recommendations: OptimizationRecommendation[];
  predictedImpactMetrics?: { metric: string, value: string }[];
  riskAssessment?: RiskAssessment[];
  timeline?: string; // e.g., "1-2 weeks for implementation, results visible within 4 weeks"
  rawText?: string; // Fallback for Gemini's direct output
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

// Grounding chunk for Google Search results
export interface GroundingChunkWeb {
  uri: string;
  title: string;
}
export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // Potentially other types of chunks later
}

// Settings Page Types
export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

export interface NotificationPreferences {
  criticalAlerts: boolean;
  weeklySummary: boolean;
  newFeatureUpdates: boolean;
}