
import { GoogleGenAI, Type } from "@google/genai";
import { DigitizationResult } from "../types";

export const digitizeLabTable = async (base64Image: string): Promise<DigitizationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Extract all table data from this lab experiment image. 
    Focus on numerical values and their headers (e.g., "Time (s)", "Voltage [V]", "Current (mA)").
    Be precise with decimal points. 
    If a header has a unit, include the unit in the header string.
    If a value is unreadable, use null or empty string.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1] || base64Image
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headers: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The column headers found in the table."
            },
            rows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                description: "An object representing a row where keys are headers."
              },
              description: "The data rows from the table."
            },
            rawText: {
              type: Type.STRING,
              description: "A summary of any other notes or text found on the sheet."
            }
          },
          required: ["headers", "rows"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      table: {
        headers: result.headers || [],
        rows: result.rows || []
      },
      rawText: result.rawText || ""
    };
  } catch (error) {
    console.error("Gemini Digitization Error:", error);
    throw new Error("Failed to digitize table. Please ensure the image is clear and contains a table.");
  }
};
