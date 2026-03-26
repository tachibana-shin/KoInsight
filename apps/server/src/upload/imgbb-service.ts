import { appConfig } from '../config';

/**
 * ImgBB image upload service.
 * Requires only a free API key: https://api.imgbb.com/
 */
export class ImgBBService {
  static isConfigured(): boolean {
    return Boolean(appConfig.imgbb.apiKey);
  }

  static async uploadImage(imageBuffer: Buffer, name = 'book-cover'): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('ImgBB is not configured');
    }

    const base64 = imageBuffer.toString('base64');

    const form = new FormData();
    form.append('key', appConfig.imgbb.apiKey);
    form.append('image', base64);
    form.append('name', name);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`ImgBB upload failed: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    // Use display_url (direct image link) for embedding
    return result.data.display_url as string;
  }
}
