import { Hono } from 'hono';
import { DeviceRepository } from '../devices/device-repository';

const devices = new Hono();

devices.get('/', async (c) => {
  const allDevices = await DeviceRepository.getAll();
  return c.json(allDevices);
});

export { devices as devicesRouter };
