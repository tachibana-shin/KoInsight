import { BookWithData } from '@koinsight/common/types';
import { Book } from '@koinsight/common/types/book';
import { BookDevice } from '@koinsight/common/types/book-device';
import { Genre } from '@koinsight/common/types/genre';
import { sum } from 'ramda';
import { AnnotationsRepository } from 'src/annotations/AnnotationsRepository';
import { GenreRepository } from '../genres/genre-repository';
import { db } from '../db';
import * as schema from '../db/schema';
import { StatsRepository } from 'src/stats/StatsRepository';
import { BooksService } from './books-service';
import { eq, and, isNull, like, sql, InferInsertModel } from 'drizzle-orm';
import { PgUpdateSetSource } from 'drizzle-orm/pg-core';

export class BooksRepository {
  static async getAll(): Promise<Book[]> {
    const result = await db.select().from(schema.book).where(isNull(schema.book.softDeletedAt));
    return result;
  }

  static async getById(id: number): Promise<Book | void> {
    const [result] = await db.select().from(schema.book).where(eq(schema.book.id, id));
    return result;
  }

  static async insert(book: Book): Promise<void> {
    await db.insert(schema.book).values(book);
  }

  static async update(id: number, data: PgUpdateSetSource<typeof schema.book>): Promise<void> {
    await db.update(schema.book).set(data).where(eq(schema.book.id, id));
  }

  static async softDelete(id: number, soft_deleted = true): Promise<void> {
    await db.update(schema.book)
      .set({ softDeletedAt: soft_deleted ? new Date() : null })
      .where(eq(schema.book.id, id));
  }

  static async delete(book: Book) {
    await db.transaction(async (tx) => {
      await tx.delete(schema.bookDevice).where(eq(schema.bookDevice.bookMd5, book.md5));
      await tx.delete(schema.bookGenre).where(eq(schema.bookGenre.bookMd5, book.md5));
      await tx.delete(schema.book).where(eq(schema.book.id, book.id));
    });
  }

  static async searchByTitle(title: string): Promise<Book[]> {
    const result = await db.select().from(schema.book).where(like(schema.book.title, `%${title}%`));
    return result;
  }

  static async getBookDevices(md5: Book['md5']): Promise<BookDevice[]> {
    const result = await db.select().from(schema.bookDevice).where(eq(schema.bookDevice.bookMd5, md5));
    return result;
  }

  static async getAllWithData(returnDeleted: boolean = false): Promise<BookWithData[]> {
    // In Postgres, we use json_agg and json_build_object.
    // Drizzle can do this with sql chunks.
    const books = await db.select({
      id: schema.book.id,
      md5: schema.book.md5,
      title: schema.book.title,
      authors: schema.book.authors,
      notes: schema.book.notes,
      lastOpen: schema.book.lastOpen,
      highlights: schema.book.highlights,
      pages: schema.book.pages,
      series: schema.book.series,
      language: schema.book.language,
      totalReadTime: schema.book.totalReadTime,
      totalReadPages: schema.book.totalReadPages,
      softDeletedAt: schema.book.softDeletedAt,
      referencePages: schema.book.referencePages,
      coverUrl: schema.book.coverUrl,
      genres: sql<string>`(
        SELECT json_agg(json_build_object('id', g.id, 'name', g.name))
        FROM ${schema.bookGenre} bg
        JOIN ${schema.genre} g ON g.id = bg.genre_id
        WHERE bg.book_md5 = ${schema.book.md5}
      )`,
      book_devices: sql<string>`(
        SELECT json_agg(json_build_object(
          'id', bd.id,
          'device_id', bd.device_id,
          'last_open', bd.last_open,
          'notes', bd.notes,
          'highlights', bd.highlights,
          'pages', bd.pages,
          'total_read_time', bd.total_read_time,
          'total_read_pages', bd.total_read_pages
        ))
        FROM ${schema.bookDevice} bd
        WHERE bd.book_md5 = ${schema.book.md5}
      )`
    })
      .from(schema.book)
      .where(returnDeleted ? sql`true` : isNull(schema.book.softDeletedAt));

    return Promise.all(
      books.map(async (book): Promise<BookWithData> => {
        const stats = await StatsRepository.getByBookMD5(book.md5);
        const annotations = await AnnotationsRepository.getByBookMd5(book.md5);
        const annotationCounts = await AnnotationsRepository.getCountsByType(book.md5);

        const genres = (book.genres || []) as Genre[];
        const bookDevices = (book.book_devices || []) as BookDevice[];

        // Normalize bookDevices keys from DB (snake_case from json_build_object)
        const normalizedDevices = bookDevices.map(d => ({
          ...d,
          book_md5: book.md5,
        }));

        const totalPages = BooksService.getTotalPages(book, normalizedDevices);
        const lastOpen = BooksService.getLastOpen(normalizedDevices);
        const totalReadTime = BooksService.getTotalReadTime(normalizedDevices);
        const totalReadPages = BooksService.getTotalReadPages(book, stats);
        const uniqueReadPages = BooksService.getUniqueReadPages(book, stats);
        const started_reading = BooksService.getStartedReading(stats);
        const read_per_day = BooksService.getReadPerDay(stats);

        return {
          ...book,
          last_open: lastOpen, // Override camelCase from db with computed snake_case
          total_read_time: totalReadTime,
          total_read_pages: totalReadPages,
          genres: genres,
          device_data: normalizedDevices,
          total_pages: totalPages,
          unique_read_pages: uniqueReadPages,
          highlights: sum(normalizedDevices.map((device) => device.highlights ?? 0)),
          notes: sum(normalizedDevices.map((device) => device.notes ?? 0)),
          read_per_day,
          started_reading,
          annotations,
          highlights_count: annotationCounts.highlight,
          notes_count: annotationCounts.note,
          bookmarks_count: annotationCounts.bookmark,
          deleted_count: await AnnotationsRepository.getDeletedCount(book.md5),
          stats,
        };
      })
    );
  }

  static async addGenre(md5: Book['md5'], genreName: string) {
    const genre = await GenreRepository.findOrCreate({ name: genreName });
    if (!genre) return;
    await db.insert(schema.bookGenre).values({ bookMd5: md5, genreId: genre.id }).onConflictDoNothing();
  }

  static async setReferencePages(id: number, referencePages: number | null) {
    await db.update(schema.book).set({ referencePages }).where(eq(schema.book.id, id));
  }
}