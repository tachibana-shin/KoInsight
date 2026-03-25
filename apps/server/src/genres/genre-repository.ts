import { Genre } from '@koinsight/common/types/genre';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

type GenreCreate = Omit<Genre, 'id'>;

export class GenreRepository {
  static async getAll(): Promise<Genre[]> {
    return await db.select().from(schema.genre);
  }

  static async getByName(name: string): Promise<Genre | undefined> {
    const [result] = await db.select().from(schema.genre).where(eq(schema.genre.name, name));
    return result;
  }

  static async getByBookMd5(md5: string): Promise<Genre[]> {
    const results = await db.select({
      id: schema.genre.id,
      name: schema.genre.name
    })
    .from(schema.genre)
    .innerJoin(schema.bookGenre, eq(schema.bookGenre.genreId, schema.genre.id))
    .where(eq(schema.bookGenre.bookMd5, md5));
    
    return results;
  }

  static async create(genre: GenreCreate): Promise<Genre> {
    const [createdGenre] = await db.insert(schema.genre).values(genre).returning();
    return createdGenre;
  }

  static async findOrCreate(genre: GenreCreate): Promise<Genre> {
    const existingGenre = await this.getByName(genre.name);
    if (existingGenre) {
      return existingGenre;
    } else {
      return this.create(genre);
    }
  }
}
