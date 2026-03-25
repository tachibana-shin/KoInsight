import { Hono } from 'hono';
import { BooksRepository } from '../books/books-repository';
import { CoversService } from '../books/covers/covers-service';
import { ImageUploadService } from '../upload/image-upload-service';
import { OpenLibraryService } from './open-library-service';

const openLibrary = new Hono();

openLibrary.get('/list-covers', async (c) => {
  const searchTerm = c.req.query('searchTerm') ?? '';
  const limit = Number(c.req.query('limit') ?? 10);
  try {
    const covers = await OpenLibraryService.queryCovers(searchTerm, limit);
    return c.json(covers);
  } catch {
    return c.text('Error fetching covers', 500);
  }
});

/**
 * Fetches a book cover from Open Library API and uploads via Flickr/Imgur/WebDAV
 */
openLibrary.get('/cover', async (c) => {
  const coverId = c.req.query('coverId');
  const bookId = c.req.query('bookId');
  const size = (c.req.query('size') ?? 'M') as 'S' | 'M' | 'L';

  if (!bookId || !coverId) return c.text('Invalid request', 400);

  const book = await BooksRepository.getById(Number(bookId));
  if (!book) return c.text('Book not found', 404);

  try {
    await CoversService.deleteExisting(book);
    const cover = await OpenLibraryService.fetchCover(coverId, size);
    const coverBuffer = Buffer.from(cover);
    const provider = ImageUploadService.getProvider();

    if (provider === 'flickr' || provider === 'imgur') {
      const url = await ImageUploadService.uploadBuffer(coverBuffer, `cover-${book.md5}`);
      await BooksRepository.update(book.id, { coverUrl: url });
    } else {
      await CoversService.uploadBuffer(book, coverBuffer, '.jpg');
    }

    return c.json({ status: 'Cover updated', provider });
  } catch (e) {
    console.error(e);
    return c.text('Cover not found', 404);
  }
});

export { openLibrary as openLibraryRouter };