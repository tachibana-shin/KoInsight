import { Hono } from 'hono';
import { DeviceRepository } from '../devices/device-repository';
import { AppContext } from '../types';

const devices = new Hono<AppContext>();

devices.get('/', async (c) => {
  const db = c.get('db');
  const allDevices = await DeviceRepository.getAll(db);
  return c.json(allDevices);
});

export { devices as devicesRouter };
