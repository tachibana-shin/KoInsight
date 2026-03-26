import { progress } from '../db/schema';
import { User } from './user';

export type Progress = typeof progress.$inferSelect;

export type ProgressWithUsername = Progress & Pick<User, 'username'>;
