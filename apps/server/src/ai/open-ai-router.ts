import { Hono } from 'hono';
import { getBookInsights } from './open-ai-service';

const ai = new Hono();

ai.get('/book-insights', async (c) => {
  const { title, author } = c.req.query();
  try {
    const book_insights = await getBookInsights(title ?? '', author ?? '');
    return c.json(book_insights);
  } catch {
    return c.text('Failed to fetch data', 500);
  }
});

export { ai as openAiRouter };
