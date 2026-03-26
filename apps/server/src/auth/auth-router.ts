import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { AppContext } from '../types';

const auth = new Hono<AppContext>();

auth.post('/login', async (c) => {
  const dashboardPassword = c.env.DASHBOARD_PASSWORD;

  // If no password is configured, auth is disabled – return a bypass token
  if (!dashboardPassword) {
    return c.json({ token: 'no-auth' });
  }

  const { password } = await c.req.json<{ password: string }>();
  if (!password || password !== dashboardPassword) {
    return c.json({ error: 'Invalid password' }, 401);
  }

  const secret = c.env.JWT_SECRET || 'koinsight-secret';
  const token = await sign({ iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, secret);
  return c.json({ token });
});

auth.get('/verify', async (c) => {
  return c.json({ ok: true });
});

export { auth as authRouter };
