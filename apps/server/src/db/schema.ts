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
  id: serial().primaryKey(),
  username: varchar({ length: 255 }).notNull().unique(),
  password_hash: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});

export const book = pgTable('book', {
  id: serial().primaryKey(),
  md5: varchar({ length: 32 }).notNull().unique(),
  title: varchar({ length: 255 }),
  authors: varchar({ length: 255 }),
  notes: integer().default(0),
  last_open: integer().default(0),
  highlights: integer().default(0),
  pages: integer().default(0),
  series: varchar({ length: 255 }),
  language: varchar({ length: 255 }),
  total_read_time: integer().default(0),
  total_read_pages: integer().default(0),
  soft_deleted_at: timestamp(),
  reference_pages: integer().default(0),
  cover_url: text(),
});

export const device = pgTable('device', {
  id: varchar({ length: 255 }).primaryKey(),
  model: text(),
});

export const pageStat = pgTable(
  'page_stat',
  {
    id: serial().primaryKey(),
    book_md5: varchar({ length: 32 }).notNull(),
    device_id: varchar({ length: 255 }),
    page: integer().notNull(),
    duration: doublePrecision().notNull(),
    total_pages: integer().notNull(),
    start_time: integer().notNull(),
  },
  (t) => ({
    unq: unique().on(t.book_md5, t.device_id, t.page, t.start_time),
    bookFk: foreignKey({ columns: [t.book_md5], foreignColumns: [book.md5] }).onDelete('cascade'),
    deviceFk: foreignKey({ columns: [t.device_id], foreignColumns: [device.id] }).onDelete(
      'cascade'
    ),
  })
);

export const progress = pgTable(
  'progress',
  {
    id: serial().primaryKey(),
    user_id: integer()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    document: varchar({ length: 255 }).notNull(),
    progress: varchar({ length: 255 }).notNull(),
    percentage: doublePrecision().notNull(),
    device: varchar({ length: 255 }).notNull(),
    device_id: varchar({ length: 255 }).notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.user_id, t.document, t.device_id),
  })
);

export const genre = pgTable('genre', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
});

export const bookGenre = pgTable(
  'book_genre',
  {
    book_md5: varchar({ length: 32 }).notNull(),
    genre_id: integer()
      .notNull()
      .references(() => genre.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: unique().on(t.book_md5, t.genre_id),
    bookFk: foreignKey({ columns: [t.book_md5], foreignColumns: [book.md5] }).onDelete('cascade'),
  })
);

export const bookDevice = pgTable(
  'book_device',
  {
    id: serial().primaryKey(),
    book_md5: varchar({ length: 32 }).notNull(),
    device_id: varchar({ length: 255 }).notNull(),
    last_open: integer().default(0),
    pages: integer().default(0),
    notes: integer().default(0),
    highlights: integer().default(0),
    total_read_pages: integer().default(0),
    total_read_time: integer().default(0),
  },
  (t) => ({
    unq: unique().on(t.book_md5, t.device_id),
    bookFk: foreignKey({ columns: [t.book_md5], foreignColumns: [book.md5] }).onDelete('cascade'),
    deviceFk: foreignKey({ columns: [t.device_id], foreignColumns: [device.id] }).onDelete(
      'cascade'
    ),
  })
);

export const annotation = pgTable(
  'annotation',
  {
    id: serial().primaryKey(),
    book_md5: varchar({ length: 32 }).notNull(),
    device_id: varchar({ length: 255 }).notNull(),
    annotation_type: varchar({ length: 20 }).notNull(),
    text: text(),
    note: text(),
    drawer: varchar({ length: 50 }),
    color: varchar({ length: 50 }),
    chapter: text(),
    pageno: integer(),
    page_ref: text().notNull(),
    pos0: text(),
    pos1: text(),
    datetime: varchar({ length: 255 }).notNull(),
    datetime_updated: varchar({ length: 255 }),
    total_pages: integer().default(0),
    deleted_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.book_md5, t.device_id, t.page_ref, t.datetime),
    bookFk: foreignKey({ columns: [t.book_md5], foreignColumns: [book.md5] }).onDelete('cascade'),
    deviceFk: foreignKey({ columns: [t.device_id], foreignColumns: [device.id] }).onDelete(
      'cascade'
    ),
    deletedIdx: index('idx_annotation_deleted_at')
      .on(t.deleted_at)
      .where(sql`deleted_at IS NOT NULL`),
  })
);
