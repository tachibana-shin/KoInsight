import { Hono } from 'hono';
import { appConfig } from '../config';
import { UploadService } from './upload-service';
import { WebDavService } from './webdav-service';
import { AppContext } from '../types';

const upload = new Hono<AppContext>();

upload.post('/', async (c) => {
  const body = await c.req.parseBody();
  const file = body['file'];

  if (!(file instanceof File)) {
    return c.json({ error: 'No file uploaded' }, 400);
  }

  if (file.size > appConfig.upload.maxFileSizeMegaBytes * 1024 * 1024) {
    return c.json({ error: 'File too large' }, 413);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let bsqlite;
  try {
    bsqlite = await UploadService.openStatisticsDbFile(buffer);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Invalid SQLite file or no books found' }, 400);
  }

  try {
    const { newBooks, newPageStats } = UploadService.extractDataFromStatisticsDb(bsqlite);
    const db = c.get('db');
    await UploadService.uploadStatisticData(db, newBooks, newPageStats);

    // Backup to WebDAV if configured
    try {
      if (appConfig.webdav.url) {
        const remotePath = `/backups/statistics-${Date.now()}.sqlite3`;
        await WebDavService.uploadFile(remotePath, buffer);
        console.log(`Uploaded backup to WebDAV: ${remotePath}`);
      }
    } catch (webdavErr) {
      console.error('WebDAV backup failed:', webdavErr);
      // Don't fail the whole request if backup fails
    }

    return c.json({ message: 'Database imported successfully' });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to import database' }, 500);
  } finally {
    bsqlite.close();
  }
});

export { upload as uploadRouter };