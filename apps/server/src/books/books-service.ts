import { Book, BookWithData, PageStat } from '@koinsight/common/types';
import { BookDevice } from '@koinsight/common/types/book-device';
import { startOfDay } from 'date-fns';
import { AnnotationsRepository } from 'src/annotations/AnnotationsRepository';
import { GenreRepository } from '../genres/genre-repository';
import { StatsRepository } from 'src/stats/StatsRepository';
import { normalizeRanges, Range, totalRangeLength } from '../utils/ranges';
import { BooksRepository } from './books-repository';

export class BooksService {
  static getTotalPages(book: Book, bookDevices: BookDevice[]): number {
    const refPages = book.referencePages;
    const maxPages = Math.max(...bookDevices.map((device) => device.pages || 0));
    return refPages || maxPages;
  }

  static getTotalReadTime(bookDevices: BookDevice[]): number {
    return bookDevices.reduce((acc, device) => {
      const time = device.totalReadTime
      return acc + (time || 0);
    }, 0);
  }

  static getStartedReading(stats: PageStat[]): number {
    if (stats.length === 0) return 0;
    return stats.reduce((acc, stat) => Math.min(acc, stat.startTime), Infinity);
  }

  static getLastOpen(bookDevices: BookDevice[]): number {
    return bookDevices.reduce((acc, device) => {
      const lastOpen = device.lastOpen
      return Math.max(acc, lastOpen || 0);
    }, 0);
  }

  static getReadPerDay(stats: PageStat[]): Record<string, number> {
    return stats.reduce(
      (acc, stat) => {
        const day = startOfDay(stat.startTime).getTime();
        acc[day] = (acc[day] || 0) + stat.duration;

        return acc;
      },
      {} as Record<string, number>
    );
  }

  static getUniqueReadPages(book: Book, stats: PageStat[]): number {
    const readPages: Range[] = [];
    const refPages = book.referencePages

    stats.forEach((stat) => {
      if (refPages) {
        const startRefPage = (Math.max(stat.page - 1, 0) * refPages) / stat.totalPages;
        const endRefPage = (stat.page * refPages) / stat.totalPages;

        const range = [startRefPage, endRefPage] as Range;

        readPages.push(range);
      } else {
        readPages.push([Math.max(stat.page - 1, 0), stat.page]);
      }
    });

    return Math.round(totalRangeLength(normalizeRanges(readPages)));
  }

  static getTotalReadPages(book: Book, stats: PageStat[]): number {
    const refPages = book.referencePages
    return Math.round(
      stats.reduce((acc, stat) => {
        if (refPages) {
          return acc + (1 / stat.totalPages) * refPages;
        } else {
          return acc + 1;
        }
      }, 0)
    );
  }

  static async withData(book: Book, includeDeleted = false): Promise<BookWithData> {
    const stats = await StatsRepository.getByBookMD5(book.md5);
    // getBookDevices returns DbBookDevice[] now
    const bookDevices = await BooksRepository.getBookDevices(book.md5);
    const genres = await GenreRepository.getByBookMd5(book.md5);

    // Get annotations data
    const annotations = await AnnotationsRepository.getByBookMd5(book.md5);
    const annotationCounts = await AnnotationsRepository.getCountsByType(book.md5);
    const deletedCount = await AnnotationsRepository.getDeletedCount(book.md5);

    const totalPages = this.getTotalPages(book, bookDevices);
    const totalReadTime = this.getTotalReadTime(bookDevices);
    const startedReading = this.getStartedReading(stats);
    const last_open = this.getLastOpen(bookDevices);
    const read_per_day = this.getReadPerDay(stats);
    const total_read_pages = this.getTotalReadPages(book, stats);
    const unique_read_pages = this.getUniqueReadPages(book, stats);

    // Map DbBook fields to Book fields if needed, but BookWithData allows both
    // Actually BookWithData extends Book (snake_case).
    // book is DbBook (camelCase) or Book.


    // We need to map DbBookDevice to BookDevice for the response property `device_data`
    // bookDevices is DbBookDevice[]
    const device_data: BookDevice[] = bookDevices
    const response: BookWithData = {
      ...book, // spreads camelCase fields if DbBook

      stats,
      device_data, // Mapped to snake_case
      started_reading: startedReading,
      read_per_day,
      total_read_time: totalReadTime,
      total_read_pages,
      unique_read_pages,
      total_pages: totalPages,
      last_open,
      genres,
      notes: bookDevices.reduce((acc, device) => acc + (device.notes || 0), 0),
      highlights: bookDevices.reduce((acc, device) => acc + (device.highlights || 0), 0),
      // Annotation data
      annotations,
      highlights_count: annotationCounts.highlight,
      notes_count: annotationCounts.note,
      bookmarks_count: annotationCounts.bookmark,
      deleted_count: deletedCount,
    }; // Cast to any because the spread of ...book (DbBook) adds camelCase props which are not in BookWithData explicitly, but are harmless.

    return response;
  }
}