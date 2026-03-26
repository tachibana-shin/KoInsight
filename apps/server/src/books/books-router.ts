import { Hono } from 'hono';
import { BooksRepository } from './books-repository';
import { BooksService } from './books-service';
import { getBookById } from './get-book-by-id-middleware';
import { AppContext } from '../types';

const books = new Hono<AppContext>();

// Note: coversRouter needs to be refactored too.
// For now, we'll assume it's refactored or we'll refactor it next.
// import { coversRouter } from './covers/covers-router';
// books.route('/:bookId/cover', coversRouter);

/**
 * Get all books with attached entity data
 */
books.get('/', async (c) => {
  const returnDeleted = c.req.query('showHidden') === 'true';
  const db = c.get('db');
  const booksData = await BooksRepository.getAllWithData(db, returnDeleted);
  return c.json(booksData);
});

/**
 * Get a book with attached entity data by ID
 */
books.get('/:bookId', getBookById, async (c) => {
  const book = c.get('book')!;
  // const includeDeleted = c.req.query('includeDeleted') === 'true';
  const db = c.get('db');
  const bookWithData = await BooksService.withData(db, book);
  return c.json(bookWithData);
});

/**
 * Delete a book by ID
 */
books.delete('/:bookId', getBookById, async (c) => {
  const book = c.get('book')!;
  const db = c.get('db');
  try {
    await BooksRepository.delete(db, book);
    return c.json({ message: 'Book deleted' });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to delete book' }, 500);
  }
});

books.put('/:bookId/hide', getBookById, async (c) => {
  const book = c.get('book')!;
  const { hidden } = await c.req.json();
  const db = c.get('db');

  if (hidden === undefined || hidden === null) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  try {
    await BooksRepository.softDelete(db, book.id, hidden);
    return c.json({ message: `Book ${hidden ? 'hidden' : 'shown'}` });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to update book visibility' }, 500);
  }
});

/**
 * Adds a new genre to a book
 */
books.post('/:bookId/genres', getBookById, async (c) => {
  const book = c.get('book')!;
  const { genreName } = await c.req.json();
  const db = c.get('db');

  if (!genreName) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  try {
    await BooksRepository.addGenre(db, book.md5, genreName);
    return c.json({ message: 'Genre added' });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to add genre' }, 500);
  }
});

/**
 * Updates a book's reference pages
 */
books.put('/:bookId/reference_pages', getBookById, async (c) => {
  const book = c.get('book')!;
  const { reference_pages } = await c.req.json();
  const db = c.get('db');

  if (reference_pages === undefined || reference_pages === null) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  try {
    await BooksRepository.setReferencePages(db, book.id, reference_pages);
    return c.json({ message: 'Reference pages updated' });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to update reference pages' }, 500);
  }
});

export { books as booksRouter };
