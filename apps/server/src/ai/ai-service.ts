import { getBookInsights as getGeminiInsights } from './gemini-service';
import { getBookInsights as getOpenAIInsights } from './open-ai-service';

export async function getBookInsights(bookTitle: string, bookAuthor: string) {
  // Priority: Gemini -> OpenAI
  if (process.env.GEMINI_API_KEY) {
    console.log('Using Gemini AI for insights');
    return getGeminiInsights(bookTitle, bookAuthor);
  }

  if (process.env.OPENAI_API_KEY) {
    console.log('Using OpenAI for insights');
    return getOpenAIInsights(bookTitle, bookAuthor);
  }

  console.warn('No AI API keys found');
  return undefined;
}
