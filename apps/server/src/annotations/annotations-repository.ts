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
    let whereClause: SQL = eq(schema.annotation.book_md5, md5);

    if (deviceId) {
      whereClause = and(whereClause, eq(schema.annotation.device_id, deviceId))!;
    }

    const annotations = await db
      .select()
      .from(schema.annotation)
      .where(whereClause)
      .orderBy(desc(schema.annotation.datetime));

    return annotations.map((a) => ({
      ...a,
      book_md5: a.book_md5,
      device_id: a.device_id,
      annotation_type: a.annotation_type,
      page_ref: a.page_ref,
      datetime_updated: a.datetime_updated,
      total_pages: a.total_pages,
      deleted_at: a.deleted_at,
      created_at: a.created_at,
      updated_at: a.updated_at,
      pos0: a.pos0 ? JSON.parse(a.pos0) : undefined,
      pos1: a.pos1 ? JSON.parse(a.pos1) : undefined,
      deleted: Boolean(a.deleted_at),
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
    return annotations.filter((a) => a.annotation_type === type);
  }

  /**
   * Get all annotations for a device
   */
  static async getByDeviceId(db: DB, deviceId: string): Promise<Annotation[]> {
    const annotations = await db
      .select()
      .from(schema.annotation)
      .where(eq(schema.annotation.device_id, deviceId))
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
          book_md5: bookMd5,
          device_id: deviceId,
          pos0: typeof ka.pos0 === 'object' ? JSON.stringify(ka.pos0) : ka.pos0,
          pos1: typeof ka.pos1 === 'object' ? JSON.stringify(ka.pos1) : ka.pos1,
          datetime: ka.datetime,
          datetime_updated: ka.datetime_updated,
          annotation_type: annotationType,
          page_ref: ka.page + '',
        } satisfies InferInsertModel<typeof schema.annotation>)
        .onConflictDoUpdate({
          target: [
            schema.annotation.book_md5,
            schema.annotation.device_id,
            schema.annotation.page_ref,
            schema.annotation.datetime,
          ],
          set: {
            text: ka.text,
            note: ka.note,
            datetime_updated: ka.datetime_updated,
            chapter: ka.chapter,
            drawer: ka.drawer,
            color: ka.color,
            updated_at: new Date(),
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
        ...annotation,
        pos0:
          typeof annotation.pos0 === 'object' ? JSON.stringify(annotation.pos0) : annotation.pos0,
        pos1:
          typeof annotation.pos1 === 'object' ? JSON.stringify(annotation.pos1) : annotation.pos1,
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
    if (data.page_ref !== undefined) mapped.page_ref = (data as any).pageRef;
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
    if (data.datetime_updated !== undefined) mapped.datetime_updated = (data as any).datetimeUpdated;
    if (data.updatedAt !== undefined) mapped.updated_at = (data as any).updatedAt;

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
    await db.delete(schema.annotation).where(eq(schema.annotation.book_md5, md5));
  }

  /**
   * Get counts by type for a book
   */
  static async getCountsByType(db: DB, md5: string): Promise<Record<AnnotationType, number>> {
    const counts = await db
      .select({
        type: schema.annotation.annotation_type,
        count: sql<number>`count(*)`,
      })
      .from(schema.annotation)
      .where(and(eq(schema.annotation.book_md5, md5), isNull(schema.annotation.deleted_at)))
      .groupBy(schema.annotation.annotation_type);

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
      .where(and(eq(schema.annotation.book_md5, md5), isNotNull(schema.annotation.deleted_at)));

    return result ? Number(result.count) : 0;
  }

  /**
   * Soft-delete an annotation by ID
   */
  static async markAsDeleted(db: DB, id: number): Promise<void> {
    await db
      .update(schema.annotation)
      .set({ deleted_at: new Date() })
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
        .set({ deleted_at: new Date() })
        .where(
          and(
            eq(schema.annotation.book_md5, bookMd5),
            eq(schema.annotation.device_id, deviceId),
            eq(schema.annotation.page_ref, page_ref),
            eq(schema.annotation.datetime, datetime),
            isNull(schema.annotation.deleted_at)
          )
        );
    }
  }

  /**
   * Restore a soft-deleted annotation
   */
  static async restore(db: DB, id: number): Promise<void> {
    await db.update(schema.annotation).set({ deleted_at: null }).where(eq(schema.annotation.id, id));
  }
}
