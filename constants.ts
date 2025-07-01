import { AnalysisType, Page, SelectOption } from './types';

export const Branding = {
  brand: {
    shortName: "HERE AND NOW AI",
    longName: "HERE AND NOW AI - Artificial Intelligence Research Institute",
    website: "https://hereandnowai.com",
    email: "info@hereandnowai.com",
    mobile: "+91 996 296 1000",
    slogan: "designed with passion for innovation",
    colors: {
      primary: "#FFDF00",
      secondary: "#004040"
    },
    logo: {
      title: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png",
      favicon: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/favicon-logo-with-name.png"
    },
    chatbot: {
      avatar: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/caramel.jpeg",
      face: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/caramel-face.jpeg"
    },
    socialMedia: {
      blog: "https://hereandnowai.com/blog",
      linkedin: "https://www.linkedin.com/company/hereandnowai/",
      instagram: "https://instagram.com/hereandnow_ai",
      github: "https://github.com/hereandnowai",
      x: "https://x.com/hereandnow_ai",
      youtube: "https://youtube.com/@hereandnow_ai"
    }
  }
};

export const GEMINI_API_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
export const API_KEY_WARNING = "API_KEY environment variable not set. Please set it to use Gemini API.";

export const PageTitles: Record<Page, string> = {
  [Page.HOME]: "Home",
  [Page.CAMPAIGN_OPTIMIZER]: "Campaign Optimizer",
  [Page.ABOUT]: "About Us",
  [Page.SETTINGS]: "Settings",
};

export const analysisOptions: SelectOption<AnalysisType>[] = [
  { value: AnalysisType.PERFORMANCE_ANALYSIS, label: "Real-Time Performance Analysis" },
  { value: AnalysisType.TARGETING_OPTIMIZATION, label: "AI-Enhanced Targeting Optimization" },
  { value: AnalysisType.BIDDING_STRATEGIES, label: "Intelligent Bidding Strategies" },
  { value: AnalysisType.MESSAGING_OPTIMIZATION, label: "Dynamic Messaging Optimization" },
  { value: AnalysisType.PREDICTIVE_ANALYTICS, label: "Predictive Analytics Engine" },
  { value: AnalysisType.ACTIONABLE_RECOMMENDATIONS, label: "Actionable Recommendations System" },
  { value: AnalysisType.CROSS_CHANNEL_ATTRIBUTION, label: "Cross-Channel Attribution" },
  { value: AnalysisType.COMPETITIVE_INTELLIGENCE, label: "Competitive Intelligence" },
];
