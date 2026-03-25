import { appConfig } from '../config';

/**
 * Flickr image upload service.
 * Uses the Flickr API to upload images and returns a direct photo URL.
 *
 * Required env vars:
 *   FLICKR_API_KEY       - Flickr API key
 *   FLICKR_API_SECRET    - Flickr API secret
 *   FLICKR_ACCESS_TOKEN  - OAuth access token
 *   FLICKR_TOKEN_SECRET  - OAuth token secret
 *   FLICKR_USER_ID       - Flickr user NSID (e.g. 12345678@N00)
 */
export class FlickrService {
  private static get cfg() {
    return appConfig.flickr;
  }

  static isConfigured(): boolean {
    const { apiKey, accessToken, userId } = this.cfg;
    return Boolean(apiKey && accessToken && userId);
  }

  /**
   * Upload an image buffer to Flickr and return a direct JPEG URL.
   */
  static async uploadImage(imageBuffer: Buffer, title = 'Book Cover'): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Flickr is not configured');
    }

    const { apiKey, apiSecret, accessToken, tokenSecret, userId } = this.cfg;

    // Build OAuth 1.0a signature
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomUUID().replace(/-/g, '');

    const oauthParams: Record<string, string> = {
      oauth_consumer_key: apiKey,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_token: accessToken,
      oauth_version: '1.0',
    };

    const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(tokenSecret)}`;
    const baseParams = Object.entries(oauthParams)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    const baseString = [
      'POST',
      encodeURIComponent('https://up.flickr.com/services/upload/'),
      encodeURIComponent(baseParams),
    ].join('&');

    // Sign with HMAC-SHA1 using Web Crypto API
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(signingKey),
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(baseString));
    const oauthSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));

    const authHeader =
      'OAuth ' +
      Object.entries({ ...oauthParams, oauth_signature: oauthSignature })
        .map(([k, v]) => `${k}="${encodeURIComponent(v)}"`)
        .join(', ');

    const formData = new FormData();
    formData.append('photo', new Blob([new Uint8Array(imageBuffer)], { type: 'image/jpeg' }), `${title}.jpg`);
    formData.append('title', title);
    formData.append('is_public', '1');
    formData.append('format', 'json');
    formData.append('nojsoncallback', '1');

    const response = await fetch('https://up.flickr.com/services/upload/', {
      method: 'POST',
      headers: { Authorization: authHeader },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Flickr upload HTTP error: ${response.status}`);
    }

    const result = await response.json();
    if (result.stat !== 'ok') {
      throw new Error(`Flickr upload failed: ${result.message}`);
    }

    const photoId = result.photoid._content ?? result.photoid;

    // Get direct photo URL using flickr.photos.getSizes
    const sizesUrl = new URL('https://api.flickr.com/services/rest/');
    sizesUrl.searchParams.set('method', 'flickr.photos.getSizes');
    sizesUrl.searchParams.set('api_key', apiKey);
    sizesUrl.searchParams.set('photo_id', photoId);
    sizesUrl.searchParams.set('format', 'json');
    sizesUrl.searchParams.set('nojsoncallback', '1');

    const sizesRes = await fetch(sizesUrl.toString());
    const sizesData = await sizesRes.json();

    // Prefer 'Large' size, fall back to 'Original' or biggest available
    const sizes: Array<{ label: string; source: string }> = sizesData.sizes?.size ?? [];
    const preferred = ['Large', 'Medium 800', 'Medium', 'Original'];
    for (const label of preferred) {
      const found = sizes.find((s) => s.label === label);
      if (found) return found.source;
    }

    // Fallback to last (usually largest)
    return sizes[sizes.length - 1]?.source ?? '';
  }
}
