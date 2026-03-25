import { pageStat } from '../db/schema';

export type PageStat = typeof pageStat.$inferSelect;

export type KoReaderPageStat = {
  page: number;
  start_time: number;
  duration: number;
  total_pages: number;
  id_book: number;
};
