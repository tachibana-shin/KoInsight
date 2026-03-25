import {
  pgTable,
  serial,
  text,
  integer,
  doublePrecision,
  timestamp,
  varchar,
  unique,
  foreignKey,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const book = pgTable('book', {
  id: serial('id').primaryKey(),
  md5: varchar('md5', { length: 32 }).notNull().unique(),
  title: varchar('title', { length: 255 }),
  authors: varchar('authors', { length: 255 }),
  notes: integer('notes').default(0),
  lastOpen: integer('last_open').default(0),
  highlights: integer('highlights').default(0),
  pages: integer('pages').default(0),
  series: varchar('series', { length: 255 }),
  language: varchar('language', { length: 255 }),
  totalReadTime: integer('total_read_time').default(0),
  totalReadPages: integer('total_read_pages').default(0),
  softDeletedAt: timestamp('soft_deleted_at'),
  referencePages: integer('reference_pages').default(0),
  coverUrl: text('cover_url'),
});

export const device = pgTable('device', {
  id: varchar('id', { length: 255 }).primaryKey(),
  model: text('model'),
});

export const pageStat = pgTable(
  'page_stat',
  {
    id: serial('id').primaryKey(),
    bookMd5: varchar('book_md5', { length: 32 }).notNull(),
    deviceId: varchar('device_id', { length: 255 }),
    page: integer('page').notNull(),
    duration: doublePrecision('duration').notNull(),
    totalPages: integer('total_pages').notNull(),
    startTime: integer('start_time').notNull(),
  },
  (t) => ({
    unq: unique().on(t.bookMd5, t.deviceId, t.page, t.startTime),
    bookFk: foreignKey({ columns: [t.bookMd5], foreignColumns: [book.md5] }).onDelete('cascade'),
    deviceFk: foreignKey({ columns: [t.deviceId], foreignColumns: [device.id] }).onDelete(
      'cascade'
    ),
  })
);

export const progress = pgTable(
  'progress',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    document: varchar('document', { length: 255 }).notNull(),
    progress: varchar('progress', { length: 255 }).notNull(),
    percentage: doublePrecision('percentage').notNull(),
    device: varchar('device', { length: 255 }).notNull(),
    deviceId: varchar('device_id', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.userId, t.document, t.deviceId),
  })
);

export const genre = pgTable('genre', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
});

export const bookGenre = pgTable(
  'book_genre',
  {
    bookMd5: varchar('book_md5', { length: 32 }).notNull(),
    genreId: integer('genre_id')
      .notNull()
      .references(() => genre.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: unique().on(t.bookMd5, t.genreId),
    bookFk: foreignKey({ columns: [t.bookMd5], foreignColumns: [book.md5] }).onDelete('cascade'),
  })
);

export const bookDevice = pgTable(
  'book_device',
  {
    id: serial('id').primaryKey(),
    bookMd5: varchar('book_md5', { length: 32 }).notNull(),
    deviceId: varchar('device_id', { length: 255 }).notNull(),
    lastOpen: integer('last_open').default(0),
    pages: integer('pages').default(0),
    notes: integer('notes').default(0),
    highlights: integer('highlights').default(0),
    totalReadPages: integer('total_read_pages').default(0),
    totalReadTime: integer('total_read_time').default(0),
  },
  (t) => ({
    unq: unique().on(t.bookMd5, t.deviceId),
    bookFk: foreignKey({ columns: [t.bookMd5], foreignColumns: [book.md5] }).onDelete('cascade'),
    deviceFk: foreignKey({ columns: [t.deviceId], foreignColumns: [device.id] }).onDelete(
      'cascade'
    ),
  })
);

export const annotation = pgTable(
  'annotation',
  {
    id: serial('id').primaryKey(),
    bookMd5: varchar('book_md5', { length: 32 }).notNull(),
    deviceId: varchar('device_id', { length: 255 }).notNull(),
    annotationType: varchar('annotation_type', { length: 20 }).notNull(),
    text: text('text'),
    note: text('note'),
    drawer: varchar('drawer', { length: 50 }),
    color: varchar('color', { length: 50 }),
    chapter: text('chapter'),
    pageno: integer('pageno'),
    pageRef: text('page_ref').notNull(),
    pos0: text('pos0'),
    pos1: text('pos1'),
    datetime: varchar('datetime', { length: 255 }).notNull(),
    datetimeUpdated: varchar('datetime_updated', { length: 255 }),
    totalPages: integer('total_pages').default(0),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.bookMd5, t.deviceId, t.pageRef, t.datetime),
    bookFk: foreignKey({ columns: [t.bookMd5], foreignColumns: [book.md5] }).onDelete('cascade'),
    deviceFk: foreignKey({ columns: [t.deviceId], foreignColumns: [device.id] }).onDelete(
      'cascade'
    ),
    deletedIdx: index('idx_annotation_deleted_at')
      .on(t.deletedAt)
      .where(sql`deleted_at IS NOT NULL`),
  })
);
