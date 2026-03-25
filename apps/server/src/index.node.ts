import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import path from 'path';
import app from './app';
import { appConfig } from './config';

// Serve static web build
const webBuildPath = path.relative(process.cwd(), appConfig.webBuildPath);
app.use('/*', serveStatic({ root: webBuildPath }));
app.get('/*', serveStatic({ path: path.join(webBuildPath, 'index.html') }));

const port = appConfig.port;
const hostname = appConfig.hostname;

console.info(`KoInsight back-end is running on http://${hostname}:${port}`);

serve({ fetch: app.fetch, port, hostname });
