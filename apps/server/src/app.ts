import './config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authMiddleware } from './auth/auth-middleware';
import { authRouter } from './auth/auth-router';
import { aiRouter } from './ai/ai-router';
import { booksRouter } from './books/books-router';
import { coversRouter } from './books/covers/covers-router';
import { devicesRouter } from './devices/devices-router';
import { kopluginRouter } from './koplugin/koplugin-router';
import { kosyncRouter } from './kosync/kosync-router';
import { openLibraryRouter } from './open-library/open-library-router';
import { statsRouter } from './stats/stats-router';
import { uploadRouter } from './upload/upload-router';
import { createDb } from './db';
import { AppContext } from './types';

const app = new Hono<AppContext>();

// Middleware
app.use('*', logger());
app.use('*', cors({ origin: '*' }));

app.use('*', async (c, next) => {
  const url = c.env.DATABASE_URL;
  if (!url) {
    return c.json({ error: 'DATABASE_URL is not set' }, 500);
  }
  const db = createDb(url);
  c.set('db', db);
  await next();
});

// Auth routes (public - no auth middleware)
app.route('/api/auth', authRouter);

// Protect all /api/* routes with auth middleware (JWT check)
app.use('/api/*', authMiddleware);

// KoSync API (mounted at root to maintain compatibility) - not protected
app.route('/', kosyncRouter);

// API routes
app.route('/api/plugin', kopluginRouter);
app.route('/api/devices', devicesRouter);
app.route('/api/books', booksRouter);
// Note: covers sub-router is nested under books/:bookId/cover
app.route('/api/books/:bookId/cover', coversRouter);
app.route('/api/stats', statsRouter);
app.route('/api/upload', uploadRouter);
app.route('/api/open-library', openLibraryRouter);
app.route('/api/ai', aiRouter);

export default app;
