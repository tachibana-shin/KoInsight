import { user } from '../db/schema';

export type User = typeof user.$inferSelect;
