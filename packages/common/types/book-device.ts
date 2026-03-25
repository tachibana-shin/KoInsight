import { bookDevice } from '../db/schema';

export type BookDevice = typeof bookDevice.$inferSelect;
