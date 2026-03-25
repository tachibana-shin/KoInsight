import { Context, Next } from 'hono';
import { BooksRepository } from './books-repository';
import { Book } from '@koinsight/common/types/book';

declare module 'hono' {
  interface ContextVariableMap {
    book: Book;
  }
}

export const getBookById = async (c: Context, next: Next) => {
  const bookId = Number(c.req.param('bookId'));

  if (isNaN(bookId)) {
    return c.json({ error: 'Invalid book ID' }, 400);
  }

  const book = await BooksRepository.getById(bookId);

  if (!book) {
    return c.json({ error: 'Book not found' }, 404);
  }

  c.set('book', book);
  await next();
};
