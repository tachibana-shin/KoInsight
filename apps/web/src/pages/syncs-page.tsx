import { ProgressWithUsername } from '@koinsight/common/types/progress';
import { Anchor, Card, Code, Flex, Progress, Title, Tooltip } from '@mantine/core';
import {
  IconCode,
  IconDeviceTablet,
  IconNote,
  IconPercentage,
  IconProgress,
  IconUser,
} from '@tabler/icons-react';
import { groupBy } from 'ramda';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, NavLink } from 'react-router';
import { useProgresses } from '../api/kosync';
import { useBooks } from '../api/books';
import { EmptyState } from '../components/empty-state/empty-state';
import { RoutePath } from '../routes';

export function SyncsPage() {
  const { t } = useTranslation();
  const { data: progresses, isLoading } = useProgresses();
  const { data: books } = useBooks();

  const byDevice = useMemo(
    () => groupBy((progress: ProgressWithUsername) => progress.device_id)(progresses),
    [progresses]
  );

  const findBook = useCallback((md5: string) => books.find((book) => book.md5 === md5), [books]);

  if (isLoading) {
    return <div>{t('syncs.loading')}</div>;
  }

  return (
    <div>
      <Title mb="sm">{t('syncs.title')}</Title>
      {progresses.length === 0 ? (
        <EmptyState
          title={t('syncs.noSyncs')}
          description={t('syncs.noSyncsDescription')}
        />
      ) : (
        <>
          {Object.entries(byDevice).map(([deviceId, progresses]) => (
            <div key={deviceId}>
              <Tooltip
                position="top-start"
                withArrow
                label={t('syncs.deviceIdTooltip', { id: progresses?.[0].device_id })}
              >
                <Title order={3} mb="sm" mt="xl">
                  <Flex align="center" gap={4}>
                    <IconDeviceTablet /> {progresses?.[0].device}
                  </Flex>
                </Title>
              </Tooltip>

              <Flex gap="sm" wrap="wrap">
                {progresses?.map((progress) => (
                  <Card padding="lg" radius="md" withBorder>
                    <Flex direction="column" key={progress.id} gap="xs">
                      <Flex gap="xs" align="center">
                        <Tooltip withArrow label={t('syncs.username')}>
                          <IconUser size={18} />
                        </Tooltip>
                        <strong>{progress.username}</strong>
                      </Flex>
                      <Flex gap="xs" align="center">
                        <Tooltip withArrow label={t('syncs.document')}>
                          <IconNote size={18} />
                        </Tooltip>
                        {findBook(progress.document) ? (
                          <>
                            <Anchor
                              component={NavLink}
                              to={generatePath(RoutePath.BOOK, {
                                id: findBook(progress.document)!.id.toString(),
                              })}
                            >
                              {findBook(progress.document)!.title}
                            </Anchor>
                            <Tooltip withArrow label={t('syncs.md5Tooltip', { md5: progress.document })} position="top">
                              <IconCode size={18} />
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            {t('syncs.md5')}: <Code>{progress.document}</Code>
                          </>
                        )}
                      </Flex>
                      <Flex gap="xs" align="center">
                        <Tooltip withArrow label={t('syncs.progress')}>
                          <IconProgress size={18} />
                        </Tooltip>
                        <Code>{progress.progress}</Code>
                      </Flex>
                      <Flex gap="xs" align="center">
                        <Tooltip withArrow label={t('syncs.percentage')}>
                          <IconPercentage size={18} />
                        </Tooltip>
                        <Progress w="100" value={(progress.percentage * 100)} />{' '}
                        {(progress.percentage * 100).toFixed(2)}%
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
