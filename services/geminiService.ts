
import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getClimbAdvice = async (mountain: string) => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `针对攀登 ${mountain} 提供 3 条关键的专业登山建议。请用中文回答，保持简洁。`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "请确保您已经过适当的高海拔适应，并检查当地天气状况。";
  }
};

export const searchMountains = async (query: string) => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `查询关于 ${query} 的详细登山信息。包括海拔高度、难度等级和最佳攀登季节。请用中文回答。`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || '来源',
      uri: chunk.web?.uri
    })).filter((s: any) => s.uri) || [];

    return {
      text: response.text,
      sources: sources
    };
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
};

export const getNotificationSummary = async () => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "为一名专业登山者生成一段约 30 字的“高山晨报”。包含一个模拟的阿尔卑斯山天气预警和一条励志建议。请用中文回答。",
    });
    return response.text;
  } catch (error) {
    return "天气警报：勃朗峰地区预计有强风。今天请保持在低海拔。记住：山永远在那里。";
  }
};

export const getGearRecommendations = async (objective: string) => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `针对目标：${objective}，列出 5 件必备的专业登山装备。为每件装备提供一个简短的理由说明为什么它对该特定目标至关重要。请用中文回答。`,
    });
    return response.text;
  } catch (error) {
    return "标准登山套装：冰爪、冰镐、安全带、头盔和分层技术服装。";
  }
};

export const getTrendingInsights = async () => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "简要总结 2024 年全球登山界的 3 个热门话题或安全警示。请用中文回答，保持简洁。",
    });
    return response.text;
  } catch (error) {
    return "趋势：德纳里峰的早春尝试；对低影响登山伦理的关注增加；喀喇昆仑山脉的新天气追踪技术。";
  }
};

export const generateProfileSummary = async (stats: any) => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `为一名拥有 ${stats.climbs} 次登顶记录和 ${stats.followers} 名关注者的登山者生成一句专业的登山座右铭。请用中文回答。`,
    });
    return response.text;
  } catch (error) {
    return "在世界上最具挑战性的峰峦间不断突破极限。";
  }
};
