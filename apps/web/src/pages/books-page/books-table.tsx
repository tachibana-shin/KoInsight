import { BookWithData } from '@koinsight/common/types';
import { Anchor, Flex, Image, Progress, Stack, Table, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconEyeClosed, IconHighlight } from '@tabler/icons-react';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { API_URL } from '../../api/api';
import { getBookPath } from '../../routes';
import { formatRelativeDate, getDuration, shortDuration } from '../../utils/dates';
import style from './books-table.module.css';

type BooksTableProps = {
  books: BookWithData[];
};

export function BooksTable({ books }: BooksTableProps): JSX.Element {
  const { t } = useTranslation();
  const media = useMediaQuery(`(max-width: 62em)`);

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{t('common.title')}</Table.Th>
          <Table.Th style={{ width: '200px' }} visibleFrom="md">
            {t('common.read')}
          </Table.Th>
          <Table.Th visibleFrom="md">{t('common.pages')}</Table.Th>
          <Table.Th visibleFrom="md">{t('book.totalReadTime')}</Table.Th>
          <Table.Th visibleFrom="md">{t('books.sortOptions.lastOpen')}</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {books.map((book) => (
          <Table.Tr key={book.id}>
            <Table.Td>
              <Flex align="center" gap="sm">
                <Anchor
                  to={getBookPath(book.id)}
                  component={NavLink}
                  className={style.BookCoverLink}
                >
                  {book.softDeletedAt ? (
                    <Tooltip label={t('book.hidden')} withArrow>
                      <IconEyeClosed size={13} className={style.BookHiddenIndicator} />
                    </Tooltip>
                  ) : null}
                  <Image
                    src={`${API_URL}/books/${book.id}/cover`}
                    style={{ aspectRatio: '1/1.5' }}
                    w={media ? 40 : 60}
                    fit="contain"
                    alt={book.title ?? undefined}
                    fallbackSrc="/book-placeholder-small.png"
                    radius="sm"
                    className={book.softDeletedAt ? style.BookHidden : undefined}
                  />
                </Anchor>
                <Stack gap={2} justify="center">
                  <Anchor to={getBookPath(book.id)} component={NavLink} fw={800}>
                    {book.title}
                  </Anchor>
                  <span className={style.SubTitle}>
                    {book.authors ?? t('common.unknownAuthor')}
                    {book.series !== 'N/A' ? ` · ${book.series}` : ''}
                  </span>
                  {book.annotations.length > 0 && (
                    <Tooltip label={t('book.importedAnnotations', { count: book.annotations.length })} withArrow>
                      <Flex align="center">
                        <IconHighlight size={13} />
                        &nbsp;{book.annotations.length}
                      </Flex>
                    </Tooltip>
                  )}
                </Stack>
              </Flex>
            </Table.Td>
            <Table.Td visibleFrom="md">
              {book.uniqueReadPages}
              <Progress
                value={(book.uniqueReadPages / book.totalPages) * 100}
                aria-label={t('book.percentageRead')}
                aria-valuetext={String((book.uniqueReadPages / book.totalPages) * 100)}
              />
            </Table.Td>
            <Table.Td visibleFrom="md">{book.totalPages}</Table.Td>
            <Table.Td visibleFrom="md">
              {book.totalReadTime ? shortDuration(getDuration(book.totalReadTime)) : t('common.none')}
            </Table.Td>
            <Table.Td visibleFrom="md">{formatRelativeDate(book.lastOpen * 1000)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
