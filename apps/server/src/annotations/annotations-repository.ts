import { Annotation, AnnotationType, KoReaderAnnotation } from '@koinsight/common/types';
import {
  and,
  desc,
  eq,
  InferInsertModel,
  isNotNull,
  isNull,
  sql,
  SQL
} from 'drizzle-orm';
import { PgQueryResultHKT, PgTransaction, PgUpdateSetSource } from 'drizzle-orm/pg-core';
import { DB } from '../db';
import * as schema from '../db/schema';

export class AnnotationsRepository {
  /**
   * Get all annotations for a book, optionally filtered by device
   */
  static async getByBookMd5(db: DB, md5: string, deviceId?: string): Promise<Annotation[]> {
    let whereClause: SQL = eq(schema.annotation.bookMd5, md5);

    if (deviceId) {
      whereClause = and(whereClause, eq(schema.annotation.deviceId, deviceId))!;
    }

    const annotations = await db
      .select()
      .from(schema.annotation)
      .where(whereClause)
      .orderBy(desc(schema.annotation.datetime));

    return annotations.map((a) => ({
      ...a,
      book_md5: a.bookMd5,
      device_id: a.deviceId,
      annotation_type: a.annotationType,
      page_ref: a.pageRef,
      datetime_updated: a.datetimeUpdated,
      total_pages: a.totalPages,
      deleted_at: a.deletedAt,
      created_at: a.createdAt,
      updated_at: a.updatedAt,
      pos0: a.pos0 ? JSON.parse(a.pos0) : undefined,
      pos1: a.pos1 ? JSON.parse(a.pos1) : undefined,
      deleted: Boolean(a.deletedAt),
    }));
  }

  /**
   * Get annotations by type for a book
   */
  static async getByType(
    db: DB,
    md5: string,
    type: AnnotationType,
    deviceId?: string
  ): Promise<Annotation[]> {
    const annotations = await this.getByBookMd5(db, md5, deviceId);
    return annotations.filter((a) => a.annotationType === type);
  }

  /**
   * Get all annotations for a device
   */
  static async getByDeviceId(db: DB, deviceId: string): Promise<Annotation[]> {
    const annotations = await db
      .select()
      .from(schema.annotation)
      .where(eq(schema.annotation.deviceId, deviceId))
      .orderBy(desc(schema.annotation.datetime));

    return annotations.map((a) => ({
      ...a,
      pos0: a.pos0 ? JSON.parse(a.pos0) : undefined,
      pos1: a.pos1 ? JSON.parse(a.pos1) : undefined,
    }));
  }

  /**
   * Bulk insert annotations from KoReader
   */
  static async bulkInsert<T extends PgQueryResultHKT>(
    db: DB,
    bookMd5: string,
    deviceId: string,
    koreaderAnnotations: KoReaderAnnotation[],
    tx?: PgTransaction<T, any, any>
  ): Promise<void> {
    if (koreaderAnnotations.length === 0) {
      return;
    }

    const executor = tx || db;

    for (const ka of koreaderAnnotations) {
      let annotationType: AnnotationType;
      if (!ka.drawer && !ka.color && !ka.pos0 && !ka.pos1) {
        annotationType = 'bookmark';
      } else if (ka.note && ka.text) {
        annotationType = 'note';
      } else {
        annotationType = 'highlight';
      }

      await executor
        .insert(schema.annotation)
        .values({
          ...ka,
          bookMd5,
          deviceId,
          pos0: typeof ka.pos0 === 'object' ? JSON.stringify(ka.pos0) : ka.pos0,
          pos1: typeof ka.pos1 === 'object' ? JSON.stringify(ka.pos1) : ka.pos1,
          datetime: ka.datetime,
          datetimeUpdated: ka.datetime_updated,
          annotationType,
          pageRef: ka.page + '',
        } satisfies InferInsertModel<typeof schema.annotation>)
        .onConflictDoUpdate({
          target: [
            schema.annotation.bookMd5,
            schema.annotation.deviceId,
            schema.annotation.pageRef,
            schema.annotation.datetime,
          ],
          set: {
            text: ka.text,
            note: ka.note,
            datetimeUpdated: ka.datetime_updated,
            chapter: ka.chapter,
            drawer: ka.drawer,
            color: ka.color,
            updatedAt: new Date(),
          },
        });
    }
  }

