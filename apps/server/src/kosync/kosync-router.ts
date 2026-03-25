import { Hono } from 'hono';
import { authenticate } from './kosync-authenticate-middleware';
import { KosyncRepository } from './kosync-repository';
import { UserExistsError, UserRepository } from './user-repository';
import { AppContext } from '../types';

const kosync = new Hono<AppContext>();

/**
 *  KoSync API: User Creation
 */
kosync.post('/users/create', async (c) => {
  const { username, password } = await c.req.json();

  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400);
  }
  const db = c.get('db');
  try {
    await UserRepository.createUser(db, username, password);
  } catch (error) {
    if (error instanceof UserExistsError) {
      return c.json({ error: 'User already exists' }, 402);
    } else {
      console.error(error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  return c.json({ message: 'User created successfully' }, 201);
});

/**
 * KoSync API: Auth check
 */
kosync.get('/users/auth', async (c) => {
  const username = c.req.header('x-auth-user');
  const password = c.req.header('x-auth-key');

  if (!username || !password) {
    return c.json({ error: 'Invalid request' }, 400);
  }

  const db = c.get('db');
  let user = null;
  try {
    user = await UserRepository.login(db, username, password);
  } catch (error) {}

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  } else {
    return c.json({ authorized: 'OK' });
  }
});

/**
 * KoSync API: Update progress
 */
kosync.put('/syncs/progress', authenticate, async (c) => {
  const { document, progress, percentage, device, device_id } = await c.req.json();
  const user = c.get('user');

  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  if (!document || !progress || !percentage || !device || !device_id) {
    return c.json({ error: 'All fields are required' }, 400);
  }

  const db = c.get('db');
  try {
    const insertedProgress = await KosyncRepository.upsert(db, user.id, {
      document,
      progress,
      percentage,
      device,
      deviceId: device_id,
    });
    return c.json(insertedProgress);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * KoSync API: Get progress for document
 */
kosync.get('/syncs/progress/:document', authenticate, async (c) => {
  const document = c.req.param('document');
  const user = c.get('user');

  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  if (!document) {
    return c.json({ error: 'Document is required' }, 400);
  }

  const db = c.get('db');
  const progress = await KosyncRepository.getByUserIdAndDocument(db, user.id, document);
  if (!progress) {
    return c.json({ error: 'Progress not found' }, 404);
  }

  return c.json(progress);
});

/**
 * Get all progresses
 */
kosync.get('/syncs/progress', async (c) => {
  const db = c.get('db');
  const progresses = await KosyncRepository.getAll(db);
  return c.json(progresses);
});

export { kosync as kosyncRouter };
