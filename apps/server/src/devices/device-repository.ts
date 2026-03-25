import { Device } from '@koinsight/common/types/device';
import { DB } from '../db';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

export class DeviceRepository {
  static async getAll(db: DB): Promise<Device[]> {
    return await db.select().from(schema.device);
  }

  static async getById(db: DB, id: string): Promise<Device | void> {
    const [result] = await db.select().from(schema.device).where(eq(schema.device.id, id));
    return result;
  }

  static async getByModel(db: DB, model: string): Promise<Device | void> {
    const [result] = await db.select().from(schema.device).where(eq(schema.device.model, model));
    return result;
  }

  static async insertIfNotExists(db: DB, device: Device): Promise<void> {
    await db.insert(schema.device).values(device).onConflictDoNothing();
  }

  static async findOrCreateByModel(db: DB, model: string): Promise<Device> {
    const [existingDevice] = await db.select().from(schema.device).where(eq(schema.device.model, model));

    if (existingDevice) {
      return existingDevice;
    }

    const [result] = await db.insert(schema.device).values({
      id: crypto.randomUUID(), // Need an ID for Postgres if it's not provided
      model
    }).returning();

    return result;
  }
}
