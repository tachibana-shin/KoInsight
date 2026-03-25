import { Context, Next } from 'hono';
import { UserRepository } from './user-repository';
import { AppContext } from '../types';
import { User } from '@koinsight/common/types/user';

export const authenticate = async (c: Context<AppContext>, next: Next) => {
  // Use any for context because Hono middleware type is tricky with generics
  // But we can still get 'db' from it.
  const username = c.req.header('x-auth-user');
  const key = c.req.header('x-auth-key');

  if (!username || !key) {
    return c.json({ error: 'Missing authentication headers' }, 401);
  }

  const db = c.get('db');
  try {
    const user = await UserRepository.login(db, username, key);

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
