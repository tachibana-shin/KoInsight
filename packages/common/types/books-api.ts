import { Annotation } from './annotation';
import { Book } from './book';
import { BookDevice } from './book-device';
import { Genre } from './genre';
import { PageStat } from './page-stat';

type Stats = {
  lastOpen: number;
  totalReadTime: number;
  totalPages: number;
  totalReadPages: number;
  uniqueReadPages: number;
  notes: number;
  highlights: number;
  readPerDay: Record<string, number>;
  startedReading: number;
  highlightsCount: number;
  notesCount: number;
  bookmarksCount: number;
  deletedCount: number;
};

type RelatedEntities = {
  stats: PageStat[];
  deviceData: BookDevice[];
  genres: Genre[];
  annotations: Annotation[];
};

export type BookWithData = Book & Stats & RelatedEntities;
