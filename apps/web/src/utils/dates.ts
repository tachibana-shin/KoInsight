import { Duration } from 'date-fns';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { formatDuration } from 'date-fns/formatDuration';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { enUS, vi, ja } from 'date-fns/locale';
import i18n from '../i18n';

const locales: Record<string, typeof enUS> = {
  en: enUS,
  vi: vi,
  ja: ja,
};

function getLocale() {
  return locales[i18n.language] || enUS;
}

export function getDuration(seconds: number): Duration {
  return intervalToDuration({ start: 0, end: seconds * 1000 });
}

export function shortDuration(duration: Duration): string {
  const hours = String(duration.hours ?? 0).padStart(2, '0');
  const minutes = String(duration.minutes ?? 0).padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function formatSecondsToHumanReadable(seconds: number, hideSeconds = true): string {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  const locale = getLocale();

  if (!hideSeconds) {
    return formatDuration(duration, { locale });
  }

  if (!duration.minutes && !duration.hours && !duration.seconds) {
    return i18n.t('common.none');
  }

  if (!duration.minutes && !duration.hours && duration.seconds && duration.seconds > 0) {
    return i18n.t('common.lessThanAMinute');
  }

  return formatDuration(duration, {
    format: ['months', 'days', 'hours', 'minutes'],
    locale,
  });
}

export function formatRelativeDate(date: number): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: getLocale(),
  });
}
