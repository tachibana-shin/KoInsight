import { handle } from 'hono/netlify';
import app from './app';

export const handler = handle(app);
