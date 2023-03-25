import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import ru from 'date-fns/locale/ru';

export const formatFromTimestamp = (date: number, targetFormat: string) => {
  return format(fromUnixTime(date), targetFormat, { locale: ru });
};

export const monthViewFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
  day: 'numeric',
});
