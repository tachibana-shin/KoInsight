import { Book } from '@koinsight/common/types';
import { Button, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router';
import { mutate } from 'swr';
import { deleteBook } from '../../../api/books';
import { RoutePath } from '../../../routes';

export type BookDeleteProps = {
  book: Book;
};

export function BookDelete({ book }: BookDeleteProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [deleteLoading, setDeleteLoading] = useState(false);

  const openDeleteConfirm = () =>
    modals.openConfirmModal({
      title: t('manage.deleteConfirmTitle'),
      centered: true,
      children: (
        <Text size="sm">
          <Trans i18nKey="manage.deleteConfirmText" values={{ title: book?.title ?? 'this book' }}>
            Are you sure you want to delete <strong>{book ? `"${book?.title}"` : 'this book'}</strong>
            ? This action is destructive and cannot be reverted.
          </Trans>
        </Text>
      ),
      labels: { confirm: t('manage.deleteConfirmButton'), cancel: t('manage.deleteCancelButton') },
      confirmProps: { color: 'red' },
      onConfirm: onDelete,
    });

  const onDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteBook(book.id);
      await mutate('books');
      navigate(RoutePath.HOME);
      notifications.show({
        title: t('manage.deleteSuccess'),
        message: t('manage.deleteSuccessMessage', { title: book?.title ?? 'Book' }),
        color: 'green',
        position: 'top-center',
      });
    } catch (error) {
      console.warn(error)
      notifications.show({
        title: t('manage.deleteFailed'),
        message: t('manage.deleteFailedMessage'),
        color: 'red',
        position: 'top-center',
      });
    }
  };

  return (
    <div>
      <Title order={3} mb="md">
        {t('manage.deleteTitle')}
      </Title>
      <Button
        loading={deleteLoading}
        leftSection={<IconTrash size={16} />}
        variant="danger"
        onClick={openDeleteConfirm}
      >
        {t('manage.deleteButton')}
      </Button>
    </div>
  );
}
