import { Button, Flex, Modal, ModalProps, Stack, Text } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { JSX } from 'react';

export type DownloadPluginModalProps = Pick<ModalProps, 'opened' | 'onClose'>;

export function DownloadPluginModal({ opened, onClose }: DownloadPluginModalProps): JSX.Element {
  return (
    <Modal
      title="Download KOReader Plugin"
      styles={{
        title: {
          fontSize: 'var(--mantine-font-size-xl)',
          fontWeight: 700,
          fontFamily: 'Noto Sans',
          paddingTop: 'var(--mantine-spacing-xs)',
        },
      }}
      opened={opened}
      onClose={onClose}
      size="lg"
      radius="lg"
      centered
    >
      <Flex direction="column" gap="sm" align="flex-start">
        <Flex align="center" gap="lg">
          <IconDownload size={150} />
          <Stack>
            <Text>
              Download a zip bundle of the KoInsight plugin for KOReader that allows you to sync
              your reading statistics with a KoInsight instance.
            </Text>
            <Text>
              To install the plugin, extract the contents of the zip file into the KOReader plugins
              directory on your device.
            </Text>
          </Stack>
        </Flex>

        <Button component="a" href="/api/plugin/download" leftSection={<IconDownload size={16} />}>
          Download KOReader Plugin
        </Button>
      </Flex>
    </Modal>
  );
}
