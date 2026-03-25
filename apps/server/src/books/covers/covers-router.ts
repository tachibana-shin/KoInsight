import { Hono } from 'hono';
import { ImageUploadService } from '../../upload/image-upload-service';
import { getBookById } from '../get-book-by-id-middleware';
import { CoversService } from './covers-service';

const covers = new Hono();

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif'];

/**
 * GET /:bookId/cover — serve cover from Flickr/Imgur URL or WebDAV file
 */
covers.get('/', getBookById, async (c) => {
  const book = c.get('book');

  if (book.coverUrl) {
    return c.redirect(book.coverUrl);
  }

  try {
    const cover = await CoversService.get(book);
    if (cover) {
      return c.body(new Uint8Array(cover.buffer), 200, { 'Content-Type': cover.mime });
    } else {
      return c.json({ error: 'Cover not found' }, 404);
    }
  } catch (error) {
    console.error('Error fetching cover:', error);
    return c.json({ error: 'Error fetching cover' }, 500);
  }
});

/**
 * POST /:bookId/cover — upload cover via Flickr/Imgur (or WebDAV fallback)
 */
covers.post('/', getBookById, async (c) => {
  const book = c.get('book');
  const body = await c.req.parseBody();
  const file = body['file'];

  if (!(file instanceof File)) {
    return c.json({ error: 'Missing file upload' }, 400);
  }

  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return c.json({ error: `Only ${ALLOWED_EXTENSIONS.join(', ')} files are allowed` }, 400);
  }

  if (file.size > 10 * 1024 * 1024) {
    return c.json({ error: 'File too large (max 10MB)' }, 413);
  }

  try {
    await CoversService.deleteExisting(book);
    await ImageUploadService.uploadBookCover(book, file);
    return c.json({ message: 'Cover updated', provider: ImageUploadService.getProvider() });
  } catch (error) {
    console.error('Error uploading cover:', error);
    return c.json({ message: 'Unable to update cover' }, 500);
  }
});

export { covers as coversRouter };