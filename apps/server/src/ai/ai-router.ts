import { Hono } from 'hono';
import { getBookInsights } from './ai-service';

const ai = new Hono();

ai.get('/book-insights', async (c) => {
  const { title, author } = c.req.query();
  try {
    const book_insights = await getBookInsights(title ?? '', author ?? '');
    if (!book_insights) {
      return c.json({ error: 'No AI provider available' }, 503);
    }
    return c.json(book_insights);
  } catch (error) {
    console.error('AI Insights Error:', error);
    return c.text('Failed to fetch data', 500);
  }
});

export { ai as aiRouter };
