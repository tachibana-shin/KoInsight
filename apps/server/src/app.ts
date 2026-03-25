import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import path from 'path';
import { openAiRouter } from './ai/open-ai-router';
import { booksRouter } from './books/books-router';
import { coversRouter } from './books/covers/covers-router';
import { appConfig } from './config';
import { devicesRouter } from './devices/devices-router';
import { kopluginRouter } from './koplugin/koplugin-router';
import { kosyncRouter } from './kosync/kosync-router';
import { openLibraryRouter } from './open-library/open-library-router';
import { statsRouter } from './stats/stats-router';
import { uploadRouter } from './upload/upload-router';
import { db } from './db';

async function main() {
  const app = new Hono();

  // Middleware
  app.use('*', logger());
  app.use('*', cors({ origin: '*' }));

  // KoSync API (mounted at root to maintain compatibility)
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
  app.route('/api/ai', openAiRouter);

  // Serve static web build
  const webBuildPath = path.relative(process.cwd(), appConfig.webBuildPath);
  app.use('/*', serveStatic({ root: webBuildPath }));
  app.get('/*', serveStatic({ path: path.join(webBuildPath, 'index.html') }));

  const port = appConfig.port;
  const hostname = appConfig.hostname;

  console.info(`KoInsight back-end is running on http://${hostname}:${port}`);

  serve({ fetch: app.fetch, port, hostname });
}

main().catch(console.error);
