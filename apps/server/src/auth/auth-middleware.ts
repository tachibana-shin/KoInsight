import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { AppContext } from '../types';

export async function authMiddleware(c: Context<AppContext>, next: Next) {
  const dashboardPassword = c.env.DASHBOARD_PASSWORD;
  const path = c.req.path; 

  const isCoverApi = /^\/api\/books\/[^/]+\/cover$/.test(path);
  
  // Auth is disabled if DASHBOARD_PASSWORD is not set
  if (isCoverApi || !dashboardPassword) {
    return next();
  }

  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  // Allow no-auth bypass token (when DASHBOARD_PASSWORD is unset on the client side)
  if (token === 'no-auth') {
    return next();
  }

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const secret = c.env.JWT_SECRET || 'koinsight-secret';
    await verify(token, secret, 'HS256');
    return next();
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
}
