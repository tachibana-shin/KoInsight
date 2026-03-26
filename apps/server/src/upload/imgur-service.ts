import { appConfig } from '../config';

export class ImgurService {
  private static CLIENT_ID = appConfig.imgur.clientId;

  static async uploadImage(imageBuffer: Buffer): Promise<string> {
    if (!this.CLIENT_ID) {
      console.warn('IMGUR_CLIENT_ID not set, skipping upload');
      return '';
    }

    const formData = new FormData();
    formData.append('image', new Blob([new Uint8Array(imageBuffer)]));

    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${this.CLIENT_ID}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Imgur upload failed: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    return result.data.link;
  }
}
