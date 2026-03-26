import { PageStat } from '@koinsight/common/types';
import { eq, isNull, and } from 'drizzle-orm';
import { DB } from '../db';
import * as schema from '../db/schema';
import { PgUpdateSetSource } from 'drizzle-orm/pg-core';

export class StatsRepository {
  private static updateStartTime(stat: PageStat): PageStat {
    return {
      ...stat,
      start_time: stat.start_time * 1000,
    };
  }

  static async getAll(db: DB): Promise<PageStat[]> {
    const stats = await db
      .select({
        id: schema.pageStat.id,
        book_md5: schema.pageStat.book_md5,
        device_id: schema.pageStat.device_id,
        page: schema.pageStat.page,
        duration: schema.pageStat.duration,
        total_pages: schema.pageStat.total_pages,
        start_time: schema.pageStat.start_time,
      })
      .from(schema.pageStat)
      .innerJoin(schema.book, eq(schema.pageStat.book_md5, schema.book.md5))
      .where(isNull(schema.book.soft_deleted_at));

    return stats.map(this.updateStartTime);
  }

  static async getByBookMD5(db: DB, book_md5: string): Promise<PageStat[]> {
    const stats = await db
      .select()
      .from(schema.pageStat)
      .where(eq(schema.pageStat.book_md5, book_md5));
    return stats.map(this.updateStartTime);
  }

  static async insert(db: DB, data: PageStat): Promise<void> {
    await db.insert(schema.pageStat).values(data);
  }

  static async update(
    db: DB,
    book_md5: string,
    device_id: string,
    page: number,
    start_time: number,
    data: PgUpdateSetSource<typeof schema.pageStat>
  ): Promise<void> {
    const mapped: any = {};
    if ('duration' in data) mapped.duration = data.duration;
    if ('total_pages' in data || 'totalPages' in data)
      mapped.totalPages = (data as any).total_pages || (data as any).totalPages;

    await db
      .update(schema.pageStat)
      .set(mapped)
      .where(
        and(
          eq(schema.pageStat.book_md5, book_md5),
          eq(schema.pageStat.device_id, device_id),
          eq(schema.pageStat.page, page),
          eq(schema.pageStat.start_time, start_time)
        )
      );
  }
}
