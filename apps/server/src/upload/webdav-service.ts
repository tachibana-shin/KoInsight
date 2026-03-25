import { createClient, WebDAVClient } from 'webdav';
import { appConfig } from '../config';

export class WebDavService {
  private static client: WebDAVClient | null = null;

  private static getClient() {
    if (!this.client && appConfig.webdav.url) {
      this.client = createClient(appConfig.webdav.url, {
        username: appConfig.webdav.username,
        password: appConfig.webdav.password,
      });
    }
    return this.client;
  }

  static async uploadFile(remotePath: string, content: Buffer | string): Promise<void> {
    const client = this.getClient();
    if (!client) {
      console.warn('WebDAV not configured, skipping upload');
      return;
    }

    // Ensure directory exists (simplified)
    const dir = remotePath.split('/').slice(0, -1).join('/');
    if (dir && !(await client.exists(dir))) {
      await client.createDirectory(dir, { recursive: true });
    }

    await client.putFileContents(remotePath, content);
  }

  static async downloadFile(remotePath: string): Promise<Buffer> {
    const client = this.getClient();
    if (!client) {
      throw new Error('WebDAV not configured');
    }

    return (await client.getFileContents(remotePath)) as Buffer;
  }

  static async exists(remotePath: string): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;
    return await client.exists(remotePath);
  }

  static async deleteFile(remotePath: string): Promise<void> {
    const client = this.getClient();
    if (client && (await client.exists(remotePath))) {
      await client.deleteFile(remotePath);
    }
  }

  static async listDirectory(remotePath: string): Promise<string[]> {
    const client = this.getClient();
    if (!client) return [];
    try {
      const contents = await client.getDirectoryContents(remotePath);
      if (Array.isArray(contents)) {
        return contents.map((item: any) => item.basename);
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}
