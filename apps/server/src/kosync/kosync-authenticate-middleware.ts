import { Context, Next } from 'hono';
import { UserRepository } from './user-repository';
import { User } from '@koinsight/common/types/user';

declare module 'hono' {
  interface ContextVariableMap {
    user: User;
  }
}

export const authenticate = async (c: Context, next: Next) => {
  const username = c.req.header('x-auth-user');
  const key = c.req.header('x-auth-key');

  if (!username || !key) {
    return c.json({ error: 'Missing authentication headers' }, 401);
  }

  try {
    const user = await UserRepository.login(username, key);

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    } else {
      c.set('user', user);
      await next();
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
};
