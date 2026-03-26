import { Button, FileInput, Flex, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconUpload } from '@tabler/icons-react';
import { FormEvent, JSX, useState } from 'react';
import { mutate } from 'swr';
import { useTranslation } from 'react-i18next';
import { uploadDbFile } from '../../api/upload-db-file';

export function UploadForm(): JSX.Element {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setMessage(t('upload.noFile'));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await uploadDbFile(formData);

      if (response.ok) {
        // FIXME: this doesn't seem to work.
        await mutate('books');
        notifications.show({
          title: t('upload.successTitle'),
          message: t('upload.success'),
          position: 'top-center',
          color: 'green',
        });
        setMessage('');
        close();
      } else if (response.status === 413) {
        const body = await response.json();
        setMessage(body?.error);
      } else {
        setMessage(t('upload.failed'));
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    }
  };

  return (
    <>
      <Button leftSection={<IconUpload size={16} />} onClick={open} variant="light" size="sm">
        {t('upload.button')}
      </Button>
      <Modal
        styles={{
          title: {
            fontSize: 'var(--mantine-font-size-xl)',
            fontWeight: 700,
            fontFamily: 'Noto Sans',
            paddingTop: 'var(--mantine-spacing-xs)',
          },
        }}
        title={t('upload.modalTitle')}
        opened={modalOpened}
        size="lg"
        onClose={close}
        radius="lg"
        centered
      >
        <Flex direction="column" gap="sm" mt="lg">
          <Text>{t('upload.description')}</Text>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <FileInput
              label={t('upload.fileLabel')}
              placeholder="statistics.sqlite3"
              onChange={(e) => setFile(e)}
              accept=".sqlite,.sqlite3"
              mb="sm"
            />
            <Button type="submit">{t('upload.submit')}</Button>
          </form>
          {message && <p>{message}</p>}
        </Flex>
      </Modal>
    </>
  );
}
