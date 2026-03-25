import { Hono } from 'hono';
import { BooksRepository } from './books-repository';
import { BooksService } from './books-service';
import { getBookById } from './get-book-by-id-middleware';

const books = new Hono();

// Note: coversRouter needs to be refactored too. 
// For now, we'll assume it's refactored or we'll refactor it next.
// import { coversRouter } from './covers/covers-router';
// books.route('/:bookId/cover', coversRouter);

/**
 * Get all books with attached entity data
 */
books.get('/', async (c) => {
  const returnDeleted = c.req.query('showHidden') === 'true';
  const booksData = await BooksRepository.getAllWithData(returnDeleted);
  return c.json(booksData);
});

/**
 * Get a book with attached entity data by ID
 */
books.get('/:bookId', getBookById, async (c) => {
  const book = c.get('book');
  const includeDeleted = c.req.query('includeDeleted') === 'true';
  const bookWithData = await BooksService.withData(book, includeDeleted);
  return c.json(bookWithData);
});

/**
 * Delete a book by ID
 */
books.delete('/:bookId', getBookById, async (c) => {
  const book = c.get('book');
  try {
    await BooksRepository.delete(book);
    return c.json({ message: 'Book deleted' });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to delete book' }, 500);
  }
});

books.put('/:bookId/hide', getBookById, async (c) => {
  const book = c.get('book');
  const { hidden } = await c.req.json();

  if (hidden === undefined || hidden === null) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  try {
    await BooksRepository.softDelete(book.id, hidden);
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
  const book = c.get('book');
  const { genreName } = await c.req.json();

  if (!genreName) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  try {
    await BooksRepository.addGenre(book.md5, genreName);
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
  const book = c.get('book');
  const { reference_pages } = await c.req.json();

  if (reference_pages === undefined || reference_pages === null) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  try {
    await BooksRepository.setReferencePages(book.id, reference_pages);
    return c.json({ message: 'Reference pages updated' });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to update reference pages' }, 500);
  }
});

export { books as booksRouter };
