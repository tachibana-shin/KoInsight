import { PageStat } from '@koinsight/common/types';
import { eq, isNull, and } from 'drizzle-orm';
import { db } from '../db';
import * as schema from '../db/schema';


export class StatsRepository {
    private static updateStartTime(stat: PageStat): PageStat {
        return {
            ...stat,
            start_time: stat.start_time * 1000,
        };
    }

    static async getAll(): Promise<PageStat[]> {
        const stats = await db.select({
            id: schema.pageStat.id,
            bookMd5: schema.pageStat.bookMd5,
            deviceId: schema.pageStat.deviceId,
            page: schema.pageStat.page,
            duration: schema.pageStat.duration,
            totalPages: schema.pageStat.totalPages,
            startTime: schema.pageStat.startTime,
        })
            .from(schema.pageStat)
            .innerJoin(schema.book, eq(schema.pageStat.bookMd5, schema.book.md5))
            .where(isNull(schema.book.softDeletedAt));

        return stats.map(this.updateStartTime);
    }

    static async getByBookMD5(book_md5: string): Promise<PageStat[]> {
        const stats = await db.select().from(schema.pageStat).where(eq(schema.pageStat.bookMd5, book_md5));
        return stats.map(this.updateStartTime);
    }

    static async insert(data: PageStat): Promise<void> {
        await db.insert(schema.pageStat).values(data);
    }

    static async update(
        book_md5: string,
        device_id: string,
        page: number,
        start_time: number,
        data: PgUpdateSetSource<typeof schema.pageStat>
    ): Promise<void> {
        const mapped: any = {};
        if ('duration' in data) mapped.duration = data.duration;
        if ('total_pages' in data || 'totalPages' in data) mapped.totalPages = data.total_pages || data.totalPages;

        await db.update(schema.pageStat)
            .set(mapped)
            .where(and(
                eq(schema.pageStat.bookMd5, book_md5),
                eq(schema.pageStat.deviceId, device_id),
                eq(schema.pageStat.page, page),
                eq(schema.pageStat.startTime, start_time)
            ));
    }
}
