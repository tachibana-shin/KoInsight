import { Genre } from '@koinsight/common/types/genre';
import { DB } from '../db';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

type GenreCreate = Omit<Genre, 'id'>;

export class GenreRepository {
  static async getAll(db: DB): Promise<Genre[]> {
    return await db.select().from(schema.genre);
  }

  static async getByName(db: DB, name: string): Promise<Genre | undefined> {
    const [result] = await db.select().from(schema.genre).where(eq(schema.genre.name, name));
    return result;
  }

  static async getByBookMd5(db: DB, md5: string): Promise<Genre[]> {
    const results = await db
      .select({
        id: schema.genre.id,
        name: schema.genre.name,
      })
      .from(schema.genre)
      .innerJoin(schema.bookGenre, eq(schema.bookGenre.genre_id, schema.genre.id))
      .where(eq(schema.bookGenre.book_md5, md5));

    return results;
  }

  static async create(db: DB, genre: GenreCreate): Promise<Genre> {
    const [createdGenre] = await db.insert(schema.genre).values(genre).returning();
    return createdGenre;
  }

  static async findOrCreate(db: DB, genre: GenreCreate): Promise<Genre> {
    const existingGenre = await this.getByName(db, genre.name);
    if (existingGenre) {
      return existingGenre;
    } else {
      return this.create(db, genre);
    }
  }
}
