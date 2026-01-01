
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION_ADVISOR, SYSTEM_INSTRUCTION_TRAINER, SYSTEM_INSTRUCTION_WEEKLY_TIP } from "../constants";
import { ChatMessage, StoredReport, KnowledgeDocument } from "../types";

/**
 * Advisor Chat with Streaming for High Performance
 */
export const generateAdvisorResponseStream = async (
  history: ChatMessage[], 
  currentMessage: string,
  knowledgeBase: KnowledgeDocument[] = [],
  onChunk: (chunk: string) => void
): Promise<void> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const kbContext = knowledgeBase.length > 0 
      ? `KB:\n${knowledgeBase.map(doc => `[${doc.title}]: ${doc.content.substring(0, 500)}`).join('\n')}`
      : "";

    const conversationContext = history.slice(-4).map(h => `${h.role}: ${h.text}`).join('\n');
    
    const fullPrompt = `
      ${kbContext}
      CONTEXT:
      ${conversationContext}
      CEO: ${currentMessage}
    `;

    const result = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ADVISOR,
        temperature: 0.4,
        thinkingConfig: { thinkingBudget: 0 },
        maxOutputTokens: 1000,
      }
    });

    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error("Streaming Error:", error);
    onChunk("⚠️ **Operational Link Failure.** Strategy engine is experiencing high latency. Please retry.");
  }
};

/**
 * Audit Service for Individual Incident Reports
 */
export const analyzeReport = async (reportText: string, previousReports: StoredReport[] = []): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a professional security audit on the following report. Identify risks, standard violations, and tactical gaps. Use bullet points for clarity:\n\n${reportText}`,
      config: { 
        systemInstruction: "You are a Chief Audit Officer. Use ISO 18788 standards. Be clinical and precise.",
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Analysis failed.";
  } catch (e) {
    return "Error: Audit engine timeout.";
  }
};

/**
 * Cross-Report Operational Insights Service
 */
export const generateOperationalInsights = async (reports: StoredReport[]): Promise<string> => {
  if (reports.length === 0) return "Insufficient data for pattern detection.";
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const reportSummary = reports.map((r, i) => `REPORT ${i+1} (${r.dateStr}): ${r.content}`).join('\n---\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these operational logs for strategic patterns, recurring vulnerabilities, and high-risk trends. Provide a "CEO Briefing" format:\n\n${reportSummary}`,
      config: { 
        systemInstruction: "You are a Senior Strategic Analyst. Focus on 'Predictive Intelligence'. Identify: 1. Recurring Vulnerabilities 2. Temporal Patterns (When/Where) 3. Systemic Failures 4. Strategic Recommendations.",
        temperature: 0.3,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Insight synthesis failed.";
  } catch (e) {
    return "Error: Strategic engine timeout.";
  }
};

/**
 * Intelligence Hub Service with Google Search Grounding
 * Optimized: Removed explicit thinkingBudget to ensure tool synthesis works correctly.
 */
export const fetchBestPractices = async (topic: string): Promise<{ text: string; sources?: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find and synthesize the latest global security best practices, regulatory updates, and tactical standards regarding: ${topic}. Ensure the answer is grounded in current web search data.`,
      config: { 
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    // Extract grounding sources safely
    const candidate = response.candidates?.[0];
    const metadata = candidate?.groundingMetadata;
    
    const sources = metadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri)
      .map((web: any) => ({
        title: web.title || 'Intelligence Source',
        url: web.uri
      })) || [];

    return { 
      text: response.text || "No intelligence could be synthesized for this topic.", 
      sources 
    };
  } catch (error) {
    console.error("Grounding Error:", error);
    return { text: "⚠️ **Intelligence Retrieval Failure.** Unable to ground this query in real-time global data. Please check your connectivity or try a broader topic.", sources: [] };
  }
};

export const generateWeeklyTip = async (topic?: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: topic || "Generate a high-impact weekly security standard tip for a CEO to share with his team.",
    config: { 
      systemInstruction: SYSTEM_INSTRUCTION_WEEKLY_TIP,
      temperature: 0.6,
      thinkingConfig: { thinkingBudget: 0 }
    }
  });
  return response.text || "Generation failed.";
};

export const generateTrainingModule = async (role: string, topic: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Target Audience: ${role}\nTraining Topic: ${topic}`,
    config: { 
      systemInstruction: SYSTEM_INSTRUCTION_TRAINER,
      temperature: 0.5,
      thinkingConfig: { thinkingBudget: 0 }
    }
  });
  return response.text || "Training generation failed.";
};