  /**
   * Insert a single annotation
   */
  static async insert(
    db: DB,
    annotation: Omit<Annotation, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Annotation> {
    const [inserted] = await db
      .insert(schema.annotation)
      .values({
        bookMd5: annotation.bookMd5,
        deviceId: annotation.deviceId,
        annotationType: annotation.annotationType,
        text: annotation.text,
        note: annotation.note,
        drawer: annotation.drawer,
        color: annotation.color,
        chapter: annotation.chapter,
        pageno: annotation.pageno,
        pageRef: annotation.pageRef,
        totalPages: annotation.totalPages,
        pos0:
          typeof annotation.pos0 === 'object' ? JSON.stringify(annotation.pos0) : annotation.pos0,
        pos1:
          typeof annotation.pos1 === 'object' ? JSON.stringify(annotation.pos1) : annotation.pos1,
        datetime: annotation.datetime,
        datetimeUpdated: annotation.datetimeUpdated,
      })
      .returning();

    return {
      ...inserted,
      pos0: inserted.pos0 ? JSON.parse(inserted.pos0 as string) : undefined,
      pos1: inserted.pos1 ? JSON.parse(inserted.pos1 as string) : undefined,
    };
  }

  /**
   * Update an annotation
   */
  static async update(
    db: DB,
    id: number,
    updates: Partial<
      Omit<Annotation, 'id' | 'book_md5' | 'device_id' | 'created_at' | 'updated_at'>
    >
  ): Promise<void> {
    const data = { ...updates, updatedAt: new Date() };

    // Map snake_case to camelCase for Drizzle
    const mapped: PgUpdateSetSource<typeof schema.annotation> = {};
    if (data.text !== undefined) mapped.text = (data as any).text;
    if (data.note !== undefined) mapped.note = (data as any).note;
    if (data.drawer !== undefined) mapped.drawer = (data as any).drawer;
    if (data.color !== undefined) mapped.color = (data as any).color;
    if (data.chapter !== undefined) mapped.chapter = (data as any).chapter;
    if (data.pageno !== undefined) mapped.pageno = (data as any).pageno;
    if (data.pageRef !== undefined) mapped.pageRef = (data as any).pageRef;
    if (data.pos0 !== undefined)
      mapped.pos0 =
        typeof (data as any).pos0 === 'object'
          ? JSON.stringify((data as any).pos0)
          : (data as any).pos0;
    if (data.pos1 !== undefined)
      mapped.pos1 =
        typeof (data as any).pos1 === 'object'
          ? JSON.stringify((data as any).pos1)
          : (data as any).pos1;
    if (data.datetimeUpdated !== undefined) mapped.datetimeUpdated = (data as any).datetimeUpdated;
    if (data.updatedAt !== undefined) mapped.updatedAt = (data as any).updatedAt;

    await db.update(schema.annotation).set(mapped).where(eq(schema.annotation.id, id));
  }

  /**
   * Delete an annotation
   */
  static async delete(db: DB, id: number): Promise<void> {
    await db.delete(schema.annotation).where(eq(schema.annotation.id, id));
  }

  /**
   * Delete all annotations for a book
   */
  static async deleteByBookMd5(db: DB, md5: string): Promise<void> {
    await db.delete(schema.annotation).where(eq(schema.annotation.bookMd5, md5));
  }

  /**
   * Get counts by type for a book
   */
  static async getCountsByType(db: DB, md5: string): Promise<Record<AnnotationType, number>> {
    const counts = await db
      .select({
        type: schema.annotation.annotationType,
        count: sql<number>`count(*)`,
      })
      .from(schema.annotation)
      .where(and(eq(schema.annotation.bookMd5, md5), isNull(schema.annotation.deletedAt)))
      .groupBy(schema.annotation.annotationType);

    const result: Record<AnnotationType, number> = {
      highlight: 0,
      note: 0,
      bookmark: 0,
    };

    counts.forEach((row) => {
      result[row.type as AnnotationType] = Number(row.count);
    });

    return result;
  }

  /**
   * Get total count of deleted annotations for a book
   */
  static async getDeletedCount(db: DB, md5: string): Promise<number> {
    const [result] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(schema.annotation)
      .where(and(eq(schema.annotation.bookMd5, md5), isNotNull(schema.annotation.deletedAt)));

    return result ? Number(result.count) : 0;
  }

  /**
   * Soft-delete an annotation by ID
   */
  static async markAsDeleted(db: DB, id: number): Promise<void> {
    await db
      .update(schema.annotation)
      .set({ deletedAt: new Date() })
      .where(eq(schema.annotation.id, id));
  }

  /**
   * Soft-delete multiple annotations by their identifiers
   */
  static async markManyAsDeleted<T extends PgQueryResultHKT>(
    db: DB,
    bookMd5: string,
    deviceId: string,
    identifiers: Array<{ page_ref: string; datetime: string }>,
    tx?: PgTransaction<T, any, any>
  ): Promise<void> {
    if (identifiers.length === 0) {
      return;
    }

    const executor = tx || db;

    // Postgres supports multiple conditions in WHERE clause using ROW constructors,
    // but for simplicity and compatibility, we'll use a loop or a complex OR chain.
    // Drizzle's `inArray` can't easily do (col1, col2) IN ((v1, v2), ...).

    for (const { page_ref, datetime } of identifiers) {
      await executor
        .update(schema.annotation)
        .set({ deletedAt: new Date() })
        .where(
          and(
            eq(schema.annotation.bookMd5, bookMd5),
            eq(schema.annotation.deviceId, deviceId),
            eq(schema.annotation.pageRef, page_ref),
            eq(schema.annotation.datetime, datetime),
            isNull(schema.annotation.deletedAt)
          )
        );
    }
  }

  /**
   * Restore a soft-deleted annotation
   */
  static async restore(db: DB, id: number): Promise<void> {
    await db.update(schema.annotation).set({ deletedAt: null }).where(eq(schema.annotation.id, id));
  }
}
