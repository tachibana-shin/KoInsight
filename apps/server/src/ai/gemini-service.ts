import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const BookInsights = z.object({
  genres: z.array(z.string()),
  summary: z.string(),
});

let cachedGenAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  if (!cachedGenAI) {
    cachedGenAI = new GoogleGenerativeAI(apiKey);
  }
  return cachedGenAI;
}

export async function getBookInsights(bookTitle: string, bookAuthor: string) {
  const genAI = getClient();
  if (!genAI) return undefined;

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const prompt = `You are an expert librarian. Respond ONLY with a JSON object with fields: {"genres": string[], "summary": string}.
Give me genres and a short summary for "${bookTitle}" by ${bookAuthor}.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const data = JSON.parse(text);
    return BookInsights.parse(data);
  } catch (error) {
    console.error('Failed to parse Gemini response:', text, error);
    throw new Error('Model did not return valid JSON');
  }
}
