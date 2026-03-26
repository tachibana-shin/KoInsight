import { Book } from '@koinsight/common/types';
import { Button, Flex, NumberInput, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { updateBookReferencePages } from '../../../api/books';

export type BookReferencePagesProps = {
  book: Book;
};

export function BookReferencePages({ book }: BookReferencePagesProps) {
  const { t } = useTranslation();
  const [referencePages, setReferencePages] = useState(book.reference_pages ?? 0);

  const [updateLoading, setUpdateLoading] = useState(false);

  const onUpdateReferencePages = async () => {
    try {
      setUpdateLoading(true);
      await updateBookReferencePages(book.id, referencePages);
      notifications.show({
        title: t('manage.updateRefPagesSuccess'),
        message: t('manage.updateRefPagesSuccessMessage', { title: book?.title ?? 'Book' }),
        color: 'green',
        position: 'top-center',
      });
    } catch (error) {
      console.warn(error)
      notifications.show({
        title: t('manage.updateRefPagesFailed'),
        message: '',
        color: 'red',
        position: 'top-center',
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div>
      <Title order={3} mb="md">
        {t('manage.referencePageTitle')}
      </Title>
      <Text size="sm" mb="md" maw="80%" lh="xl">
        <Trans i18nKey="manage.referencePageDescription">
          KOReader tracks your reading progress based on <em>pages in the app</em>, which can vary
          depending on settings like font size, margins, and layout. For example, a 100-page book
          might show up as 150 pages in KOReader if you increase the font size.
        </Trans>
        <br />
        <br />
        <Trans i18nKey="manage.referencePageDescription2">
          To get accurate reading stats, you can set the <strong>reference page</strong> count — the
          actual number of pages in the physical or original version of the book. KoInsight will then
          adjust your stats to match that real-world page count.
        </Trans>
      </Text>
      <Flex gap="md">
        <NumberInput
          min={0}
          value={referencePages}
          onChange={(e) => setReferencePages(Number(e))}
        />
        <Button variant="subtle" loading={updateLoading} onClick={onUpdateReferencePages}>
          {t('manage.updateRefPages')}
        </Button>
      </Flex>
    </div>
  );
}
