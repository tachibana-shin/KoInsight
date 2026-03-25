import bcrypt from 'bcryptjs';
import { db } from '../db';
import * as schema from '../db/schema';
import { User } from '@koinsight/common/types/user';
import { eq } from 'drizzle-orm';

const SALT_ROUNDS = 12;

async function hashPassword(plain: string): Promise<string> {
  return await bcrypt.hash(plain, SALT_ROUNDS);
}

export class UserExistsError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'UserExistsError';
  }
}

export class UserRepository {
  static async login(username: string, password: string): Promise<User | null> {
    const [user] = await db.select().from(schema.user).where(eq(schema.user.username, username));
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return {
      ...user,
      password_hash: user.passwordHash,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  static async createUser(username: string, password: string): Promise<void> {
    const [existingUser] = await db.select().from(schema.user).where(eq(schema.user.username, username));

    if (existingUser) {
      throw new UserExistsError();
    }

    const passwordHash = await hashPassword(password);
    await db.insert(schema.user).values({
      username,
      passwordHash: passwordHash
    });
  }
}
