import { Hono } from 'hono';
import { BooksRepository } from '../books/books-repository';
import { StatsRepository } from './StatsRepository';
import { StatsService } from './stats-service';

const stats = new Hono();

/**
 * Get all stats
 */
stats.get('/', async (c) => {
  const books = await BooksRepository.getAllWithData();
  const totalPagesRead = StatsService.totalPagesRead(books);

  const allStats = await StatsRepository.getAll();
  const perMonth = StatsService.getPerMonthReadingTime(allStats);
  const perDayOfTheWeek = StatsService.perDayOfTheWeek(allStats);
  const mostPagesInADay = StatsService.mostPagesInADay(books, allStats);
  const totalReadingTime = StatsService.totalReadingTime(allStats);
  const longestDay = StatsService.longestDay(allStats);
  const last7DaysReadTime = StatsService.last7DaysReadTime(allStats);

  const response = {
    stats: allStats,
    perMonth,
    perDayOfTheWeek,
    mostPagesInADay,
    totalReadingTime,
    longestDay,
    last7DaysReadTime,
    totalPagesRead,
  };

  return c.json(response);
});

/**
 * Get stats by book md5
 */
stats.get('/:book_md5', async (c) => {
  const book_md5 = c.req.param('book_md5');
  const bookStats = await StatsRepository.getByBookMD5(book_md5);
  return c.json(bookStats);
});

export { stats as statsRouter };
