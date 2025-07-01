
import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from "@google/genai";
import { AnalysisType } from '../types';
import { GEMINI_API_MODEL_TEXT, API_KEY_WARNING, Branding } from '../constants';

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn(API_KEY_WARNING);
    throw new Error("API_KEY environment variable not configured. Please set it to use the AI features.");
  }
  return apiKey;
};

let ai: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = getApiKey();
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

const getAnalysisTypeName = (type: AnalysisType): string => {
  switch (type) {
    case AnalysisType.PERFORMANCE_ANALYSIS: return "Real-Time Performance Analysis";
    case AnalysisType.TARGETING_OPTIMIZATION: return "AI-Enhanced Targeting Optimization";
    case AnalysisType.BIDDING_STRATEGIES: return "Intelligent Bidding Strategies";
    case AnalysisType.MESSAGING_OPTIMIZATION: return "Dynamic Messaging Optimization";
    case AnalysisType.PREDICTIVE_ANALYTICS: return "Predictive Analytics Engine";
    case AnalysisType.ACTIONABLE_RECOMMENDATIONS: return "Actionable Recommendations System";
    case AnalysisType.CROSS_CHANNEL_ATTRIBUTION: return "Cross-Channel Attribution";
    case AnalysisType.COMPETITIVE_INTELLIGENCE: return "Competitive Intelligence";
    default: return "Marketing Analysis";
  }
};

const constructPrompt = (analysisType: AnalysisType, userInput: string): string => {
  const analysisTypeName = getAnalysisTypeName(analysisType);

  // Common instructions for Gemini
  const commonInstructions = `
You are an expert AI marketing analyst and campaign optimization specialist working for ${Branding.brand.longName}. Your slogan is "${Branding.brand.slogan}".
Your goal is to provide comprehensive, actionable insights based on the user's input.
Use clear, concise language and avoid excessive marketing jargon.
All recommendations must be data-driven and logical.
Focus on measurable business outcomes.
Whenever you provide an analysis, format your response in Markdown. Use ## for main sections and ### for subsections.

OUTPUT FORMAT (Strictly Adhere):
For the requested analysis on "${analysisTypeName}", provide:
## Executive Summary
- Key insights (bullet points)
- Priority actions (bullet points)

## Detailed Analysis / Breakdown
(Provide a detailed breakdown relevant to the analysis type. For example, by channel, campaign, audience segment, performance metrics like CTR, CPA, ROAS, etc., as applicable based on user input and analysis type)

## Optimization Recommendations
(Specific, prioritized action items with implementation steps. Be very specific.)
- Recommendation 1:
  - Steps: ...
  - Predicted Impact: ...
  - Confidence Level: (High/Medium/Low)
  - Priority: (High/Medium/Low)
- Recommendation 2: ...

## Predicted Impact Metrics
(Overall predicted impact if recommendations are followed)
- Metric 1: Predicted change (e.g., ROAS: +15%)
- Metric 2: ...

## Risk Assessment and Mitigation (If applicable)
- Potential Risk 1: ...
  - Mitigation Strategy: ...

## Timeline (If applicable)
- Estimated timeline for implementation and expected results.

## Other Considerations (If applicable)
- Market conditions, seasonality, competitive landscape, budget constraints, brand guidelines, etc. that were implicitly or explicitly considered.

Consider the following general factors in your analysis:
- Current market conditions and seasonality
- Industry benchmarks and competitive landscape
- Historical performance trends and patterns (if provided by user)
- Budget constraints and resource limitations (if provided by user)
- Brand guidelines and messaging consistency
- Compliance requirements and platform policies

Begin your analysis based on the user's specific input below.
  `;

  return `
${commonInstructions}

USER INPUT FOR ${analysisTypeName}:
---
${userInput}
---

Provide your analysis now.
`;
};

export const generateMarketingAnalysis = async (analysisType: AnalysisType, userInput: string): Promise<string> => {
  const client = getAIClient();
  const prompt = constructPrompt(analysisType, userInput);

  try {
    // Determine if Google Search grounding should be used
    // Example: Use search for competitive intelligence or performance analysis if it implies recent data
    const useSearchGrounding = [
      AnalysisType.COMPETITIVE_INTELLIGENCE,
      AnalysisType.PERFORMANCE_ANALYSIS, 
      AnalysisType.PREDICTIVE_ANALYTICS // For market trends
    ].includes(analysisType);

    const config: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
        // responseMimeType: "text/plain", // Default is text/plain. Markdown is text.
    };
    if (useSearchGrounding) {
        config.tools = [{googleSearch: {}}];
    } else {
        // Only add thinkingConfig if not using search, as it might conflict or be less relevant for search-grounded queries.
        // And thinkingConfig is only for 'gemini-2.5-flash-preview-04-17'
        if (GEMINI_API_MODEL_TEXT === 'gemini-2.5-flash-preview-04-17') {
           // Default thinking for higher quality, or { thinkingBudget: 0 } for low latency
           // For this complex analysis, default (enabled) thinking is better.
        }
    }


    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_API_MODEL_TEXT,
      contents: prompt,
      config: config,
    });

    let textResponse = response.text;
    
    // Append grounding sources if available
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata?.groundingChunks && groundingMetadata.groundingChunks.length > 0) {
        const webChunks = groundingMetadata.groundingChunks
            .filter((chunk: GroundingChunk) => chunk.web && chunk.web.uri)
            .map((chunk: GroundingChunk) => chunk.web);
      
        if (webChunks.length > 0) {
            textResponse += `\n\n[SOURCES:${JSON.stringify(webChunks)}]`;
        }
    }

    return textResponse;

  } catch (error) {
    console.error('Gemini API call failed:', error);
    if (error instanceof Error && error.message.includes("API_KEY_NOT_VALID")) {
        throw new Error("Invalid API Key. Please check your API_KEY environment variable.");
    }
    if (error instanceof Error && error.message.includes("quota")) {
        throw new Error("API quota exceeded. Please check your Google Cloud console.");
    }
    throw new Error(`Failed to get analysis from AI: ${error instanceof Error ? error.message : String(error)}`);
  }
};
