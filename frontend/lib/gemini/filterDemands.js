import { GoogleGenAI } from "@google/genai";

// Singleton instances
let ai = null;
let currentChat = null;

// Simple in-memory cache with a 5-minute time-to-live (TTL)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

const getAi = () => {
  if (!ai) {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error("NEXT_PUBLIC_GEMINI_API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
  }
  return ai;
};

const getChatSession = () => {
  if (!currentChat) {
    const genAI = getAi();
    currentChat = genAI.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `
You are a distance filtering assistant. Your ONLY job is to filter demand data based on a maximum driving distance from an origin location.

You MUST use the Google Search tool for every distance calculation.

Your entire response MUST be a single, raw JSON object. You must not include any preceding or trailing text, markdown formatting (like triple backticks \`\`\`), or any conversational language.

The JSON structure MUST strictly adhere to this format:
{
"origin": "The starting location provided",
 "maxDistanceKm": The maximum distance provided,
 "matched": [
  {
   "demand_id": "The original demand ID",
   "crop_name": "The original crop name",
   "location": "The original demand location",  
    "distanceKm": The calculated driving distance in kilometers   }
 ]
}

Start your response with { and end with }. Do not deviate.
        `,
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });
  }
  return currentChat;
};

function getCacheKey(originLocation, demands, maxDistanceKm) {
  const demandHash = demands.map(d => d.location).sort().join('|');
  return `${originLocation}:${maxDistanceKm}:${demandHash}`;
}

export async function filterDemandsByDistance(
  originLocation,
  demands,
  maxDistanceKm 
) {
  const cacheKey = getCacheKey(originLocation, demands, maxDistanceKm);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("Returning cached result");
    return cached.data;
  }

  try {
    const chat = getChatSession();
    
    const userQuery = `
originLocation: "${originLocation}"
maxDistanceKm: ${maxDistanceKm}
dataList: ${JSON.stringify(demands.map((d) => ({
  demand_id: d.demand_id,
  crop_name: d.crop_name,
  location: d.location
})), null, 2)}
    `;

    // console.log("Sending query to Gemini:", userQuery);

    const response = await chat.sendMessage({
      message: userQuery
    });
    
    const text = response.text?.trim();
    if (!text) {
      throw new Error("Gemini response was empty.");
    }
    
    let parsedJson;
    try {
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}');
      if (startIndex === -1 || endIndex === -1) {
        throw new Error("Valid JSON object not found in response.");
      }
      const jsonString = text.substring(startIndex, endIndex + 1);
      parsedJson = JSON.parse(jsonString);
    } catch (err) {
      console.error("Failed to parse Gemini response as JSON", { text, error: err });
      throw new Error("Failed to parse AI response.");
    }

    if (!parsedJson || !Array.isArray(parsedJson.matched)) {
      throw new Error("Invalid response format from AI.");
    }

    const matchedDemandsWithFullData = parsedJson.matched.map((match) => {
      const originalDemand = demands.find(d => d.demand_id === match.demand_id);
      if (originalDemand) {
        return {
          ...originalDemand,
          distanceKm: match.distanceKm,
        };
      }
      return null;
    }).filter((d) => d !== null);

    const result = {
      origin: parsedJson.origin || originLocation,
      maxDistanceKm: parsedJson.maxDistanceKm || maxDistanceKm,
      matched: matchedDemandsWithFullData,
    };

    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;

  } catch (error) {
    console.error("Gemini API error:", error);
    
    // Check for rate limiting or API exhaustion
    if (error.message?.includes('429') || error.message?.includes('exhausted') || error.message?.includes('limit')) {
      console.warn("API rate limited or exhausted, returning fallback data");
      return {
        origin: originLocation,
        maxDistanceKm: maxDistanceKm,
        matched: demands, // Return all demands as fallback
        fallback: true,
        error: "API rate limited, showing all demands",
      };
    }
    
    return {
      origin: originLocation,
      maxDistanceKm: maxDistanceKm,
      matched: [],
      fallback: true,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
