import { Book } from '@koinsight/common/types/book';
import path from 'node:path';
import { WebDavService } from '../../upload/webdav-service';

const COVERS_REMOTE_PATH = '/covers';

type UploadFile = {
  arrayBuffer: () => Promise<ArrayBuffer>;
  name: string;
  type: string;
};

export class CoversService {
  static async get(book: Book): Promise<{ buffer: Buffer; mime: string } | null> {
    try {
      const files = await WebDavService.listDirectory(COVERS_REMOTE_PATH);
      const file = files.find((f) => f.startsWith(book.md5));
      if (file) {
        const buffer = await WebDavService.downloadFile(`${COVERS_REMOTE_PATH}/${file}`);
        const ext = file.split('.').pop() ?? 'jpg';
        const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
        return { buffer, mime };
      }
      return null;
    } catch (e) {
      console.error('Error fetching cover from WebDAV:', e);
      return null;
    }
  }

  static async deleteExisting(book: Book) {
    try {
      const files = await WebDavService.listDirectory(COVERS_REMOTE_PATH);
      const file = files.find((f) => f.startsWith(book.md5));
      if (file) {
        await WebDavService.deleteFile(`${COVERS_REMOTE_PATH}/${file}`);
      }
    } catch (e) {
      console.error('Error deleting cover from WebDAV:', e);
    }
  }

  static async upload(book: Book, file: UploadFile) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = path.extname(file.name) || '.jpg';
    const remotePath = `${COVERS_REMOTE_PATH}/${book.md5}${extension}`;
    await WebDavService.uploadFile(remotePath, buffer);
  }

  static async uploadBuffer(book: Book, buffer: Buffer, extension: string = '.jpg') {
    const remotePath = `${COVERS_REMOTE_PATH}/${book.md5}${extension}`;
    await WebDavService.uploadFile(remotePath, buffer);
  }
}
