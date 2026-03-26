import { annotation } from '../db/schema';

export type Annotation = Omit<typeof annotation.$inferSelect, 'pos0' | 'pos1'> & {
  pos0?: AnnotationPosition | string | null;
  pos1?: AnnotationPosition | string | null;
};

export type AnnotationType = 'highlight' | 'note' | 'bookmark';

export type AnnotationPosition = {
  x: number;
  y: number;
  page: number;
};

// What we receive from KoReader plugin (.sdr metadata files)
export type KoReaderAnnotation = {
  datetime: string;
  datetime_updated?: string;
  drawer?: string;
  color?: string;
  text?: string;
  text_edited?: boolean;
  note?: string;
  chapter?: string;
  pageno?: number;
  pageref?: string;
  page: number | string; // PDF: number, EPUB: xPointer string
  total_pages?: number; // Total pages in document at time of annotation
  pos0?: AnnotationPosition;
  pos1?: AnnotationPosition;
  pboxes?: unknown[]; // PDF position boxes (advanced)
  ext?: unknown; // Multi-page highlight data
};
