import { Checkbox, Flex, Group, Select, Stack, TextInput, Tooltip } from '@mantine/core';
import { IconArrowsDownUp, IconCategory, IconSearch } from '@tabler/icons-react';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { GroupBy, SortBy, useAnnotationFilters } from './use-annotation-filters';

export function AnnotationFiltersComponent(): JSX.Element {
  const { t } = useTranslation();
  const {
    types,
    toggleType,
    searchTerm,
    setSearchTerm,
    showDeleted,
    setShowDeleted,
    sortBy,
    setSortBy,
    groupBy,
    setGroupBy,
  } = useAnnotationFilters();

  return (
    <Stack gap="md">
      <Flex align="center" gap="md">
        <TextInput
          placeholder={t('annotations.searchPlaceholder')}
          leftSection={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          style={{ flex: 1 }}
        />

        <Group gap="md" ml="auto">
          <Checkbox
            label={t('annotations.highlights_label')}
            checked={types.includes('highlight')}
            onChange={() => toggleType('highlight')}
          />
          <Checkbox
            label={t('annotations.notes_label')}
            checked={types.includes('note')}
            onChange={() => toggleType('note')}
          />
          <Checkbox
            label={t('annotations.bookmarks_label')}
            checked={types.includes('bookmark')}
            onChange={() => toggleType('bookmark')}
          />
          <Checkbox
            label={t('annotations.showDeleted')}
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.currentTarget.checked)}
          />
        </Group>
      </Flex>

      <Group gap="md">
        <Tooltip label={t('annotations.sortBy')} openDelay={1000} position="top" withArrow>
          <Select
            leftSection={<IconArrowsDownUp size={16} />}
            value={sortBy}
            onChange={(value) => setSortBy(value as SortBy)}
            data={[
              { value: 'newest', label: t('annotations.sortNewest') },
              { value: 'oldest', label: t('annotations.sortOldest') },
              { value: 'page-asc', label: t('annotations.sortPageAsc') },
              { value: 'page-desc', label: t('annotations.sortPageDesc') },
            ]}
            style={{ width: 200 }}
          />
        </Tooltip>

        <Tooltip label={t('annotations.groupBy')} openDelay={1000} position="top" withArrow>
          <Select
            leftSection={<IconCategory size={16} />}
            value={groupBy}
            onChange={(value) => setGroupBy(value as GroupBy)}
            data={[
              { value: 'none', label: t('annotations.groupNone') },
              { value: 'type', label: t('annotations.groupType') },
              { value: 'chapter', label: t('annotations.groupChapter') },
            ]}
            style={{ width: 200 }}
          />
        </Tooltip>
      </Group>
    </Stack>
  );
}
