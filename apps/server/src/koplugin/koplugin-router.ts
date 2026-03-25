import { KoReaderAnnotation } from '@koinsight/common/types/annotation';
import { KoReaderBook } from '@koinsight/common/types/book';
import { Device } from '@koinsight/common/types/device';
import { PageStat } from '@koinsight/common/types/page-stat';
import archiver from 'archiver';
import { Hono, Context, Next } from 'hono';
import path from 'node:path';
import { streamText } from 'hono/streaming';
import { DeviceRepository } from '../devices/device-repository';
import { UploadService } from '../upload/upload-service';
import { AppContext, Variables as AppVariables } from '../types';

type Variables = AppVariables & {
  body: any;
};

const koplugin = new Hono<{ Bindings: AppContext['Bindings']; Variables: Variables }>();

export const REQUIRED_PLUGIN_VERSION = '0.3.0';

const rejectOldPluginVersion = async (c: Context<{ Bindings: AppContext['Bindings']; Variables: Variables }>, next: Next) => {
  const body = await c.req.json().catch(() => ({}));
  const { version } = body;
  // Store body for later use since we consumed it
  c.set('body', body);

  if (!version || version !== REQUIRED_PLUGIN_VERSION) {
    return c.json(
      {
        error: `Unsupported plugin version. Version must be ${REQUIRED_PLUGIN_VERSION}. Please update your KOReader koinsight.koplugin`,
      },
      400
    );
  }
  await next();
};

koplugin.post('/device', rejectOldPluginVersion, async (c) => {
  const { id, model } = c.get('body');

  if (!id || !model) {
    return c.json({ error: 'Missing device ID or model' }, 400);
  }

  const device: Device = { id, model };
  const db = c.get('db');
  try {
    await DeviceRepository.insertIfNotExists(db, device);
    return c.json({ message: 'Device registered successfully' });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Error registering device' }, 500);
  }
});

koplugin.post('/import', rejectOldPluginVersion, async (c) => {
  const body = c.get('body');
  const koreaderBooks: KoReaderBook[] = body.books;
  const newPageStats: PageStat[] = body.stats;
  const annotations: Record<string, KoReaderAnnotation[]> = body.annotations || {};
  const deviceId: string | undefined = body.device_id;
  const db = c.get('db');

  try {
    await UploadService.uploadStatisticData(db, koreaderBooks, newPageStats, annotations, deviceId);
    return c.json({ message: 'Upload successful' });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Error importing data' }, 500);
  }
});

koplugin.get('/health', rejectOldPluginVersion, async (c) => {
  return c.json({ message: 'Plugin is healthy' });
});

koplugin.get('/download', (c) => {
  const folderPath = path.join(import.meta.dirname ?? '', '../../../../', 'plugins');
  const archive = archiver('zip', { zlib: { level: 9 } });

  c.header('Content-Type', 'application/zip');
  c.header('Content-Disposition', 'attachment; filename=koinsight.plugin.zip');

  return streamText(c, async (stream) => {
    archive.on('data', (chunk: Buffer) => stream.write(chunk));
    archive.on('end', () => stream.close());
    archive.on('error', (err: Error) => {
      console.error('Archive error:', err);
      stream.close();
    });

    archive.directory(folderPath, false);
    archive.finalize();
  });
});

export { koplugin as kopluginRouter };
