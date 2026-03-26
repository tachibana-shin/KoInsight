import { Annotation, Book } from '@koinsight/common/types';
import { Anchor, Badge, Box, Group, Paper, Stack, Text } from '@mantine/core';
import {
  IconArticle,
  IconBookmark,
  IconBooks,
  IconHighlight,
  IconNote,
  IconVocabulary,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { JSX } from 'react';
import { NavLink as RouterNavLink } from 'react-router';
import { RoutePath } from '../../../routes';

type AnnotationCardProps = {
  annotation: Annotation;
  book?: Book;
};

export function AnnotationCard({ annotation, book }: AnnotationCardProps): JSX.Element {
  const getTypeIcon = () => {
    switch (annotation.annotation_type) {
      case 'highlight':
        return <IconHighlight size={14} />;
      case 'note':
        return <IconNote size={14} />;
      case 'bookmark':
        return <IconBookmark size={14} />;
      default:
        return null;
    }
  };

  // const getTypeColor = () => {
  //   switch (annotation.annotationType) {
  //     case 'highlight':
  //       return 'yellow';
  //     case 'note':
  //       return 'blue';
  //     case 'bookmark':
  //       return 'green';
  //     default:
  //       return 'gray';
  //   }
  // };

  const isDeleted = Boolean(annotation.deleted_at);

  return (
    <Paper
      withBorder
      p="md"
      radius="sm"
      style={{
        opacity: isDeleted ? 0.5 : 1,
      }}
    >
      <Stack gap="xs">
        <Group justify="space-between">
          <Group gap="xs">
            {annotation.annotation_type === 'note' && (
              <Badge leftSection={getTypeIcon()} color="blue" variant="light" size="sm">
                Note
              </Badge>
            )}
            {annotation.annotation_type === 'bookmark' && (
              <Badge leftSection={getTypeIcon()} color="green" variant="light" size="sm">
                Bookmark
              </Badge>
            )}
            {annotation.annotation_type === 'highlight' && (
              <Badge leftSection={getTypeIcon()} color="yellow" variant="light" size="sm">
                Highlight
              </Badge>
            )}
            {annotation.color && (
              <Badge variant="outline" size="sm" color="gray">
                {annotation.color}
              </Badge>
            )}
            {annotation.drawer && (
              <Badge variant="outline" size="sm" color="gray">
                {annotation.drawer}
              </Badge>
            )}
            {isDeleted && (
              <Badge color="red" variant="filled" size="sm">
                Deleted
              </Badge>
            )}
          </Group>
          <Text size="xs" c="dimmed">
            {format(annotation.datetime, 'dd MMM yyyy, HH:mm')}
          </Text>
        </Group>

        {annotation.text && (
          <Box>
            <Text size="sm" style={{ fontStyle: 'italic' }}>
              "{annotation.text}"
            </Text>
          </Box>
        )}

        {annotation.note && (
          <Box>
            <Text size="xs" fw={600} c="dimmed" mb={4}>
              Note:
            </Text>
            <Text size="sm">{annotation.note}</Text>
          </Box>
        )}

        <Group gap="md">
          {book && (
            <Anchor
              component={RouterNavLink}
              to={RoutePath.BOOK.replace(':id', book.id.toString())}
              c="dimmed"
              size="xs"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <IconBooks size={16} /> {book.title} by {book.authors}
            </Anchor>
          )}
          {annotation.chapter && (
            <Text size="xs" c="dimmed" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconArticle size={16} /> {annotation.chapter}
            </Text>
          )}
          {annotation.pageno && annotation.total_pages && (
            <Text size="xs" c="dimmed" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconVocabulary size={16} /> Page {annotation.pageno} of {annotation.total_pages}
            </Text>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}
