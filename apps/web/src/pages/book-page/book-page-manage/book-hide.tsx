import { Book } from '@koinsight/common/types';
import { Switch, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { mutate } from 'swr';
import { hideBook, showBook } from '../../../api/books';
import { RoutePath } from '../../../routes';

export type BookHideProps = {
  book: Book;
};

export function BookHide({ book }: BookHideProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [hideLoading, setHideLoading] = useState(false);

  const onUpdate = async (hidden: boolean) => {
    try {
      setHideLoading(true);

      if (hidden) {
        await hideBook(book.id);
      } else {
        await showBook(book.id);
      }

      await mutate('books');
      await mutate(`books/${book.id}`);

      if (hidden) {
        navigate(RoutePath.HOME);
      }

      notifications.show({
        title: hidden ? t('manage.hideSuccess') : t('manage.showSuccess'),
        message: hidden
          ? t('manage.hideSuccessMessage', { title: book?.title ?? 'Book' })
          : t('manage.showSuccessMessage', { title: book?.title ?? 'Book' }),
        color: 'green',
        position: 'top-center',
      });
    } catch (error) {
      console.warn(error)
      notifications.show({
        title: hidden ? t('manage.hideFailed') : t('manage.showFailed'),
        message: hidden ? t('manage.hideFailedMessage') : t('manage.showFailedMessage'),
        color: 'red',
        position: 'top-center',
      });
    } finally {
      setHideLoading(false);
    }
  };

  return (
    <div>
      <Title order={3} mb="md">
        {t('manage.hideTitle')}
      </Title>
      <Text size="sm" mb="md" lh="xl">
        {t('manage.hideDescription')}
      </Text>
      <Switch
        disabled={hideLoading}
        label={t('manage.hideLabel')}
        checked={book.soft_deleted_at !== null}
        onChange={(e) => onUpdate(e.target.checked)}
      ></Switch>
    </div>
  );
}
