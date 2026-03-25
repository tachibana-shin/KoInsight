import { ImgBBService } from './imgbb-service';
import { FlickrService } from './flickr-service';
import { ImgurService } from './imgur-service';
import { appConfig } from '../config';
import { CoversService } from '../books/covers/covers-service';
import { Book } from '@koinsight/common/types/book';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Centralized image upload with automatic provider priority:
 *   1. ImgBB   (if IMGBB_API_KEY is set)           ← highest priority
 *   2. Flickr  (if FLICKR_API_KEY + FLICKR_ACCESS_TOKEN + FLICKR_USER_ID)
 *   3. Imgur   (if IMGUR_CLIENT_ID is set)
 *   4. Local   (fallback)
 */
export class ImageUploadService {
  static getProvider(): 'imgbb' | 'flickr' | 'imgur' | 'local' {
    if (ImgBBService.isConfigured()) return 'imgbb';
    if (FlickrService.isConfigured()) return 'flickr';
    if (appConfig.imgur.clientId) return 'imgur';
    return 'local';
  }

  /**
   * Upload an image buffer and return the public URL (empty string for local).
   */
  static async uploadBuffer(imageBuffer: Buffer, title = 'Book Cover'): Promise<string> {
    const provider = this.getProvider();
    console.info(`[ImageUpload] Using provider: ${provider}`);

    switch (provider) {
      case 'imgbb': return ImgBBService.uploadImage(imageBuffer, title);
      case 'flickr': return FlickrService.uploadImage(imageBuffer, title);
      case 'imgur': return ImgurService.uploadImage(imageBuffer);
      default: return '';
    }
  }

  /**
   * Upload a book cover (File/Blob) and persist the URL to the DB (or save locally).
   */
  static async uploadBookCover(
    book: Book,
    file: { arrayBuffer: () => Promise<ArrayBuffer>; name: string }
  ): Promise<void> {
    const imageBuffer = Buffer.from(await file.arrayBuffer());
    const title = `cover-${book.md5}`;
    const provider = this.getProvider();

    if (provider !== 'local') {
      const url = await this.uploadBuffer(imageBuffer, title);
      await db.update(schema.book).set({ coverUrl: url }).where(eq(schema.book.id, book.id));
    } else {
      await CoversService.upload(book, file);
    }
  }
}
