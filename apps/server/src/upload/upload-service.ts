import {
  KoReaderAnnotation,
  KoReaderBook,
  KoReaderPageStat,
  PageStat,
} from '@koinsight/common/types';
import initSqlJs, { Database } from 'sql.js';
import { AnnotationsRepository } from 'src/annotations/AnnotationsRepository';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq, and, sql, isNull } from 'drizzle-orm';
import { PgUpdateSetSource } from 'drizzle-orm/pg-core';

export class UploadService {
  private static UNKNOWN_DEVICE_ID = 'manual-upload';

  static async openStatisticsDbFile(buffer: Buffer | Uint8Array) {
    const SQL = await initSqlJs();
    const bsqlite = new SQL.Database(buffer);

    const stmt = bsqlite.prepare('SELECT id FROM book');
    const hasBooks = stmt.step();
    stmt.free();

    if (!hasBooks) {
      throw new Error('No books found in the uploaded file');
    }

    return bsqlite;
  }

  static extractDataFromStatisticsDb(bsqlite: Database) {
    const extractRows = <T>(query: string): T[] => {
      const stmt = bsqlite.prepare(query);
      const rows: T[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject() as unknown as T);
      }
      stmt.free();
      return rows;
    };

    const newBooks = extractRows<KoReaderBook>('SELECT * FROM book');
    const dbPageStats = extractRows<KoReaderPageStat>('SELECT * FROM page_stat_data');

    const newPageStats: Omit<PageStat, 'id'>[] = dbPageStats.map(({ id_book, ...stat }) => ({
      bookMd5: newBooks.find((book) => book.id === id_book)!.md5,
      deviceId: this.UNKNOWN_DEVICE_ID,
      ...stat,
      totalPages: stat.total_pages,
      startTime: stat.start_time,
    }));

    return { newBooks, newPageStats };
  }

  static async uploadStatisticData(
    booksToImport: KoReaderBook[],
    newPageStats: Omit<PageStat, 'id'>[],
    annotationsByBook?: Record<string, KoReaderAnnotation[]>,
    deviceIdOverride?: string // For annotation sync path without stats
  ) {
    return await db.transaction(async (tx) => {
      const safePageStats = (Array.isArray(newPageStats) ? newPageStats : []).filter(
        (s) =>
          s != null &&
          typeof s === 'object' &&
          Number.isFinite(s.duration) &&
          s.duration > 0 &&
          Number.isFinite(s.totalPages) &&
          s.totalPages > 0
      );

      // Insert books
      for (const book of booksToImport) {
        await tx.insert(schema.book)
          .values({
            md5: book.md5,
            title: book.title,
            authors: book.authors,
            series: book.series,
            language: book.language,
          })
          .onConflictDoNothing({ target: schema.book.md5 });
      }

      const deviceId = safePageStats.find((s) => s.deviceId)?.deviceId ?? deviceIdOverride ?? this.UNKNOWN_DEVICE_ID;

      // Ensure device exists
      await tx.insert(schema.device)
        .values({
          id: deviceId,
          model: deviceId === this.UNKNOWN_DEVICE_ID ? 'Manual Upload' : 'Unknown Model',
        })
        .onConflictDoNothing();

      // Update/Insert book_device
      for (const book of booksToImport) {
        const last_open = Number.isFinite(book.last_open) && book.last_open > 0 ? book.last_open : 0;
        const total_read_time = (book.total_read_time ?? 0) > 0 ? book.total_read_time : 0;
        const total_read_pages = (book.total_read_pages ?? 0) > 0 ? book.total_read_pages : 0;

        const values = {
          bookMd5: book.md5,
          deviceId: deviceId,
          pages: book.pages,
          notes: book.notes,
          highlights: book.highlights,
          lastOpen: last_open,
          totalReadTime: total_read_time,
          totalReadPages: total_read_pages,
        };

        const updateData: PgUpdateSetSource<typeof schema.bookDevice> = {
          pages: values.pages,
          notes: values.notes,
          highlights: values.highlights,
        };
        if (last_open > 0) updateData.lastOpen = last_open;
        if ((total_read_time ?? 0) > 0) updateData.totalReadTime = total_read_time;
        if ((total_read_pages ?? 0) > 0) updateData.totalReadPages = total_read_pages;

        await tx.insert(schema.bookDevice)
          .values(values)
          .onConflictDoUpdate({
            target: [schema.bookDevice.bookMd5, schema.bookDevice.deviceId],
            set: updateData,
          });
      }

      // Insert page stats
      if (safePageStats.length > 0) {
        for (const stat of safePageStats) {
          await tx.insert(schema.pageStat)
            .values({
              bookMd5: stat.bookMd5,
              deviceId: deviceId,
              page: stat.page,
              duration: stat.duration,
              totalPages: stat.totalPages,
              startTime: stat.startTime,
            })
            .onConflictDoUpdate({
              target: [schema.pageStat.bookMd5, schema.pageStat.deviceId, schema.pageStat.page, schema.pageStat.startTime],
              set: {
                duration: stat.duration,
                totalPages: stat.totalPages,
              },
            });
        }
      }

      // Insert annotations
      if (annotationsByBook) {
        for (const [bookMd5, annotations] of Object.entries(annotationsByBook)) {
          await AnnotationsRepository.bulkInsert(bookMd5, deviceId, annotations, tx);
          await this.detectAndMarkDeletedAnnotations(bookMd5, deviceId, annotations, tx);
        }
      }
    });
  }

  private static async detectAndMarkDeletedAnnotations(
    bookMd5: string,
    deviceId: string,
    syncedAnnotations: KoReaderAnnotation[],
    tx: any
  ): Promise<void> {
    const existingAnnotations = await tx.select({
      pageRef: schema.annotation.pageRef,
      datetime: schema.annotation.datetime,
    })
      .from(schema.annotation)
      .where(and(
        eq(schema.annotation.bookMd5, bookMd5),
        eq(schema.annotation.deviceId, deviceId),
        isNull(schema.annotation.deletedAt)
      ));

    const syncedIdentifiers = new Set(syncedAnnotations.map((a) => `${a.page}|${a.datetime}`));

    const deletedAnnotations = existingAnnotations.filter(
      (a: { pageRef: string; datetime: string }) =>
        !syncedIdentifiers.has(`${a.pageRef}|${a.datetime}`)
    );

    if (deletedAnnotations.length > 0) {
      await AnnotationsRepository.markManyAsDeleted(bookMd5, deviceId, deletedAnnotations, tx);
      console.log(`Marked ${deletedAnnotations.length} annotations as deleted for book ${bookMd5}`);
    }
  }
}
