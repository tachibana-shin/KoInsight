import { Progress } from '@koinsight/common/types/progress';
import { DB } from '../db';
import * as schema from '../db/schema';
import { eq, and } from 'drizzle-orm';

export type ProgressCreate = Omit<Progress, 'id' | 'createdAt' | 'updatedAt'>;
export type ProgressUpdate = Omit<Progress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export class KosyncRepository {
  static async hasDocument(db: DB, userId: number, document: string): Promise<boolean> {
    const [result] = await db
      .select({ id: schema.progress.id })
      .from(schema.progress)
      .where(and(eq(schema.progress.userId, userId), eq(schema.progress.document, document)));
    return !!result;
  }

  static async create(db: DB, progress: ProgressCreate): Promise<Progress | undefined> {
    const [result] = await db.insert(schema.progress).values(progress).returning();

    return result;
  }

  static async update(
    db: DB,
    userId: number,
    progress: ProgressUpdate
  ): Promise<Progress | undefined> {
    const [result] = await db
      .update(schema.progress)
      .set(progress)
      .where(
        and(eq(schema.progress.userId, userId), eq(schema.progress.document, progress.document))
      )
      .returning();

    return result;
  }

  static async upsert(
    db: DB,
    userId: number,
    progress: ProgressUpdate
  ): Promise<Progress | undefined> {
    const exists = await this.hasDocument(db, userId, progress.document);

    if (exists) {
      return this.update(db, userId, progress);
    } else {
      return this.create(db, { ...progress, userId });
    }
  }

  static async getByUserIdAndDocument(
    db: DB,
    userId: number,
    document: string
  ): Promise<Progress | undefined> {
    const [result] = await db
      .select()
      .from(schema.progress)
      .where(and(eq(schema.progress.userId, userId), eq(schema.progress.document, document)));

    return result;
  }

  static async getAll(db: DB) {
    const result = await db
      .select({
        document: schema.progress.document,
        progress: schema.progress.progress,
        percentage: schema.progress.percentage,
        device: schema.progress.device,
        device_id: schema.progress.deviceId,
        created_at: schema.progress.createdAt,
        updated_at: schema.progress.updatedAt,
        username: schema.user.username,
      })
      .from(schema.progress)
      .innerJoin(schema.user, eq(schema.user.id, schema.progress.userId));

    return result;
  }
}
