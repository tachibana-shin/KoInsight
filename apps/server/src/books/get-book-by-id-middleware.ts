import { Context, Next } from 'hono';
import { BooksRepository } from './books-repository';
import { AppContext } from '../types';

export const getBookById = async (c: Context<AppContext>, next: Next) => {
  const bookId = Number(c.req.param('bookId'));
  const db = c.get('db');

  if (isNaN(bookId)) {
    return c.json({ error: 'Invalid book ID' }, 400);
  }

  const book = await BooksRepository.getById(db, bookId);

  if (!book) {
    return c.json({ error: 'Book not found' }, 404);
  }

  c.set('book', book);
  await next();
};
