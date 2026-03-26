import { BookWithData } from '@koinsight/common/types';
import { Box, Group, Image, Progress, Text, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBooks,
  IconEyeClosed,
  IconHighlight,
  IconProgress,
  IconUser,
} from '@tabler/icons-react';
import C from 'clsx';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { API_URL } from '../../api/api';
import { getBookPath } from '../../routes';

import style from './books-cards.module.css';

type BooksCardsProps = {
  books: BookWithData[];
};

export function BooksCards({ books }: BooksCardsProps): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(`(max-width: 62em)`);

  const cardWidth = isSmallScreen ? 120 : 200;

  return (
    <div
      className={style.CardGrid}
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${cardWidth}px, 1fr))` }}
    >
      {books.map((book) => (
        <Box
          key={book.id}
          className={style.Card}
          role="button"
          onClick={() => navigate(getBookPath(book.id))}
        >
          {book.soft_deleted_at ? (
            <Tooltip label={t('book.hidden')} withArrow>
              <IconEyeClosed size={16} className={style.BookHiddenIndicator} />
            </Tooltip>
          ) : null}
          <Image
            src={`${API_URL}/books/${book.id}/cover`}
            style={{ aspectRatio: '1/1.5' }}
            w={cardWidth}
            alt={book.title ?? undefined}
            fallbackSrc="/book-placeholder-small.png"
            className={book.soft_deleted_at ? style.BookHidden : undefined}
          />
          <Progress
            radius={0}
            h={5}
            value={(book.uniqueReadPages / book.totalPages) * 100}
            color="koinsight"
          />
          <Box px="lg" className={C(style.CardDetails, { [style.Small]: isSmallScreen })}>
            <Text fz="md" fw={600} style={{ wordBreak: 'break-word', whiteSpace: 'wrap' }}>
              {book.title}
            </Text>
            <Group wrap="nowrap" gap={8} mt="xs">
              <Tooltip label={t('common.author')} position="top" withArrow>
                <IconUser stroke={1.5} size={16} />
              </Tooltip>
              <span className={style.Attribute}>{book.authors ?? t('common.none')}</span>
            </Group>
            {!isSmallScreen && (
              <>
                <Group wrap="nowrap" gap={8}>
                  <Tooltip label={t('common.series')} position="top" withArrow>
                    <IconBooks stroke={1.5} size={16} />
                  </Tooltip>
                  <span className={style.Attribute}>{book.series}</span>
                </Group>
                {book.annotations.length > 0 && (
                  <Group wrap="nowrap" gap={8}>
                    <Tooltip
                      label={t('book.importedAnnotations', { count: book.annotations.length })}
                      position="top"
                      withArrow
                    >
                      <IconHighlight stroke={1.5} size={16} />
                    </Tooltip>
                    <span className={style.Attribute}>{t('book.annotations')}</span>
                  </Group>
                )}
                <Group wrap="nowrap" gap={8}>
                  <Tooltip label={t('book.pagesRead')} position="top" withArrow>
                    <IconProgress stroke={1.5} size={16} />
                  </Tooltip>
                  <span className={style.Attribute}>
                    {book.uniqueReadPages}
                    &nbsp;/&nbsp;
                    {book.totalPages} {t('book.pagesRead')}
                  </span>
                </Group>
              </>
            )}
          </Box>
        </Box>
      ))}
    </div>
  );
}
