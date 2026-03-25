import { genre } from '../db/schema';

export type Genre = typeof genre.$inferSelect;
